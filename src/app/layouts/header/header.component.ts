import { Component, input, output } from '@angular/core';

/**
 * 顶部导航栏组件
 *
 * 提供应用的顶部导航功能，包括侧边栏切换按钮、Logo和用户菜单
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {  /** 应用标题 */
  appTitle = input<string>('用户门户');

  /** 用户名 */
  username = input<string>('用户名');

  /** 用户头像URL */
  avatarUrl = input<string>('/assets/avatar.jpg');

  /** Logo URL */
  logoUrl = input<string>('/assets/logo.svg');

  /** 当侧边栏切换按钮被点击时发出事件 */
  toggleSidebarEvent = output<void>();

  /**
   * 触发侧边栏切换事件
   */
  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }
}
