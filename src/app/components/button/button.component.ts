import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 按钮类型
 */
export type ButtonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

/**
 * 按钮大小
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * 按钮组件
 *
 * 提供统一的按钮UI，支持不同类型、大小和状态
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  // Signal 输入
  variant = input<ButtonType>('primary');
  size = input<ButtonSize>('medium');
  disabled = input<boolean>(false);
  block = input<boolean>(false);
  outline = input<boolean>(false);
  rounded = input<boolean>(false);
  loading = input<boolean>(false);
  icon = input<string>();
  iconPosition = input<'left' | 'right'>('left');
  customClass = input<string>('');

  // Signal 输出
  clicked = output<MouseEvent>();
  /**
   * 计算按钮类名
   */
  protected buttonClasses = computed(() => {
    const classes: string[] = [
      // 基础类
      'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',

      // 大小
      this.sizeClass(),

      // 类型和样式
      this.typeClass(),

      // 是否为块级
      this.block() ? 'w-full' : '',

      // 是否为圆形
      this.rounded() ? 'rounded-full' : 'rounded-md',

      // 禁用状态
      this.disabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',

      // 加载状态
      this.loading() ? 'relative' : '',

      // 自定义类
      this.customClass()
    ];

    return classes.filter(c => c).join(' ');
  });

  /**
   * 根据大小返回对应的类名
   */
  private sizeClass = computed((): string => {
    const sizeMap: Record<ButtonSize, string> = {
      'small': 'px-2.5 py-1.5 text-xs',
      'medium': 'px-4 py-2 text-sm',
      'large': 'px-6 py-3 text-base'
    };

    return sizeMap[this.size()];
  });

  /**
   * 根据类型返回对应的类名
   */
  private typeClass = computed((): string => {
    const type = this.variant();
    const isOutline = this.outline();

    const typeMap: Record<ButtonType, { filled: string, outline: string }> = {
      'primary': {
        filled: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500'
      },
      'secondary': {
        filled: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline: 'border border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500'
      },
      'success': {
        filled: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        outline: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500'
      },
      'danger': {
        filled: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500'
      },
      'warning': {
        filled: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
        outline: 'border border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-400'
      },
      'info': {
        filled: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
        outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-400'
      },
      'light': {
        filled: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
        outline: 'border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-gray-300'
      },
      'dark': {
        filled: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700',
        outline: 'border border-gray-800 text-gray-800 hover:bg-gray-100 focus:ring-gray-700'
      }
    };

    return isOutline ? typeMap[type].outline : typeMap[type].filled;
  });

  /**
   * 处理按钮点击事件
   */
  onClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.clicked.emit(event);
  }
}
