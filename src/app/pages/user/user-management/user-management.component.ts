/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PublicModule } from '../../../public.module';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

// 字典项接口
interface DictItem {
  id: string;
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [CommonModule, RouterModule, PublicModule, FormsModule],
})
export class UserManagementComponent implements OnInit {
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
  sort: string[] | null = null;

  // 筛选条件
  filters = {
    status: null as number | null,
    user_id: '',
    inviter_id: '',
    source_type: null as string | null,
    nickname: '',
  };

  // 来源类型选项
  sourceTypeOptions: DictItem[] = [];

  ngOnInit(): void {
    this.loadSourceTypeDict();
    this.loadUserList();
  }

  // 加载来源类型字典
  loadSourceTypeDict(): void {
    this.http
      .post<{ code: number; message: string; data: DictItem[] }>(
        '/admin/users/suorce_type',
        {}
      )
      .subscribe({
        next: (res) => {
          if (res.code === 0) {
            this.sourceTypeOptions = res.data || [];
          }
        },
        error: () => {
          this.message.error('获取来源类型字典失败');
        },
      });
  }

  // 加载用户列表
  loadUserList(): void {
    this.loading = true;

    const params: any = {
      page: this.pageIndex,
      limit: this.pageSize,
      user_id: this.filters.user_id || '',
      inviter_id: this.filters.inviter_id || '',
      source_type: this.filters.source_type || '',
    };

    // 添加排序参数
    if (this.sort) {
      params.sort = this.sort;
    }

    // 添加筛选条件
    if (this.filters.status !== null) {
      params.status = this.filters.status;
    }
    if (this.filters.nickname) {
      params.nickname = this.filters.nickname;
    }

    this.http
      .post<{ code: number; data: User[]; count: number }>(
        '/admin/users/list',
        params
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.code === 0) {
            this.userList = res.data || [];
            this.total = res.count || 0;
          } else {
            this.message.error('获取用户列表失败');
          }
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
      user_id: user.id.toString(),
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
    console.log('查看用户详情:', user);
    this.router.navigate(['/user/management/detail'], {
      queryParams: {
        id: user.id,
      },
    });
  }

  // 清空筛选条件
  resetFilters(): void {
    this.filters = {
      status: null,
      user_id: '',
      inviter_id: '',
      source_type: null,
      nickname: '',
    };
    this.pageIndex = 1;
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

  // 筛选用户（客户端搜索）
  get filteredUsers(): User[] {
    if (!this.searchKeyword) {
      return this.userList;
    }

    const keyword = this.searchKeyword.toLowerCase();
    return this.userList.filter(
      (user) =>
        user.nickname.toLowerCase().includes(keyword) ||
        user.id.toString().includes(keyword) ||
        user.inviter_id.toLowerCase().includes(keyword)
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const sortItems = params.sort.filter((item) => item.value);
    if (sortItems.length) {
      this.sort = [
        sortItems[0].key,
        sortItems[0].value === 'ascend' ? 'asc' : 'desc',
      ];
    } else {
      this.sort = null;
    }

    this.loadUserList();
  }

  // 获取来源类型名称
  getSourceTypeName(sourceType: string): string {
    const found = this.sourceTypeOptions.find((item) => item.id === sourceType);
    return found ? found.name : sourceType || '-';
  }
}
