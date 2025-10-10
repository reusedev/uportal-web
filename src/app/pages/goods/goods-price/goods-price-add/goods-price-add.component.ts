import { Component, inject, Input, OnInit } from '@angular/core';
import { PublicModule } from '../../../../public.module';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: true,
  selector: 'app-goods-price-add',
  templateUrl: './goods-price-add.component.html',
  styleUrls: ['./goods-price-add.component.css'],
  imports: [PublicModule],
})
export class GoodsPriceAddComponent implements OnInit {
  @Input() goods!: Goods;

  drawerRef = inject(NzDrawerRef);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  message = inject(NzMessageService);

  priceForm!: FormGroup;
  loading = false;

  ngOnInit() {
    this.priceForm = this.fb.group({
      price_list: this.fb.array([this.createPriceItem()]),
    });
  }

  // 创建价格项表单组
  createPriceItem(): FormGroup {
    return this.fb.group({
      price: [null, [Validators.required, Validators.min(0)]],
      price_text: [null, [Validators.required]],
      status: [1], // 默认启用
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

  // 删除价格项
  removePriceItem(index: number) {
    if (this.priceList.length > 1) {
      this.priceList.removeAt(index);
    } else {
      this.message.warning('至少保留一个价格项');
    }
  }

  // 保存
  save() {
    if (this.priceForm.valid) {
      this.loading = true;

      // 合并现有价格和新增价格
      const existingPriceList = this.goods.price_list || [];
      const newPriceList = this.priceForm.value.price_list;

      const formData = {
        id: this.goods.id,
        name: this.goods.name,
        code: this.goods.code,
        desc: this.goods.desc,
        cover_pic: this.goods.cover_pic,
        price_list: [...existingPriceList, ...newPriceList],
      };

      this.http.post('/admin/goods/edit', formData).subscribe({
        next: () => {
          this.message.success('价格添加成功');
          this.drawerRef.close(true);
        },
        error: (error) => {
          this.message.error(error.error?.message || '价格添加失败');
          this.loading = false;
        },
      });
    } else {
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

