import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PublicModule } from '../../../../public.module';
import { HttpClient } from '@angular/common/http';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';

interface SystemConfig {
  config_key: string;
  config_value: string;
  description: string;
}

@Component({
  selector: 'app-config-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PublicModule],
  templateUrl: './config-add.component.html',
  styleUrls: ['./config-add.component.css']
})
export class ConfigAddComponent implements OnInit {
  @Input() config?: SystemConfig;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private drawerRef = inject(NzDrawerRef);
  private message = inject(NzMessageService);


  loading = false;

  // 表单提交中
  submitting = false;

  // 配置表单
  configForm: FormGroup = this.fb.group({
    config_key: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Z0-9_]*$/)]],
    config_value: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  ngOnInit(): void {
    // 如果是编辑模式，填充表单
    if (this.config) {
      this.configForm.patchValue({
        config_key: this.config.config_key,
        config_value: this.config.config_value,
        description: this.config.description
      });

      // 如果是编辑模式，禁用config_key字段
      this.configForm.get('config_key')?.disable();
    }
  }

  // 提交表单
  submitForm(): void {
    if (this.configForm.invalid) {
      // 标记所有字段为已触碰，以显示错误信息
      Object.values(this.configForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.loading = true;

    this.submitting = true;

    // 准备提交的数据
    const formData = this.configForm.getRawValue();

    // 根据是否有现有配置决定是创建还是更新
    const endpoint = this.config ? '/admin/configs/edit' : '/admin/configs/create';

    this.http.post(endpoint, formData).subscribe({
      next: () => {
        this.loading = false;
        this.submitting = false;
        this.drawerRef.close(true);

      },
      error: (err) => {
         this.loading = false;
        this.submitting = false;
        this.message.error('保存失败: ' + (err.error?.message || '未知错误'));
      }
    });
  }

  // 取消
  cancel(): void {
    this.drawerRef.close(false);
  }
}
