import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from '../../../../public.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: true,
  selector: 'app-recharge-plan-add',
  templateUrl: './recharge-plan-add.component.html',
  styleUrls: ['./recharge-plan-add.component.css'],
  imports: [CommonModule, PublicModule],
})
export class RechargePlanAddComponent implements OnInit {
  @Input() plan!: RechargePlan;

  drawerRef = inject(NzDrawerRef);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  message = inject(NzMessageService);

  validateForm!: FormGroup;

  loading = false;

  // 币种选项
  currencyOptions = [
    { label: '人民币 (CNY)', value: 'CNY' },
    { label: '美元 (USD)', value: 'USD' },
    { label: '欧元 (EUR)', value: 'EUR' },
  ];

  ngOnInit() {
    if (this.plan) {
      // 编辑模式
      this.validateForm = this.fb.group({
        token_amount: [this.plan.token_amount, [Validators.required, Validators.min(1)]],
        price: [this.plan.price, [Validators.required, Validators.min(0.01)]],
        currency: [this.plan.currency, [Validators.required]],
        description: [this.plan.description, [Validators.required]],
        status: [this.plan.status],
        name: [this.plan.name, [Validators.required]], // 新增名称字段
        tag: [this.plan.tag, [Validators.required]], // 新增标签字段
        is_recommend: [this.plan.is_recommend || 0], // 新增推荐字段，默认为 false
      });
    } else {
      // 新增模式
      this.validateForm = this.fb.group({
        token_amount: [null, [Validators.required, Validators.min(1)]],
        price: [null, [Validators.required, Validators.min(0.01)]],
        currency: ['CNY', [Validators.required]],
        description: [null, [Validators.required]],
        status: [1], // 默认启用
        name: [null, [Validators.required]], // 新增名称字段
        tag: [null, [Validators.required]], // 新增标签字段
        is_recommend: [0], // 新增推荐字段，默认为 false
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

      if (this.plan) {
        // 编辑模式
        formData['plan_id'] = this.plan.plan_id;
        this.http.post('/admin/recharge-plans/edit', formData).subscribe({
          next: () => {
            this.drawerRef.close(true);
            this.message.success('充值方案更新成功');
            this.loading = false;
          },
          error: () => {
            this.message.error('充值方案更新失败');
            this.loading = false;
          },
        });
      } else {
        // 新增模式
        this.http.post('/admin/recharge-plans/create', formData).subscribe({
          next: () => {
            this.drawerRef.close(true);
            this.message.success('充值方案添加成功');
            this.loading = false;
          },
          error: () => {
            this.message.error('充值方案添加失败');
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
