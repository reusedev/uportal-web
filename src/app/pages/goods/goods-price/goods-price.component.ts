import { Component, inject, OnInit } from '@angular/core';
import { PublicModule } from '../../../public.module';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { GoodsPriceEditComponent } from './goods-price-edit/goods-price-edit.component';
import { GoodsPriceAddComponent } from './goods-price-add/goods-price-add.component';

interface PriceItem {
  id?: number;
  price: number;
  price_text: string;
  status?: number;
}

@Component({
  standalone: true,
  selector: 'app-goods-price',
  templateUrl: './goods-price.component.html',
  styleUrls: ['./goods-price.component.css'],
  imports: [PublicModule],
})
export class GoodsPriceComponent implements OnInit {
  http = inject(HttpClient);
  message = inject(NzMessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);
  drawer = inject(NzDrawerService);

  goods!: Goods;
  priceList: PriceItem[] = [];
  loading = false;

  ngOnInit() {
    const goodsCode = this.route.snapshot.paramMap.get('code');
    if (goodsCode) {
      this.loadGoodsDetail(goodsCode);
    } else {
      this.message.error('商品标识不存在');
      this.goBack();
    }
  }

  // 加载商品详情
  loadGoodsDetail(code: string) {
    this.loading = true;
    this.http
      .post<{ code: number; data: Goods[] }>('/admin/goods/list', {})
      .subscribe({
        next: (res) => {
          const goods = res.data.find(item => item.code === code);
          if (goods) {
            this.goods = goods;
            this.priceList = goods.price_list || [];
          } else {
            this.message.error('商品不存在');
            this.goBack();
          }
          this.loading = false;
        },
        error: () => {
          this.message.error('加载商品信息失败');
          this.loading = false;
          this.goBack();
        },
      });
  }

  // 处理状态开关变化
  onStatusChange(item: PriceItem, checked: boolean) {
    if (!item.id) {
      return;
    }

    const newStatus = checked ? 1 : 0;

    this.http
      .post('/admin/goods/price/operate', {
        good_code: this.goods.code,
        price_id: item.id,
        status: newStatus,
      })
      .subscribe({
        next: () => {
          item.status = newStatus;
        },
        error: () => {
          // 失败时恢复开关状态（通过重新赋值触发 UI 更新）
          this.priceList = [...this.priceList];
        },
      });
  }

  // 编辑价格
  editPrice(price: PriceItem, index: number) {
    const drawerRef = this.drawer.create({
      nzWidth: 480,
      nzTitle: '编辑价格',
      nzContent: GoodsPriceEditComponent,
      nzMaskClosable: false,
      nzContentParams: {
        goods: this.goods,
        price: { ...price },
        index,
      },
    });

    drawerRef.afterClose.subscribe((result) => {
      if (result) {
        this.loadGoodsDetail(this.goods.code);
      }
    });
  }

  // 批量新增价格
  addPrices() {
    const drawerRef = this.drawer.create({
      nzWidth: 600,
      nzTitle: '新增价格',
      nzContent: GoodsPriceAddComponent,
      nzMaskClosable: false,
      nzContentParams: {
        goods: this.goods,
      },
    });

    drawerRef.afterClose.subscribe((result) => {
      if (result) {
        this.loadGoodsDetail(this.goods.code);
      }
    });
  }

  // 返回
  goBack() {
    this.location.back();
  }
}
