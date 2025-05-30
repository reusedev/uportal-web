import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PublicModule } from '../../../../public.module';

// 管理员接口定义
interface Admin {
  admin_id: number;
  username: string;
  role: string;
  status: number;
  created_at: string;
  last_login_at?: string;
}

// 模态框数据接口
interface ModalData {
  isEdit?: boolean;
  adminData?: Admin;
}

@Component({
  selector: 'app-admin-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    PublicModule
  ],
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);

  @Input() isEdit = false;
  @Input() adminData: Admin | null = null;

  // 表单数据
  formData = {
    id: '',
    username: '',
    password: '',
    role: 'admin',
    status: 1
  };

  // 角色选项
  roleOptions = [
    { value: 'admin', label: '管理员' },
    { value: 'super_admin', label: '超级管理员' }
  ];

  // 状态选项
  statusOptions = [
    { value: 1, label: '启用' },
    { value: 0, label: '禁用' }
  ];

  // 提交中状态
  submitting = false;

  ngOnInit(): void {
    // 从模态框获取数据
    const modalData: ModalData = this.modalRef.getConfig().nzData || {};
    if (modalData) {
      this.isEdit = modalData.isEdit || this.isEdit;
      this.adminData = modalData.adminData || this.adminData;
    }

    // 如果是编辑模式，填充表单数据
    if (this.isEdit && this.adminData) {
      this.formData = {
        id: this.adminData.admin_id.toString(),
        username: this.adminData.username,
        password: '', // 编辑时不需要填写密码
        role: this.adminData.role,
        status: this.adminData.status
      };
    }
  }

  // 提交表单
  submitForm(): void {
    // 表单验证
    if (!this.formData.username) {
      this.message.error('请输入用户名');
      return;
    }

    if (!this.isEdit && !this.formData.password) {
      this.message.error('请输入密码');
      return;
    }

    this.submitting = true;

    // 根据是否编辑模式选择不同的API
    const apiUrl = this.isEdit ? '/admin/managers/edit' : '/admin/managers/create';
    const params: Record<string, string | number> = {
      username: this.formData.username,
      role: this.formData.role,
      status: this.formData.status
    };

    // 编辑模式添加ID参数
    if (this.isEdit) {
      params['id'] = this.formData.id;
    } else {
      // 新建模式添加密码参数
      params['password'] = this.formData.password;
    }

    this.http.post<{code: number; message?: string; data?: unknown}>(apiUrl, params).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.code === 0) {
          this.message.success(this.isEdit ? '管理员更新成功' : '管理员创建成功');
          this.modalRef.close({ success: true });
        } else {
          this.message.error(res.message || (this.isEdit ? '管理员更新失败' : '管理员创建失败'));
        }
      },
      error: () => {
        this.submitting = false;
        this.message.error(this.isEdit ? '管理员更新失败' : '管理员创建失败');
      }
    });
  }

  // 取消操作
  cancel(): void {
    this.modalRef.close();
  }
}
