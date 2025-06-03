/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicModule } from '../../../public.module';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { Router, RouterModule } from '@angular/router';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { AuthService, AuthTokenPayload } from '../../../services/auth.service';
import { RoleDict } from '../../../configs/dict';

// 管理员接口定义
interface Admin {
  admin_id: number;
  username: string;
  role: string;
  status: number;
  created_at: string;
  last_login_at: string;
}

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PublicModule,
    NzTableModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzInputModule,
    NzBreadCrumbModule,
    RouterModule,
  ],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css'],
})
export class AdminManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  private modalService = inject(NzModalService);
  private router = inject(Router);
  auth = inject(AuthService);
  userInfo: any = {};

  roleDict:any = RoleDict;

  // 管理员列表数据
  adminList: Admin[] = [];

  // 加载状态
  loading = false;

  // 分页参数
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // 筛选参数
  filters = {
    username: null,
    role: null,
    status: null,
  };

  // 角色选项
  roleOptions = [
    { value: 'admin', label: '管理员' },
    { value: 'super_admin', label: '超级管理员' },
  ];

  // 状态选项
  statusOptions = [
    { value: 1, label: '启用' },
    { value: 0, label: '禁用' },
  ];

  // 排序参数
  sortField: string | null = null;
  sortOrder: string | null = null;

  ngOnInit(): void {
    this.loadAdminList();
    const payload = this.auth.decode(this.auth.get()) as AuthTokenPayload & {
      username: string;
      password: string;
      role: string;
    };

    this.userInfo = payload || {};
  }

  // 加载管理员列表
  loadAdminList(): void {
    this.loading = true;

    const params: any = {
      page: this.pageIndex,
      limit: this.pageSize,
      username: this.filters.username || null,
      role: this.filters.role || null,
      status: this.filters.status === null ? null : this.filters.status,
    };

    // 添加排序参数
    if (this.sortField && this.sortOrder) {
      params.sort_field = this.sortField;
      params.sort_order = this.sortOrder === 'ascend' ? 'asc' : 'desc';
    }

    this.http
      .post<{ code: number; data: Admin[]; count: number }>(
        '/admin/managers/list',
        params
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.code === 0) {
            this.adminList = res.data;
            this.total = res.count;
            console.log(
              'Total count from server:',
              res.count,
              'Current total:',
              this.total
            );
          } else {
            this.message.error('获取管理员列表失败');
          }
        },
        error: () => {
          this.loading = false;
          this.message.error('获取管理员列表失败');
        },
      });
  }

  // 分页变化
  onPageChange(index: number): void {
    this.pageIndex = index;
    this.loadAdminList();
  }

  // 应用筛选
  applyFilters(): void {
    this.pageIndex = 1; // 重置到第一页
    this.loadAdminList();
  }

  // 重置筛选
  resetFilters(): void {
    this.filters = {
      username: null,
      role: null,
      status: null,
    };
    this.pageIndex = 1;
    this.loadAdminList();
  }

  // 添加管理员
  addAdmin(): void {
    const modalRef = this.modalService.create({
      nzTitle: '添加管理员',
      nzContent: AdminFormComponent,
      nzWidth: 500,
      nzFooter: null,
    });

    // 监听添加成功事件，刷新列表
    modalRef.afterClose.subscribe((result) => {
      if (result && result.success) {
        this.loadAdminList();
      }
    });
  }

  // 编辑管理员
  editAdmin(admin: Admin): void {
    const modalRef = this.modalService.create({
      nzTitle: '编辑管理员',
      nzContent: AdminFormComponent,
      nzWidth: 500,
      nzFooter: null,
      nzData: {
        isEdit: true,
        adminData: admin,
      },
    });

    // 监听编辑成功事件，刷新列表
    modalRef.afterClose.subscribe((result) => {
      if (result && result.success) {
        this.loadAdminList();
      }
    });
  }

  // 删除管理员
  deleteAdmin(adminId: number): void {
    this.http
      .post('/admin/managers/delete', { id: adminId.toString() })
      .subscribe({
        next: (res: any) => {
          if (res.code === 0) {
            this.message.success('管理员删除成功');
            this.loadAdminList();
          } else {
            this.message.error(res.message || '管理员删除失败');
          }
        },
        error: () => {
          this.message.error('管理员删除失败');
        },
      });
  }

  // 获取角色显示文本
  getRoleLabel(role: string): string {
    const found = this.roleOptions.find((item) => item.value === role);
    return found ? found.label : role;
  }

  // 获取状态显示样式
  getStatusClass(status: number): string {
    return status === 1 ? 'text-green-600' : 'text-red-600';
  }

  // 获取状态显示文本
  getStatusLabel(status: number): string {
    return status === 1 ? '启用' : '禁用';
  }

  // 排序变化
  onSortOrderChange(sort: { key: string; value: string }): void {
    this.sortField = sort.key;
    this.sortOrder = sort.value;
    this.loadAdminList();
  }
}
