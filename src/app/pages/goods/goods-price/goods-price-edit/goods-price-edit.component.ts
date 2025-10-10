import { Component, inject, Input, OnInit } from '@angular/core';
import { PublicModule } from '../../../../public.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: true,
  selector: 'app-goods-price-edit',
  templateUrl: './goods-price-edit.component.html',
  styleUrls: ['./goods-price-edit.component.css'],
  imports: [PublicModule],
})
export class GoodsPriceEditComponent implements OnInit {
  @Input() goods!: Goods;
  @Input() price!: any;
  @Input() index!: number;

  drawerRef = inject(NzDrawerRef);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  message = inject(NzMessageService);

  priceForm!: FormGroup;
  loading = false;

  ngOnInit() {
    this.priceForm = this.fb.group({
      price: [this.price.price, [Validators.required, Validators.min(0)]],
      price_text: [this.price.price_text, [Validators.required]],
    });
  }

  // 价格格式化显示
  priceFormatter = (value: number): string => `¥ ${value}`;
  priceParser = (value: string): number => parseFloat(value.replace('¥ ', '')) || 0;

  // 保存
  save() {
    if (this.priceForm.valid) {
      this.loading = true;

      // 更新价格列表
      const updatedPriceList = [...(this.goods.price_list || [])];
      updatedPriceList[this.index] = {
        ...updatedPriceList[this.index],
        ...this.priceForm.value,
      };

      const formData = {
        id: this.goods.id,
        name: this.goods.name,
        code: this.goods.code,
        desc: this.goods.desc,
        cover_pic: this.goods.cover_pic,
        price_list: updatedPriceList,
      };

      this.http.post('/admin/goods/edit', formData).subscribe({
        next: () => {
          this.message.success('价格编辑成功');
          this.drawerRef.close(true);
        },
        error: (error) => {
          this.message.error(error.error?.message || '价格编辑失败');
          this.loading = false;
        },
      });
    } else {
      Object.values(this.priceForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  close() {
    this.drawerRef.close(false);
  }
}

