import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PublicModule } from '../../public.module';
import { HttpClient } from '@angular/common/http';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

// 定义登录接口的响应类型
interface LoginResponse {
  code: number; // 业务状态码，0 表示成功
  message?: string; // 错误信息，可选
}

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PublicModule,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule,
    NzFormModule,
  ],
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  loading = false;

  // 定义 FormGroup
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit() {
    if (this.loginForm.invalid) {
      this.message.warning('请填写完整的登录信息');
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const username = this.loginForm.value.username!.trim();
    const password = this.loginForm.value.password!.trim();

    this.http
      .post<LoginResponse>('/admin/auth/login', { username, password })
      .subscribe({
        next: () => {
          this.message.success('登录成功，正在跳转', { nzDuration: 1000 });

          setTimeout(() => {
            this.loading = false;
            let referer = this.route.snapshot.queryParamMap.get('referer');

            referer =
              referer?.length && referer !== '/' ? referer : 'user/management';

            if (referer.includes('http')) {
              console.log(decodeURIComponent(referer.split('referer=')[1]))
              window.location.replace(
                decodeURIComponent(referer.split('referer=')[1])
              );
            } else {
              console.log(referer);
              window.location.replace(referer);
            }
          }, 1000);
        },
        error: () => {
          this.loading = false;
          this.message.error('登录请求出错，请稍后重试');
        },
      });
  }
}
