---
applyTo: '**'
---
# 组件开发规范

本文档规定了 Angular 组件开发的标准化流程、代码结构和最佳实践。

## 组件分类与职责

### 1. UI 组件 (UI Components)

**位置**: `src/app/components/`  
**职责**: 通用、可复用的界面元素

```typescript
// 示例：Button 组件
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'], // 保持为空
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  // Signal API 输入
  protected type = input<'primary' | 'secondary' | 'danger'>('primary');
  protected size = input<'small' | 'medium' | 'large'>('medium');
  protected disabled = input<boolean>(false);
  protected loading = input<boolean>(false);
  
  // Signal API 输出
  protected clicked = output<MouseEvent>();
  
  // 计算属性
  protected buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors';
    
    const sizeClasses = {
      'small': 'px-2.5 py-1.5 text-xs',
      'medium': 'px-3 py-2 text-sm',
      'large': 'px-4 py-2 text-base'
    }[this.size()];
    
    const typeClasses = {
      'primary': 'bg-primary-600 text-white hover:bg-primary-700',
      'secondary': 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      'danger': 'bg-red-600 text-white hover:bg-red-700'
    }[this.type()];
    
    const disabledClasses = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';
    
    return [baseClasses, sizeClasses, typeClasses, disabledClasses]
      .filter(Boolean)
      .join(' ');
  });
  
  onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
```

### 2. 布局组件 (Layout Components)

**位置**: `src/app/layouts/`  
**职责**: 页面结构和布局管理

```typescript
// 示例：PageContainer 组件
@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- 页面头部 -->      @if (showHeader()) {
        <header [class]="headerClasses()">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900">{{ title() }}</h1>
            @if (subtitle()) {
              <p class="mt-1 text-sm text-gray-500">{{ subtitle() }}</p>
            }
          </div>
        </header>
      }
      
      <!-- 页面内容 -->
      <main [class]="contentClasses()">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ng-content></ng-content>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent {
  protected title = input<string>('');
  protected subtitle = input<string>('');
  protected showHeader = input<boolean>(true);
  protected padding = input<'none' | 'small' | 'medium' | 'large'>('medium');
  
  protected headerClasses = computed(() => {
    return 'bg-white shadow-sm border-b border-gray-200 py-6';
  });
  
  protected contentClasses = computed(() => {
    const paddingMap = {
      'none': '',
      'small': 'py-4',
      'medium': 'py-8',
      'large': 'py-12'
    };
    
    return `flex-1 ${paddingMap[this.padding()]}`;
  });
}
```

### 3. 业务组件 (Business Components)

**位置**: `src/app/features/[feature-name]/components/`  
**职责**: 特定业务逻辑实现

## 组件创建流程

### 1. 设计分析

在开始编码前，分析设计要求：

```typescript
// 1. 确定组件输入属性
interface ComponentInputs {
  // 必需属性
  data: RequiredData;
  
  // 可选属性（带默认值）
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

// 2. 确定组件输出事件
interface ComponentOutputs {
  itemSelected: (item: Item) => void;
  stateChanged: (state: ComponentState) => void;
}

// 3. 确定内部状态
interface ComponentState {
  isOpen: boolean;
  selectedIndex: number;
  loading: boolean;
}
```

### 2. 使用 CLI 生成组件

```bash
# UI 组件
ng generate component components/component-name

# 布局组件
ng generate component layouts/layout-name

# 业务组件
ng generate component features/feature-name/components/component-name
```

### 3. 组件代码结构

```typescript
import { Component, ChangeDetectionStrategy, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1. 类型定义
export type ComponentVariant = 'primary' | 'secondary' | 'danger';
export type ComponentSize = 'small' | 'medium' | 'large';

// 2. 组件装饰器
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.css'], // 保持为空
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentNameComponent {
  // 3. Signal 输入（按重要性排序）
  protected variant = input<ComponentVariant>('primary');
  protected size = input<ComponentSize>('medium');
  protected disabled = input<boolean>(false);
  protected customClass = input<string>('');
  
  // 4. Signal 输出
  protected itemSelected = output<Item>();
  protected stateChanged = output<ComponentState>();
  
  // 5. 内部状态信号
  private isOpen = signal<boolean>(false);
  private selectedIndex = signal<number>(-1);
  
  // 6. 计算属性
  protected containerClasses = computed(() => {
    const baseClasses = 'component-container';
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    const disabledClasses = this.disabled() ? 'opacity-50 pointer-events-none' : '';
    
    return [
      baseClasses,
      variantClasses,
      sizeClasses,
      disabledClasses,
      this.customClass()
    ].filter(Boolean).join(' ');
  });
  
  // 7. 私有辅助方法
  private getVariantClasses(): string {
    const variantMap = {
      'primary': 'bg-primary-600 text-white',
      'secondary': 'bg-gray-200 text-gray-900',
      'danger': 'bg-red-600 text-white'
    };
    
    return variantMap[this.variant()];
  }
  
  private getSizeClasses(): string {
    const sizeMap = {
      'small': 'px-2 py-1 text-xs',
      'medium': 'px-3 py-2 text-sm',
      'large': 'px-4 py-3 text-base'
    };
    
    return sizeMap[this.size()];
  }
  
  // 8. 公共方法
  toggle(): void {
    this.isOpen.update(open => !open);
  }
  
  selectItem(item: Item): void {
    this.itemSelected.emit(item);
  }
}
```

## 模板规范

### 1. 模板结构

```html
<!-- component-name.component.html -->

<!-- 主容器 - 使用计算的类名 -->
<div [class]="containerClasses()">
  
  <!-- 条件渲染使用 Angular Control Flow -->
  @if (showHeader()) {
    <div class="component-header">
      <h3 class="text-lg font-medium">{{ title() }}</h3>
      @if (subtitle()) {
        <p class="text-sm text-gray-500">{{ subtitle() }}</p>
      }
    </div>
  }
  
  <!-- 列表渲染使用 Angular Control Flow -->
  @if (items().length > 0) {
    <ul class="space-y-2">
      @for (item of items(); track item.id; let i = $index) {
        <li 
          [class]="getItemClasses(i)"
          (click)="selectItem(item)"
        >
          {{ item.name }}
        </li>
      }
    </ul>
  } @else {
    <!-- 空状态 -->
    <div class="text-center py-8">
      <p class="text-gray-500">暂无数据</p>
    </div>
  }
  
  <!-- 插槽内容 -->
  <div class="component-content">
    <ng-content></ng-content>
  </div>
  
  <!-- 命名插槽 -->
  <div class="component-footer">
    <ng-content select="[slot=footer]"></ng-content>
  </div>
  
</div>
```

### 2. 模板最佳实践

- **Track 表达式**: 列表渲染时使用 `track` 表达式提升性能
- **条件渲染**: 使用 `@if/@else` 而非 CSS 隐藏
- **列表渲染**: 使用 `@for` 替代 `*ngFor`
- **类名绑定**: 使用计算属性生成动态类名
- **事件处理**: 绑定到组件方法，避免模板中的复杂逻辑

## 样式实现规范

### 1. 纯 Tailwind CSS

所有样式必须使用 Tailwind CSS 类名实现：

```html
<!-- ✅ 正确：使用 Tailwind 类 -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  按钮
</button>

<!-- ❌ 错误：自定义 CSS -->
<button class="custom-button">
  按钮
</button>
```

### 2. 响应式设计

使用 Tailwind 的响应式前缀：

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 内容 -->
</div>
```

### 3. 主题色彩

使用项目定义的设计系统颜色：

```html
<!-- 主色调 -->
<div class="bg-primary-600 text-white">主要内容</div>

<!-- 语义色彩 -->
<div class="bg-success-50 text-success-800 border border-success-200">
  成功消息
</div>

<div class="bg-error-50 text-error-800 border border-error-200">
  错误消息
</div>
```

## 组件测试

### 1. 单元测试结构

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  describe('输入属性', () => {
    it('应该设置默认类型为 primary', () => {
      expect(component.type()).toBe('primary');
    });

    it('应该正确更新类型', () => {
      fixture.componentRef.setInput('type', 'secondary');
      expect(component.type()).toBe('secondary');
    });
  });

  describe('输出事件', () => {
    it('应该在点击时触发 clicked 事件', () => {
      spyOn(component.clicked, 'emit');
      
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      
      expect(component.clicked.emit).toHaveBeenCalled();
    });
  });

  describe('计算属性', () => {
    it('应该根据输入生成正确的类名', () => {
      fixture.componentRef.setInput('type', 'primary');
      fixture.componentRef.setInput('size', 'large');
      
      expect(component.buttonClasses()).toContain('bg-primary-600');
      expect(component.buttonClasses()).toContain('px-4 py-2');
    });
  });
});
```

## 组件文档

### 1. JSDoc 注释

```typescript
/**
 * 按钮组件
 * 
 * 提供统一的按钮UI，支持多种类型、大小和状态。
 * 
 * @example
 * ```html
 * <app-button 
 *   type="primary" 
 *   size="large"
 *   (clicked)="handleClick($event)"
 * >
 *   点击我
 * </app-button>
 * ```
 */
@Component({
  // ...
})
export class ButtonComponent {
  /**
   * 按钮类型
   * @default 'primary'
   */
  protected type = input<'primary' | 'secondary' | 'danger'>('primary');
  
  /**
   * 按钮点击事件
   */
  protected clicked = output<MouseEvent>();
}
```

### 2. README 文档

每个复杂组件应包含 README.md：

```markdown
# ButtonComponent

通用按钮组件，支持多种样式和状态。

## 使用方法

```typescript
import { ButtonComponent } from './components/button/button.component';

@Component({
  imports: [ButtonComponent],
  template: `
    <app-button type="primary" (clicked)="onClick()">
      点击我
    </app-button>
  `
})
```

## API

### 输入属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| type | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | 按钮类型 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮大小 |
| disabled | `boolean` | `false` | 是否禁用 |

### 输出事件

| 事件 | 类型 | 描述 |
|------|------|------|
| clicked | `MouseEvent` | 按钮点击事件 |
```

## 性能优化

### 1. OnPush 策略

所有组件都应使用 OnPush 变更检测策略：

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### 2. Track 表达式

列表渲染时使用 track 表达式：

```typescript
// 不再需要在组件中定义 trackBy 函数
// Angular Control Flow 直接使用 track 表达式
```

```html
<!-- 模板中使用 Angular Control Flow -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

### 3. 延迟加载

对于大型组件使用延迟加载：

```typescript
// 路由配置中
{
  path: 'feature',
  loadComponent: () => import('./feature/feature.component').then(m => m.FeatureComponent)
}
```

---

**相关文档：**
- [02-Signal API 规范](./02-signal-api.md)
- [04-Tailwind 样式规范](./04-tailwind-styling.md)
- [07-代码质量规范](./07-code-quality.md)
