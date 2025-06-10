import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicModule } from '../../../../public.module';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Component as NgComponent, Input } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PublicModule,
    NzTabsModule,
    RouterModule,
    NzBreadCrumbModule,
    NzInputModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NzModalService);

  userId: string = this.route.snapshot.queryParams['id'] || '';

  // 用户详情
  userDetail: User | null = null;
  // 登录日志
  loginLogs: LoginLog[] = [];
  // 代币记录
  tokenRecords: TokenRecord[] = [];

  // 加载状态
  userLoading = false;
  logsLoading = false;
  recordsLoading = false;

  // 分页参数 - 登录日志
  logsPageIndex = 1;
  logsPageSize = 5;
  logsTotal = 0;

  // 分页参数 - 代币记录
  recordsPageIndex = 1;
  recordsPageSize = 5;
  recordsTotal = 0;

  // 筛选参数 - 代币记录
  recordFilters = {
    change_type: '',
    start_time: '',
    end_time: '',
  };

  // 代币变动类型选项
  changeTypes = [
    { value: '', label: '全部类型' },
    { value: 'TASK_REWARD', label: '任务奖励' },
    { value: 'ADMIN_ADJUST', label: '管理员调整' },
    { value: 'FEATURE_CONSUME', label: '特性消费' },
  ];

  ngOnInit(): void {
    this.loadUserDetail();
    this.loadLoginLogs();
    this.loadTokenRecords();
  }

  // 返回用户列表
  goBack(): void {
    this.router.navigate(['/user/management']);
  }

  // 加载用户详情
  loadUserDetail(): void {
    this.userLoading = true;
    this.http
      .get<{ code: number; data: User }>(`/admin/users/${this.userId}`)
      .subscribe({
        next: (res) => {
          this.userLoading = false;
          if (res.code === 0) {
            this.userDetail = res.data;
          } else {
            this.message.error('获取用户详情失败');
          }
        },
        error: () => {
          this.userLoading = false;
          this.message.error('获取用户详情失败');
        },
      });
  }

  // 加载登录日志
  loadLoginLogs(): void {
    this.logsLoading = true;
    this.http
      .post<{ code: number; data: LoginLog[]; count: number }>(
        '/admin/users/login-logs',
        {
          page: this.logsPageIndex,
          limit: this.logsPageSize,
          user_id: this.userId.toString(),
        }
      )
      .subscribe({
        next: (res) => {
          this.logsLoading = false;
          if (res.code === 0) {
            this.loginLogs = res.data;
            this.logsTotal = res.count;
          } else {
            this.message.error('获取登录日志失败');
          }
        },
        error: () => {
          this.logsLoading = false;
          this.message.error('获取登录日志失败');
        },
      });
  }

  // 加载代币记录
  loadTokenRecords(): void {
    this.recordsLoading = true;

    const params = {
      page: this.recordsPageIndex,
      limit: this.recordsPageSize,
      user_id: this.userId.toString(),
    };

    // 添加筛选条件
    if (this.recordFilters.change_type) {
      Object.assign(params, { change_type: this.recordFilters.change_type });
    }
    if (this.recordFilters.start_time) {
      Object.assign(params, { start_time: this.recordFilters.start_time });
    }
    if (this.recordFilters.end_time) {
      Object.assign(params, { end_time: this.recordFilters.end_time });
    }

    this.http
      .post<{ code: number; data: TokenRecord[]; count: number }>(
        '/admin/users/token-records',
        params
      )
      .subscribe({
        next: (res) => {
          this.recordsLoading = false;
          if (res.code === 0) {
            this.tokenRecords = res.data;
            this.recordsTotal = res.count;
          } else {
            this.message.error('获取代币记录失败');
          }
        },
        error: () => {
          this.recordsLoading = false;
          this.message.error('获取代币记录失败');
        },
      });
  }

  // 切换用户状态
  toggleUserStatus(): void {
    if (!this.userDetail) return;

    const params = {
      user_id: this.userDetail.id,
      status: this.userDetail.status === 1 ? 0 : 1, // 切换状态
    };

    this.http.post('/admin/users/operate', params).subscribe({
      next: () => {
        if (this.userDetail) {
          this.userDetail.status = this.userDetail.status === 1 ? 0 : 1; // 更新本地状态
        }
        this.message.success('用户状态更新成功');
      },
      error: () => {
        this.message.error('用户状态更新失败');
      },
    });
  }

  // 调整用户代币
  adjustTokens(): void {
    if (!this.userDetail) return;
    const currentBalance = this.userDetail.token_balance;
    const modalRef = this.modalService.create({
      nzTitle: '调整用户代币',
      nzContent: TokenAdjustmentComponent,
      nzWidth: 500,
      nzOkText: '确认',
      nzCancelText: '取消',
      nzOnOk: (componentInstance) => {
        const instance = componentInstance as TokenAdjustmentComponent;
        const changeAmount = instance.changeAmount;
        const remark = instance.remark;
        if (isNaN(Number(changeAmount)) || changeAmount === 0) {
          this.message.error('请输入有效的调整数量');
          return false;
        }
        return new Promise<boolean>((resolve) => {
          this.http
            .post<{ code: number; data: { token_balance: number } }>(
              '/admin/users/tokens/adjust',
              {
                user_id: this.userId.toString(),
                change_amount: changeAmount,
                remark: remark || '管理员手动调整',
              }
            )
            .subscribe({
              next: (res) => {
                if (res.code === 0) {
                  if (this.userDetail) {
                    this.userDetail.token_balance = res.data?.token_balance;
                  }
                  this.message.success('代币调整成功');
                  this.selectTokenRecordsTab();
                  this.recordsPageIndex = 1;
                  this.loadTokenRecords();
                  resolve(true);
                } else {
                  this.message.error('代币调整失败');
                  resolve(false);
                }
              },
              error: () => {
                this.message.error('代币调整失败');
                resolve(false);
              },
            });
        });
      },
    });
    // 设置 currentBalance
    (
      modalRef.getContentComponent() as TokenAdjustmentComponent
    ).currentBalance = currentBalance;
  }

  // 选择代币记录标签
  private selectTokenRecordsTab(): void {
    setTimeout(() => {
      const tabLinks = document.querySelectorAll('.ant-tabs-tab');
      // 找到代币记录标签并点击
      tabLinks.forEach((tab) => {
        if ((tab as HTMLElement).innerText.includes('代币记录')) {
          (tab as HTMLElement).click();
        }
      });
    }, 100);
  }

  // 登录日志分页变化
  onLogsPageChange(index: number): void {
    this.logsPageIndex = index;
    this.loadLoginLogs();
  }

  // 代币记录分页变化
  onRecordsPageChange(index: number): void {
    this.recordsPageIndex = index;
    this.loadTokenRecords();
  }

  // 应用代币记录筛选
  applyRecordFilters(): void {
    this.recordsPageIndex = 1; // 重置到第一页
    this.loadTokenRecords();
  }

  // 重置代币记录筛选
  resetRecordFilters(): void {
    this.recordFilters = {
      change_type: '',
      start_time: '',
      end_time: '',
    };
    this.recordsPageIndex = 1;
    this.loadTokenRecords();
  }

  // 获取代币变动类型的显示名称
  getChangeTypeName(type: string): string {
    const found = this.changeTypes.find((t) => t.value === type);
    return found ? found.label : type;
  }

  // 获取代币变动的显示样式
  getChangeAmountClass(amount: number): string {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  }

  // 格式化代币变动金额显示
  formatChangeAmount(amount: number): string {
    return amount > 0 ? `+${amount}` : `${amount}`;
  }
}

// ================= 动态模态组件 =================
@NgComponent({
  selector: 'app-token-adjustment',
  standalone: true,
  imports: [CommonModule, FormsModule, PublicModule, NzInputModule],
  styles: [
    `
    .token-balance { color: #1890ff; font-weight: 500; }
    .token-input { margin-bottom: 16px; }
    .input-hint { font-size: 12px; color: #888; margin-top: 4px; }
    .preview-section { margin-top: 12px; padding: 8px; background-color: #f5f5f5; border-radius: 4px; }
    .preview-balance { font-weight: 500; }
    .positive { color: #52c41a; }
    .negative { color: #f5222d; }
  `,
  ],
  template: `
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">当前余额</label>
      <div class="token-balance text-xl">{{ currentBalance }}</div>
    </div>
    <div class="token-input">
      <label class="block text-sm font-medium mb-1">调整数量</label>
      <input nz-input [(ngModel)]="changeAmount" type="number" placeholder="正数增加，负数减少" />
      <div class="input-hint">请输入调整数量，正数表示增加，负数表示减少</div>
    </div>
    <div *ngIf="changeAmount && isNumber(changeAmount) && changeAmount !== 0" class="preview-section">
      <div>调整预览：</div>
      <div>
        {{ currentBalance }}
        <span [ngClass]="changeAmount > 0 ? 'positive' : 'negative'">
          {{ changeAmount > 0 ? '+' + changeAmount : changeAmount }}
        </span>
        =
        <span class="preview-balance">{{ currentBalance + changeAmount }}</span>
      </div>
    </div>
    <div class="mt-4">
      <label class="block text-sm font-medium mb-1">备注</label>
      <textarea nz-input [(ngModel)]="remark" rows="3" placeholder="请输入调整原因"></textarea>
    </div>
  `,
})
export class TokenAdjustmentComponent {
  @Input() currentBalance = 0;
  changeAmount: number | null = null;
  remark = '';
  isNumber(val: unknown): boolean {
    return typeof val === 'number' && !isNaN(val);
  }
}
