import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../../../public.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from '@angular/common/http';
import { format } from 'date-fns';

@Component({
  standalone: true,
  selector: 'app-recharge-orders',
  templateUrl: './recharge-orders.component.html',
  styleUrls: ['./recharge-orders.component.css'],
  imports: [CommonModule, RouterModule, PublicModule],
})
export class RechargeOrdersComponent implements OnInit {
  message = inject(NzMessageService);
  modal = inject(NzModalService);
  http = inject(HttpClient);

  // 订单列表
  orderList: RechargeOrder[] = [];
  // 总数量
  totalCount = 0;
  // 加载状态
  loading = false;
  // 分页
  pageIndex = 1;
  pageSize = 10;
  // 搜索条件
  searchForm:any = {
    user_id: null,
    status: null,
    start_time: null,
    end_time: null,
  };

  // 状态选项
  statusOptions = [
    { label: '待支付', value: 0 },
    { label: '支付成功', value: 1},
    { label: '支付失败', value: 2 },
    // { label: '已退款', value: 3 },
  ];

  // 支付方式映射
  paymentMethodMap: { [key: string]: string } = {
    'WeChat': '微信支付',
    'Alipay': '支付宝',
    'UnionPay': '银联支付',
    'PayPal': 'PayPal',
  };

  // 状态颜色映射
  statusColorMap: { [key: number]: string } = {
    0: 'warning',  // 待支付
    1: 'success',  // 支付成功
    2: 'error',    // 支付失败
    // 3: 'default',  // 已退款
  };

  // 状态文本映射
  statusTextMap: { [key: number]: string } = {
    0: '待支付',
    1: '支付成功',
    2: '支付失败',
    // 3: '已退款',
  };

  success_num = 0; // 支付成功数量
  failed_num = 0; // 支付失败数量
  pending_num = 0; // 待支付数量

  ngOnInit() {
    this.loadOrderList();
    this.getOrderStatusCount(); // 获取订单分类详情
  }

  // 获取订单分类详情
  getOrderStatusCount(): void {
     const params = {
      start_time: this.searchForm.start_time ? format(new Date(this.searchForm.start_time), 'yyyy-MM-dd') : null,
      end_time: this.searchForm.end_time ? format(new Date(this.searchForm.end_time), 'yyyy-MM-dd') : null,
    };
    this.http.post('/admin/recharge-orders/list_info', params).subscribe(
      {
        next: (res: any) => {
          if (res.code === 0) {
            this.success_num = res.data.success_num || 0;
            this.failed_num = res.data.failed_num || 0;
            this.pending_num = res.data.pending_num || 0;
          } else {
            this.message.error('获取订单分类详情失败');
          }
        },
        error: () => {
          this.message.error('获取订单分类详情失败');
        },
      }
    )

  }

  // 加载订单列表
  loadOrderList(): void {
    this.loading = true;

    const params = {
      page: this.pageIndex,
      limit: this.pageSize,
      ...this.searchForm,
      // 格式化日期
      start_time: this.searchForm.start_time ? format(new Date(this.searchForm.start_time), 'yyyy-MM-dd') : null,
      end_time: this.searchForm.end_time ? format(new Date(this.searchForm.end_time), 'yyyy-MM-dd') : null,
    };

    // 移除空值
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] === '') {
        delete params[key as keyof typeof params];
      }
    });

    this.http
      .post<{ code: number; data: RechargeOrder[]; count: number }>('/admin/recharge-orders/list', params)
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.code === 0) {
            this.orderList = res.data || [];
            this.totalCount = res.count || 0;
          } else {
            this.message.error('获取充值订单列表失败');
            this.orderList = [];
            this.totalCount = 0;
          }
        },
        error: () => {
          this.message.error('获取充值订单列表失败');
          this.loading = false;
          this.orderList = [];
          this.totalCount = 0;
        },
      });
  }

  // 分页变化
  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadOrderList();
  }

  // 每页条数变化
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.loadOrderList();
  }

  // 搜索
  onSearch(): void {
    this.pageIndex = 1;
    this.loadOrderList();
    this.getOrderStatusCount(); // 更新订单分类详情
  }

  // 重置搜索
  onReset(): void {
    this.searchForm = {
      user_id: null,
      status: null,
      start_time: null,
      end_time: null,
    };
    this.pageIndex = 1;
    this.loadOrderList();
    this.getOrderStatusCount(); // 更新订单分类详情
  }

  // 查看订单详情
  viewOrderDetail(orderId: number): void {
    this.http.get<{ code: number; data: RechargeOrder }>(`/admin/recharge-orders/${orderId}/info`).subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.showOrderDetailModal(res.data);
        }
      },
      error: () => {
        this.message.error('获取订单详情失败');
      },
    });
  }

  // 显示订单详情弹窗
  private showOrderDetailModal(order: RechargeOrder): void {
    this.modal.info({
      nzTitle: '订单详情',
      nzContent: this.createOrderDetailContent(order),
      nzWidth: 600,
      nzOkText: '关闭',
    });
  }

  // 创建订单详情内容
  private createOrderDetailContent(order: RechargeOrder): string {
    return `
      <div class="order-detail">
        <div class="detail-row"><strong>订单ID:</strong> ${order.order_id}</div>
        <div class="detail-row"><strong>用户:</strong> ${order.nickname} (ID: ${order.user_id})</div>
        <div class="detail-row"><strong>方案:</strong> ${order.plan_name || '方案ID: ' + order.plan_id}</div>
        <div class="detail-row"><strong>代币数量:</strong> ${order.token_amount}</div>
        <div class="detail-row"><strong>支付金额:</strong> ${this.formatAmount(order.amount_paid)}</div>
        <div class="detail-row"><strong>支付方式:</strong> ${this.paymentMethodMap[order.payment_method] || order.payment_method}</div>
        <div class="detail-row"><strong>交易号:</strong> ${order.transaction_id}</div>
        <div class="detail-row"><strong>状态:</strong> ${this.statusTextMap[order.status]}</div>
        <div class="detail-row"><strong>创建时间:</strong> ${order.created_at}</div>
        <div class="detail-row"><strong>支付时间:</strong> ${order.paid_at}</div>
      </div>
      <style>
        .order-detail .detail-row { margin: 8px 0; }
        .order-detail .detail-row strong { display: inline-block; width: 100px; }
      </style>
    `;
  }

  // 格式化日期时间
  formatDateTime(dateStr: string): string {
    if (!dateStr) return '-';
    return format(new Date(dateStr), 'yyyy-MM-dd HH:mm:ss');
  }

  // 格式化金额
  formatAmount(amount: number): string {
    return amount.toFixed(2);
  }
}
