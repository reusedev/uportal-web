import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavItem } from '../sidebar/sidebar.component';

/**
 * 布局组件
 *
 * 提供应用的基本布局结构，包括顶部导航栏、侧边栏和内容区域
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  /** 控制侧边栏的展开/收起状态 */
  protected isSidebarCollapsed = false;

  /** 应用标题 */
  protected appTitle = signal<string>('用户门户');

  /** 导航项配置 */
  protected navItems = signal<NavItem[]>([
    { title: '仪表盘', route: '/dashboard', icon: 'ri-dashboard-line' },
    { title: '个人信息', route: '/profile', icon: 'ri-user-line' },
    { title: '设置', route: '/settings', icon: 'ri-settings-line' },
    { title: '帮助中心', route: '/help', icon: 'ri-question-line' },
    { title: 'UI示例', route: '/ui-demo', icon: 'ri-palette-line' }
  ]);

  sidebarHover = false;

  sidebarMenu = [
    { label: 'Dashboard', icon: 'ri-layout-grid-line', link: '/', active: true },
    { label: 'Token', icon: 'ri-star-smile-line', link: '/token', active: false },
  ];

  /**
   * 切换侧边栏状态
   */
  toggleSidebarCollapsed(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
