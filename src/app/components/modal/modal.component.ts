import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

/**
 * 模态框组件
 *
 * 提供统一的模态框UI，支持自定义内容和尺寸
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  /** 是否显示模态框 */
  isOpen = input<boolean>(false);

  /** 模态框标题 */
  title = input<string>('');

  /** 模态框尺寸 */
  size = input<'small' | 'medium' | 'large' | 'xlarge'>('medium');

  /** 是否显示关闭按钮 */
  showCloseButton = input<boolean>(true);

  /** 是否点击背景关闭 */
  closeOnBackdropClick = input<boolean>(true);

  /** 关闭事件 */
  closed = output<void>();

  /** 确认事件 */
  confirmed = output<void>();

  /**
   * 计算模态框容器的类名
   */
  protected modalClasses = computed(() => {
    const sizeMap = {
      'small': 'max-w-md',
      'medium': 'max-w-lg',
      'large': 'max-w-2xl',
      'xlarge': 'max-w-4xl'
    };

    return `${sizeMap[this.size()]} w-full mx-4`;
  });

  /**
   * 关闭模态框
   */
  protected close(): void {
    this.closed.emit();
  }

  /**
   * 背景点击处理
   */
  protected onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdropClick() && event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * 确认按钮点击
   */
  protected onConfirm(): void {
    this.confirmed.emit();
  }

  /**
   * 处理Escape键
   */
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
