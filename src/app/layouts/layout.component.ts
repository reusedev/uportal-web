/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PublicModule } from '../public.module';
import { AuthService, AuthTokenPayload } from '../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoleDict } from '../configs/dict';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, PublicModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  exportAs: 'appLayout',
})
export class LayoutComponent implements OnInit {
  auth = inject(AuthService);
  private message = inject(NzMessageService);
  private router = inject(Router);
  /** 控制侧边栏的展开/收起状态 */
  protected isSidebarCollapsed = false;

  roleDic:any = RoleDict;

  sidebarHover = false;

  sidebarMenu: any = [
    {
      label: '用户管理',
      link: '/user/management',
      active: false,
      icon: 'team',
    },
    {
      label: '系统配置',
      link: '/system/config',
      active: false,
      icon: 'setting',
    },
    {
      label: '代币管理',
      icon: 'wallet',
      active: false,
      children: [
        {
          label: '代币任务',
          link: '/token/task',
          active: false,
        },
        {
          label: '消耗规则',
          link: '/token/consume-rules',
          active: false,
        },
      ],
    },
    {
      label: '充值管理',
      icon: 'dollar-circle',
      active: false,
      children: [
        {
          label: '充值方案',
          link: '/recharge/plans',
          active: false,
        },
        {
          label: '充值订单',
          link: '/recharge/orders',
          active: false,
        },
      ],
    },
  ];

  userInfo:any = {}

  ngOnInit(): void {
    const payload = this.auth.decode(this.auth.get()) as AuthTokenPayload & {
      username: string;
      password: string;
      role: string;
    };

    this.userInfo = payload || {};
  }

  toggleSidebarCollapsed(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(){
    this.auth.logout();
  }

  navigateToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  navigateToAdminManagement(): void {
    this.router.navigate(['/account/management']);
  }
}
