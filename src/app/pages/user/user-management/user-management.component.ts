/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PublicModule } from '../../../public.module';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  standalone: true,
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [CommonModule, RouterModule, PublicModule, FormsModule],
})
export class UserManagementComponent {
  message = inject(NzMessageService);
  http = inject(HttpClient);
  router = inject(Router);

  // 用户列表
  userList: User[] = [];
  // 加载状态
  loading = false;
  // 搜索关键词
  searchKeyword = '';
  // 视图模式：'card' 或 'table'
  viewMode = 'table';
  // 分页信息
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  sort:any = null

  // 筛选条件
  filters = {
    status: null as number | null,
    phone: '',
    nickname: '',
  };

  // 加载用户列表
  loadUserList(): void {
    this.loading = true;

    const params = {
      page: this.pageIndex,
      limit: this.pageSize,
      sort:this.sort
    };

    // 添加筛选条件
    if (this.filters.status !== null) {
      Object.assign(params, { status: this.filters.status });
    }
    if (this.filters.phone) {
      Object.assign(params, { phone: this.filters.phone });
    }
    if (this.filters.nickname) {
      Object.assign(params, { nickname: this.filters.nickname });
    }

    this.http
      .post<{ code: number; data: User[]; count: number }>(
        '/admin/users/list',
        params
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.userList = res.data || [];
          this.total = res.count || 0;
        },
        error: () => {
          this.message.error('获取用户列表失败');
          this.loading = false;
        },
      });
  }

  // 切换用户状态
  toggleUserStatus(user: User): void {
    const params = {
      user_id: user.user_id.toString(),
      status: user.status === 1 ? 0 : 1, // 切换状态
    };

    this.http.post('/admin/users/operate', params).subscribe({
      next: () => {
        user.status = user.status === 1 ? 0 : 1; // 更新本地状态
        this.message.success('用户状态更新成功');
      },
      error: () => {
        this.message.error('用户状态更新失败');
      },
    });
  }

  // 查看用户详情
  viewUserDetail(user: User) {
    // 使用路由导航到用户详情页
    this.router.navigate(['/user/management', user.user_id]);
  }

  // 调整用户代币
  adjustTokens(user: User): void {
    // 使用 NZ 的模态框询问调整数量和备注
    import('ng-zorro-antd/modal').then(({ NzModalService }) => {
      // 注入Modal服务
      const modalService = inject(NzModalService);

      let changeAmount: number | null = null;
      let remark = '';

      modalService.create({
        nzTitle: '调整用户代币',
        nzContent: `
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">当前余额: ${user.token_balance}</label>
            <div class="flex items-center">
              <input #changeAmountInput type="number" class="w-full px-3 py-2 border rounded" placeholder="输入调整数量（正数增加，负数减少）" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">备注</label>
            <textarea #remarkInput class="w-full px-3 py-2 border rounded" rows="3" placeholder="请输入调整原因"></textarea>
          </div>
        `,
        nzOnOk: () => {
          const changeAmountInput = document.querySelector(
            'input'
          ) as HTMLInputElement;
          const remarkInput = document.querySelector(
            'textarea'
          ) as HTMLTextAreaElement;

          changeAmount = Number(changeAmountInput.value);
          remark = remarkInput.value;

          if (isNaN(changeAmount) || changeAmount === 0) {
            this.message.error('请输入有效的调整数量');
            return false;
          }

          // 提交代币调整请求
          this.http
            .post<{ code: number; data: { token_balance: number } }>(
              '/admin/users/tokens/adjust',
              {
                user_id: user.user_id.toString(),
                change_amount: changeAmount,
                remark: remark || '管理员手动调整',
              }
            )
            .subscribe({
              next: (res) => {
                if (res.code === 0) {
                  user.token_balance = res.data.token_balance; // 更新本地代币余额
                  this.message.success('代币调整成功');
                } else {
                  this.message.error('代币调整失败');
                }
              },
              error: () => {
                this.message.error('代币调整失败');
              },
            });

          return true;
        },
        nzOkText: '确认',
        nzCancelText: '取消',
      });
    });
  }

  // 清空筛选条件
  resetFilters(): void {
    this.filters = {
      status: null,
      phone: '',
      nickname: '',
    };
    this.loadUserList();
  }

  // 应用筛选条件
  applyFilters(): void {
    this.pageIndex = 1; // 重置到第一页
    this.loadUserList();
  }

  // 页码改变
  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadUserList();
  }

  // 每页条数改变
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1; // 重置到第一页
    this.loadUserList();
  }

  // 筛选用户
  get filteredUsers(): User[] {
    if (!this.searchKeyword) {
      return this.userList;
    }

    const keyword = this.searchKeyword.toLowerCase();
    return this.userList.filter(
      (user) =>
        user.nickname.toLowerCase().includes(keyword) ||
        user.phone.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    );
  }

  onQueryParamsChange(params:NzTableQueryParams): void {
    const sortItems = params.sort.filter((item) => item.value);
    if(sortItems.length){
      const sort = [sortItems[0].key, sortItems[0].value === 'ascend' ? 'asc' : 'desc'];
      this.sort = sort;
    } else {
      this.sort = null;
    }

    this.loadUserList()
  }
}
