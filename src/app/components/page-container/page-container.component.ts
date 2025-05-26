import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 页面容器组件
 *
 * 提供统一的页面容器布局，包含标题、描述和内容区域
 */
@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent {
  /** 页面标题 */
  title = input<string>('');

  /** 页面描述 */
  description = input<string | undefined>(undefined);

  /** 是否显示页面头部 */
  showHeader = input<boolean>(true);

  /** 自定义页面头部类名 */
  headerClass = input<string>('');

  /** 自定义内容区域类名 */
  contentClass = input<string>('');
}
