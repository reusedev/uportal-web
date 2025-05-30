import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PasswordChangeService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  // 使用 Signal 存储步骤和密码
  currentStep = signal<number>(0);
  isLoading = signal<boolean>(false);

  setStep(num:number): void {
    this.currentStep.set(num);

  }

  // 设置旧密码并导航到下一步
  setOldPassword(password: string): void {
    this.currentStep.set(2);
    this.router.navigate(['/change-password/step2'], {
      queryParams: {
        old: password,
      },
    });
  }

  // 设置新密码并导航到下一步
  setNewPassword(password: string): void {
    this.currentStep.set(3);
    const old = this.route.snapshot.queryParams['old'];
    this.router.navigate(['/change-password/step3'], {
      queryParams: {
        old: old,
        new: password,
      },
    });
  }

  // 提交修改密码请求
  submitChange(): void {
    const oldPass = this.route.snapshot.queryParams['old'];
    const newPass = this.route.snapshot.queryParams['new'];

    if (!oldPass || !newPass) {
      this.message.error('密码信息不完整，请重新开始。');
      this.resetProcess();
      return;
    }

    this.isLoading.set(true);

    interface ApiResponse {
      code: number;
      message: string;
    }

    this.http
      .post<ApiResponse>('/admin/auth/change-password', {
        old_password: oldPass,
        new_password: newPass,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.message.success('密码修改成功，请重新登录');
          this.auth.logout();
          this.router.navigate(['/login']);
          this.resetState();
        },
        error: () => {
          this.isLoading.set(false);
          this.message.error('密码修改失败，请稍后重试');
        },
      });
  }

  // 返回上一步
  goBack(): void {
    const current = this.currentStep();
    if (current > 1) {
      const previousStep = current - 1;
      this.currentStep.set(previousStep);
      if (previousStep === 1) {
        const old = this.route.snapshot.queryParams['old'];
        this.router.navigate([`/change-password/step${previousStep}`], {
          queryParams: {
            old: old,
          },
        });
      } else if (previousStep === 2) {
        const old = this.route.snapshot.queryParams['old'];
        const newPass = this.route.snapshot.queryParams['new'];
        this.router.navigate([`/change-password/step${previousStep}`], {
          queryParams: {
            old: old,
            new: newPass,
          },
        });
      } else {
        this.router.navigate([`/change-password/step${previousStep}`]);
      }
    }
  }

  // 重置流程和状态 (只重置状态，不导航)
  resetState(): void {
    this.currentStep.set(1);
  }

  // 旧的 resetProcess 方法，现在调用 resetState 并导航到 step1
  resetProcess(): void {
    this.resetState();
    this.router.navigate(['/change-password/step1']);
  }
}
