import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * 导航项接口
 */
export interface NavItem {
  /** 导航项标题 */
  title: string;
  /** 导航链接路径 */
  route: string;
  /** 导航项图标 (Remix Icon类名) */
  icon: string;
}

/**
 * 侧边栏导航组件
 *
 * 提供应用的侧边栏导航功能
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  /** 控制侧边栏是否折叠 */
  collapsed = input<boolean>(false);

  /** 导航项列表 */
  navItems = input<NavItem[]>([
    { title: '仪表盘', route: '/dashboard', icon: 'ri-dashboard-line' },
    { title: '个人信息', route: '/profile', icon: 'ri-user-line' },
    { title: '设置', route: '/settings', icon: 'ri-settings-line' }
  ]);
}
