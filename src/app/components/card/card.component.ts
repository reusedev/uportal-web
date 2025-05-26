import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 卡片组件
 *
 * 提供统一的卡片UI，包括标题、内容和可选的操作按钮
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  /** 卡片标题 */
  title = input<string | undefined>(undefined);

  /** 卡片副标题 */
  subtitle = input<string | undefined>(undefined);

  /** 是否显示边框 */
  bordered = input<boolean>(true);

  /** 卡片内边距 */
  padding = input<'none' | 'small' | 'medium' | 'large'>('medium');

  /** 自定义卡片类名 */
  cardClass = input<string>('');

  /** 自定义卡片头部类名 */
  headerClass = input<string>('');

  /** 自定义卡片内容类名 */
  contentClass = input<string>('');

  /**
   * 根据padding设置获取对应的CSS类
   */
  protected paddingClass = computed((): string => {
    const paddingMap = {
      'none': 'p-0',
      'small': 'p-2',
      'medium': 'p-4',
      'large': 'p-6'
    };

    return paddingMap[this.padding()];
  });
}
