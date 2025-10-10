import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PublicModule } from '../../../public.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { GoodsAddComponent } from './goods-add/goods-add.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  standalone: true,
  selector: 'app-goods-management',
  templateUrl: './goods-management.component.html',
  styleUrls: ['./goods-management.component.css'],
  imports: [CommonModule, RouterModule, PublicModule],
})
export class GoodsManagementComponent implements OnInit {
  message = inject(NzMessageService);
  http = inject(HttpClient);
  drawer = inject(NzDrawerService);
  router = inject(Router);

  // 商品列表
  goodsList: Goods[] = [];
  // 加载状态
  loading = false;
  // 搜索关键词
  searchKeyword = '';
  // 视图模式：'card' 或 'table'
  viewMode = 'card';

  ngOnInit() {
    this.loadGoodsList();
  }

  // 加载商品列表
  loadGoodsList(): void {
    this.loading = true;
    this.http
      .post<{ code: number; data: Goods[] }>('/admin/goods/list', {})
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.goodsList = res.data || [];
        },
        error: () => {
          this.message.error('获取商品列表失败');
          this.loading = false;
        },
      });
  }

  // 切换商品状态
  toggleGoodsStatus(goods: Goods): void {
    const params = {
      id: goods.id,
      status: goods.status === 1 ? 0 : 1, // 切换状态
    };

    this.http.post('/admin/goods/operate', params).subscribe({
      next: () => {
        goods.status = goods.status === 1 ? 0 : 1; // 更新本地状态
        this.message.success('商品状态更新成功');
      },
      error: () => {
        this.message.error('商品状态更新失败');
      },
    });
  }

  // 删除商品
  deleteGoods(goods: Goods): void {
    this.http.post('/admin/goods/delete', { id: goods.id }).subscribe({
      next: () => {
        this.goodsList = this.goodsList.filter(item => item.id !== goods.id);
        this.message.success('商品删除成功');
      },
      error: () => {
        this.message.error('商品删除失败');
      },
    });
  }

  // 添加商品
  addGoods() {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '添加商品',
      nzContent: GoodsAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {},
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.loadGoodsList(); // 重新加载商品列表
      }
    });
  }

  // 编辑商品
  editGoods(goods: Goods) {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '编辑商品',
      nzContent: GoodsAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {
        goods, // 传递当前商品数据
      },
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.loadGoodsList(); // 重新加载商品列表
      }
    });
  }

  // 管理商品价格
  managePrices(goods: Goods) {
    this.router.navigate(['/goods/price', goods.code]);
  }

  // 筛选商品
  get filteredGoods(): Goods[] {
    if (!this.searchKeyword) {
      return this.goodsList;
    }

    const keyword = this.searchKeyword.toLowerCase();
    return this.goodsList.filter(
      goods =>
        goods.name.toLowerCase().includes(keyword) ||
        (goods.desc && goods.desc.toLowerCase().includes(keyword)) ||
        goods.code.toLowerCase().includes(keyword)
    );
  }
}
