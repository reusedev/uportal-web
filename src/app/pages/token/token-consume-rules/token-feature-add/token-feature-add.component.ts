import { Component, inject, Input, OnInit } from '@angular/core';
import { PublicModule } from '../../../../public.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: true,
  selector: 'app-token-feature-add',
  templateUrl: './token-feature-add.component.html',
  styleUrls: ['./token-feature-add.component.css'],
  imports: [PublicModule, NgIf],
})
export class TokenFeatureAddComponent implements OnInit {
  @Input() feature!: TokenFeature;

  drawerRef = inject(NzDrawerRef);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  message = inject(NzMessageService);

  validateForm!: FormGroup;

  loading = false;

  ngOnInit() {
    if (this.feature) {
      // 如果有传入特性数据，则初始化表单
      this.validateForm = this.fb.group({
        feature_name: [this.feature.feature_name, [Validators.required]],
        feature_desc: [this.feature.feature_desc],
        token_cost: [
          this.feature.token_cost,
          [Validators.required, Validators.min(1)],
        ],
        feature_code: [
          this.feature.feature_code,
          [Validators.required,Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)]
        ],
        status: [this.feature.status], // 保持原状态
      });
      // 如果是编辑模式，禁用feature_code字段
      this.validateForm.get('feature_code')?.disable();
    } else {
      this.validateForm = this.fb.group({
        feature_name: [null, [Validators.required]],
        feature_desc: [null],
        token_cost: [null, [Validators.required, Validators.min(1)]],
        feature_code: [
          null,
         [Validators.required,Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)]
        ],
        status: [1], // 默认为启用状态
      });
    }
  }

  close() {
    this.drawerRef.close(false);
  }

  submit() {
    if (this.validateForm.valid) {
      this.loading = true;
      const formData = {
        ...this.validateForm.value,
      };

      if (this.feature) {
        // 如果有传入特性数据，则更新特性
        formData['feature_id'] = this.feature.feature_id;
        this.http.post('/admin/token-consume-rules/update', formData).subscribe({
          next: () => {
            this.drawerRef.close(true);
            this.message.success('代币消费规则更新成功');
            this.loading = false;
          },
          error: () => {
            this.message.error('代币消费规则更新失败');
            this.loading = false;
          },
        });
      } else {
        this.http.post('/admin/token-consume-rules/create', formData).subscribe({
          next: () => {
            this.drawerRef.close(true);
            this.message.success('代币消费规则添加成功');
            this.loading = false;
          },
          error: () => {
            this.message.error('代币消费规则添加失败');
            this.loading = false;
          },
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
