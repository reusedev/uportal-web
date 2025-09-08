import { Component, inject, Input, OnInit } from '@angular/core';
import { PublicModule } from '../../../../public.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomFileListComponent } from '../../../../components/custom-file-list/custom-file-list.component';

@Component({
  standalone: true,
  selector: 'app-goods-add',
  templateUrl: './goods-add.component.html',
  styleUrls: ['./goods-add.component.css'],
  imports: [PublicModule, NgIf, CustomFileListComponent],
})
export class GoodsAddComponent implements OnInit {
  @Input() goods!: Goods;

  drawerRef = inject(NzDrawerRef);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  message = inject(NzMessageService);

  validateForm!: FormGroup;
  loading = false;

  fileParams: {
    mode: 'single' | 'multiple';
    limit: number;
    exts: string;
    size: number;
    listType: 'text' | 'picture' | 'picture-card';
    showButton: boolean;
  } = {
    mode: 'single',
    limit: 1,
    exts: '.jpg,.png,.jpeg,.webp,.svg,.gif',
    size: 1024 * 1024 * 10, // 10MB
    listType: 'picture-card',
    showButton: true,
  };

  ngOnInit() {
    if (this.goods) {
      // 编辑模式 - 初始化表单数据
      this.validateForm = this.fb.group({
        cover_pic: [this.goods.cover_pic],
        name: [this.goods.name, [Validators.required]],
        code: [this.goods.code, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        price: [this.goods.price, [Validators.required, Validators.min(0)]],
        desc: [this.goods.desc],
      });
    } else {
      // 新建模式 - 初始化空表单
      this.validateForm = this.fb.group({
        cover_pic: [null],
        name: [null, [Validators.required]],
        code: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        price: [null, [Validators.required, Validators.min(0)]],
        desc: [null],
      });
    }
  }

  // 价格格式化显示
  priceFormatter = (value: number): string => `¥ ${value}`;
  priceParser = (value: string): number => parseFloat(value.replace('¥ ', '')) || 0;

  close() {
    this.drawerRef.close(false);
  }

  submit() {
    if (this.validateForm.valid) {
      this.loading = true;

      const formData = {
        ...this.validateForm.value,
      };

      if (this.goods) {
        // 编辑商品
        formData['id'] = this.goods.id;
        this.http.post('/admin/goods/edit', formData).subscribe({
          next: () => {
            this.drawerRef.close(true);
            this.message.success('商品编辑成功');
            this.loading = false;
          },
          error: (error) => {
            this.drawerRef.close(false);
            this.message.error(error.error?.message || '商品编辑失败');
            this.loading = false;
          },
        });
      } else {
        // 新建商品
        this.http.post('/admin/goods/add', formData).subscribe({
          next: () => {
            this.drawerRef.close(true);
            this.message.success('商品添加成功');
            this.loading = false;
          },
          error: (error) => {
            this.drawerRef.close(false);
            this.message.error(error.error?.message || '商品添加失败');
            this.loading = false;
          },
        });
      }
    } else {
      // 标记所有控件为dirty以显示验证错误
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}