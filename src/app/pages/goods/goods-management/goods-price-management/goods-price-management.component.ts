import { Component, inject, Input, OnInit } from '@angular/core';
import { PublicModule } from '../../../../public.module';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: true,
  selector: 'app-goods-price-management',
  templateUrl: './goods-price-management.component.html',
  styleUrls: ['./goods-price-management.component.css'],
  imports: [PublicModule],
})
export class GoodsPriceManagementComponent implements OnInit {
  @Input() goods!: Goods;

  drawerRef = inject(NzDrawerRef);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  message = inject(NzMessageService);

  priceForm!: FormGroup;
  loading = false;

  ngOnInit() {
    this.initForm();
  }

  // 初始化表单
  initForm() {
    this.priceForm = this.fb.group({
      price_list: this.fb.array(
        this.goods.price_list && this.goods.price_list.length > 0
          ? this.goods.price_list.map(item => this.createPriceItem(item))
          : []
      ),
    });
  }

  // 创建价格项表单组
  createPriceItem(item?: { id?: number; price: number; price_text: string; status?: number }): FormGroup {
    return this.fb.group({
      id: [item?.id || null],
      price: [item?.price || null, [Validators.required, Validators.min(0)]],
      price_text: [item?.price_text || null, [Validators.required]],
      status: [item?.status ?? 1], // 默认启用
    });
  }

  // 获取价格列表 FormArray
  get priceList(): FormArray {
    return this.priceForm.get('price_list') as FormArray;
  }

  // 价格格式化显示
  priceFormatter = (value: number): string => `¥ ${value}`;
  priceParser = (value: string): number => parseFloat(value.replace('¥ ', '')) || 0;

  // 添加价格项
  addPriceItem() {
    this.priceList.push(this.createPriceItem());
  }

  // 处理状态开关变化（仅针对已有的价格项，有 id 的）
  onStatusChange(index: number, checked: boolean) {
    const priceItem = this.priceList.at(index);
    const priceId = priceItem.get('id')?.value;

    if (!priceId) {
      return;
    }

    const newStatus = checked ? 1 : 0;

    this.http
      .post('/admin/goods/price/operate', {
        good_code: this.goods.code,
        price_id: priceId,
        status: newStatus,
      })
      .subscribe({
        next: () => {
          // 更新表单中的状态值
          priceItem.patchValue({ status: newStatus });
        },
        error: () => {
          // 失败时恢复开关状态
          const currentStatus = priceItem.get('status')?.value ?? 1;
          priceItem.patchValue({ status: currentStatus }, { emitEvent: false });
        },
      });
  }

  // 保存所有价格
  save() {
    if (this.priceForm.valid) {
      this.loading = true;

      const formData = {
        id: this.goods.id,
        name: this.goods.name,
        code: this.goods.code,
        desc: this.goods.desc,
        cover_pic: this.goods.cover_pic,
        price_list: this.priceForm.value.price_list,
      };

      this.http.post('/admin/goods/edit', formData).subscribe({
        next: () => {
          this.message.success('价格保存成功');
          this.drawerRef.close(true);
          this.loading = false;
        },
        error: (error) => {
          this.message.error(error.error?.message || '价格保存失败');
          this.loading = false;
        },
      });
    } else {
      // 标记所有控件为 dirty 以显示验证错误
      Object.values(this.priceForm.controls).forEach((control) => {
        if (control instanceof FormArray) {
          control.controls.forEach((item) => {
            Object.values((item as FormGroup).controls).forEach((field) => {
              if (field.invalid) {
                field.markAsDirty();
                field.updateValueAndValidity({ onlySelf: true });
              }
            });
          });
        }
      });
      this.message.warning('请检查表单填写是否完整');
    }
  }

  close() {
    this.drawerRef.close(false);
  }
}

