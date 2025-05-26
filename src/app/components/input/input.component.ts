import { Component, computed, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * 输入框类型
 */
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

/**
 * 输入框大小
 */
export type InputSize = 'small' | 'medium' | 'large';

/**
 * 输入框组件
 *
 * 提供统一的输入框UI，支持不同类型、大小和状态
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  // Signal 输入
  label = input<string>('');
  type = input<InputType>('text');
  placeholder = input<string>('');
  size = input<InputSize>('medium');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  required = input<boolean>(false);
  error = input<string | null>(null);
  helperText = input<string>('');
  prefixIcon = input<string>('');
  suffixIcon = input<string>('');
  customClass = input<string>('');

  // 双向绑定的值
  value = model<string>('');

  // Signal 输出
  valueChange = output<string>();
  inputEvent = output<Event>();
  focusEvent = output<Event>();
  blurEvent = output<Event>();

  /**
   * 计算容器类名
   */
  containerClasses = computed(() => {
    const classes = [
      'relative',
      this.prefixIcon() ? 'pl-10' : '',
      this.suffixIcon() ? 'pr-10' : ''
    ];

    return classes.filter(c => c).join(' ');
  });

  /**
   * 计算输入框类名
   */
  inputClasses = computed(() => {
    const baseClasses = [
      'w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
      'placeholder-gray-400'
    ];

    // 大小相关类名
    const sizeClasses = this.getSizeClasses();

    // 状态相关类名
    const stateClasses = this.getStateClasses();

    // 图标相关内边距
    const iconPadding = this.getIconPadding();

    return [
      ...baseClasses,
      sizeClasses,
      stateClasses,
      iconPadding,
      this.customClass()
    ].filter(c => c).join(' ');
  });

  /**
   * 根据大小返回对应的类名
   */
  private getSizeClasses(): string {
    const sizeMap: Record<InputSize, string> = {
      'small': 'px-3 py-1.5 text-sm',
      'medium': 'px-3 py-2 text-sm',
      'large': 'px-4 py-3 text-base'
    };

    return sizeMap[this.size()];
  }

  /**
   * 根据状态返回对应的类名
   */
  private getStateClasses(): string {
    if (this.error()) {
      return 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 error-input';
    }

    if (this.disabled()) {
      return 'border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed';
    }

    if (this.readonly()) {
      return 'border-gray-300 bg-gray-50 text-gray-700';
    }

    return 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400';
  }

  /**
   * 根据图标位置返回对应的内边距
   */
  private getIconPadding(): string {
    const classes = [];

    if (this.prefixIcon()) {
      classes.push('pl-10');
    }

    if (this.suffixIcon()) {
      classes.push('pr-10');
    }

    return classes.join(' ');
  }

  /**
   * 处理输入事件
   */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.valueChange.emit(target.value);
    this.inputEvent.emit(event);
  }

  /**
   * 处理获得焦点事件
   */
  onFocus(event: Event): void {
    this.focusEvent.emit(event);
  }

  /**
   * 处理失去焦点事件
   */
  onBlur(event: Event): void {
    this.blurEvent.emit(event);
  }
}
