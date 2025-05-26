import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 徽章类型
 */
export type BadgeType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * 徽章大小
 */
export type BadgeSize = 'small' | 'medium' | 'large';

/**
 * 徽章组件
 *
 * 提供统一的徽章UI，支持不同类型、大小和状态
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent {
  /** 徽章类型 */
  type = input<BadgeType>('default');

  /** 徽章大小 */
  size = input<BadgeSize>('medium');

  /** 是否为圆形徽章 */
  dot = input<boolean>(false);

  /** 是否为轮廓徽章 */
  outline = input<boolean>(false);

  /** 自定义类名 */
  customClass = input<string>('');

  /**
   * 计算徽章类名
   */
  protected badgeClasses = computed(() => {
    return [
      'inline-flex items-center justify-center font-medium',
      this.dot() ? 'flex rounded-full' : 'rounded-full',
      this.sizeClass(),
      this.typeClass(),
      this.customClass()
    ].filter(c => c).join(' ');
  });

  /**
   * 根据大小返回对应的类名
   */
  private sizeClass = computed((): string => {
    if (this.dot()) {
      const sizeMap: Record<BadgeSize, string> = {
        'small': 'h-1.5 w-1.5',
        'medium': 'h-2 w-2',
        'large': 'h-2.5 w-2.5'
      };
      return sizeMap[this.size()];
    } else {
      const sizeMap: Record<BadgeSize, string> = {
        'small': 'px-1.5 py-0.5 text-xs',
        'medium': 'px-2 py-0.5 text-xs',
        'large': 'px-2.5 py-0.5 text-sm'
      };
      return sizeMap[this.size()];
    }
  });

  /**
   * 根据类型返回对应的类名
   */
  private typeClass = computed((): string => {
    const type = this.type();
    const isOutline = this.outline();

    const typeMap: Record<BadgeType, { filled: string, outline: string }> = {
      'default': {
        filled: 'bg-gray-100 text-gray-800',
        outline: 'border border-gray-300 text-gray-800'
      },
      'primary': {
        filled: 'bg-primary-100 text-primary-800',
        outline: 'border border-primary-300 text-primary-800'
      },
      'success': {
        filled: 'bg-green-100 text-green-800',
        outline: 'border border-green-300 text-green-800'
      },
      'warning': {
        filled: 'bg-yellow-100 text-yellow-800',
        outline: 'border border-yellow-300 text-yellow-800'
      },
      'danger': {
        filled: 'bg-red-100 text-red-800',
        outline: 'border border-red-300 text-red-800'
      },
      'info': {
        filled: 'bg-blue-100 text-blue-800',
        outline: 'border border-blue-300 text-blue-800'
      }
    };

    return isOutline ? typeMap[type].outline : typeMap[type].filled;
  });
}
