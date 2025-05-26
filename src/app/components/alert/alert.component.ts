import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 警告框类型
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error';

/**
 * 警告框组件
 *
 * 提供统一的警告框UI，支持不同类型和状态
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  /** 警告框类型 */
  type = input<AlertType>('info');

  /** 标题 */
  title = input<string | undefined>(undefined);

  /** 是否可关闭 */
  closable = input<boolean>(false);

  /** 是否显示图标 */
  showIcon = input<boolean>(true);

  /** 自定义类名 */
  customClass = input<string>('');

  /** 控制警告框是否显示 */
  visible = input<boolean>(true);

  /** 关闭事件 */
  closed = output<void>();

  /**
   * 计算警告框类名
   */
  protected alertClasses = computed(() => {
    return [
      'rounded-md p-4',
      this.typeClass(),
      this.customClass()
    ].filter(c => c).join(' ');
  });

  /**
   * 根据类型返回对应的图标
   */
  protected alertIcon = computed(() => {
    const iconMap: Record<AlertType, string> = {
      'info': 'ri-information-line',
      'success': 'ri-checkbox-circle-line',
      'warning': 'ri-error-warning-line',
      'error': 'ri-close-circle-line'
    };

    return iconMap[this.type()];
  });

  /**
   * 根据类型返回对应的类名
   */
  private typeClass = computed((): string => {
    const typeMap: Record<AlertType, string> = {
      'info': 'bg-blue-50 text-blue-800',
      'success': 'bg-green-50 text-green-800',
      'warning': 'bg-yellow-50 text-yellow-800',
      'error': 'bg-red-50 text-red-800'
    };

    return typeMap[this.type()];
  });

  /**
   * 关闭警告框
   */
  close(): void {
    this.closed.emit();
  }
}
