---
applyTo: '**'
---
# Figma 设计集成规范

本文档规定了从 Figma 设计稿到 Angular 组件的完整转换流程，确保设计与开发的一致性。

## Figma 设计分析流程

### 1. 设计稿分析

在开始组件开发前，必须完成以下分析：

#### 组件结构分析
```typescript
// 分析 Figma 组件的结构层级
interface DesignAnalysis {
  // 组件类型
  componentType: 'UI' | 'Layout' | 'Business';
  
  // 组件变体
  variants: {
    size?: 'small' | 'medium' | 'large';
    type?: 'primary' | 'secondary' | 'danger';
    state?: 'default' | 'hover' | 'active' | 'disabled';
  };
  
  // 组件层级
  structure: {
    container: DesignNode;
    header?: DesignNode;
    content: DesignNode;
    footer?: DesignNode;
  };
  
  // 交互状态
  interactions: {
    hover?: StyleChanges;
    active?: StyleChanges;
    focus?: StyleChanges;
    disabled?: StyleChanges;
  };
}
```

#### 样式属性提取
```typescript
// 从 Figma 提取的样式信息
interface FigmaStyles {
  // 尺寸
  dimensions: {
    width: number | 'auto' | 'fill';
    height: number | 'auto' | 'fit-content';
    padding: EdgeInsets;
    margin: EdgeInsets;
  };
  
  // 颜色
  colors: {
    background: FigmaColor;
    text: FigmaColor;
    border: FigmaColor;
  };
  
  // 字体
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
  
  // 效果
  effects: {
    shadow: BoxShadow[];
    borderRadius: number;
    opacity: number;
  };
}
```

### 2. 设计标记 (Design Tokens)

#### 颜色映射
```typescript
// Figma 颜色到 Tailwind 类名的映射
const colorMapping = {
  // 主色调
  'Primary/600': 'bg-primary-600',
  'Primary/700': 'bg-primary-700',
  'Primary/50': 'bg-primary-50',
  
  // 语义色彩
  'Success/600': 'bg-success-600',
  'Error/600': 'bg-error-600',
  'Warning/600': 'bg-warning-600',
  'Info/600': 'bg-information-600',
  
  // 中性色
  'Gray/50': 'bg-gray-50',
  'Gray/100': 'bg-gray-100',
  'Gray/200': 'bg-gray-200',
  'Gray/300': 'bg-gray-300',
  'Gray/400': 'bg-gray-400',
  'Gray/500': 'bg-gray-500',
  'Gray/600': 'bg-gray-600',
  'Gray/700': 'bg-gray-700',
  'Gray/800': 'bg-gray-800',
  'Gray/900': 'bg-gray-900',
  
  // 文字色彩
  'Text/Strong': 'text-text-strong-950',
  'Text/Sub': 'text-text-sub-600',
  'Text/Soft': 'text-text-soft-400',
  'Text/Disabled': 'text-text-disabled-300',
};
```

#### 尺寸映射
```typescript
// Figma 尺寸到 Tailwind 的映射
const sizeMapping = {
  // 间距
  '4px': 'p-1',
  '8px': 'p-2',
  '12px': 'p-3',
  '16px': 'p-4',
  '20px': 'p-5',
  '24px': 'p-6',
  '32px': 'p-8',
  
  // 圆角
  '4px': 'rounded',
  '6px': 'rounded-md',
  '8px': 'rounded-lg',
  '12px': 'rounded-xl',
  
  // 阴影
  'sm': 'shadow-custom-sm',
  'md': 'shadow-custom-md',
  'lg': 'shadow-custom-lg',
  'xl': 'shadow-custom-xl',
};
```

#### 字体映射
```typescript
// Figma 字体到 Tailwind 类名的映射
const typographyMapping = {
  // 标题系列
  'Title/H1': 'text-title-h1',
  'Title/H2': 'text-title-h2',
  'Title/H3': 'text-title-h3',
  'Title/H4': 'text-title-h4',
  'Title/H5': 'text-title-h5',
  'Title/H6': 'text-title-h6',
  
  // 标签系列
  'Label/XL': 'text-label-xl',
  'Label/LG': 'text-label-lg',
  'Label/MD': 'text-label-md',
  'Label/SM': 'text-label-sm',
  'Label/XS': 'text-label-xs',
  
  // 正文系列
  'Body/XL': 'text-body-xl',
  'Body/LG': 'text-body-lg',
  'Body/MD': 'text-body-md',
  'Body/SM': 'text-body-sm',
  'Body/XS': 'text-body-xs',
};
```

## 组件转换流程

### 1. 按钮组件转换示例

#### Figma 设计分析
```typescript
// Figma 按钮组件分析
interface ButtonDesign {
  variants: {
    type: 'Primary' | 'Secondary' | 'Danger' | 'Outline';
    size: 'Small' | 'Medium' | 'Large';
    state: 'Default' | 'Hover' | 'Active' | 'Disabled';
  };
  
  styles: {
    // Primary 变体
    Primary: {
      Default: {
        background: 'Primary/600',
        text: 'White',
        border: 'none',
        padding: '12px 16px',
        borderRadius: '6px',
      },
      Hover: {
        background: 'Primary/700',
      },
      Disabled: {
        background: 'Gray/300',
        text: 'Gray/500',
      }
    }
  };
}
```

#### Angular 组件实现
```typescript
@Component({
  selector: 'app-button',
  template: `
    <button 
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="handleClick($event)"
    >      <!-- 加载图标 -->
      @if (loading()) {
        <i class="ri-loader-4-line animate-spin mr-2"></i>
      }
      
      <!-- 左侧图标 -->
      @if (icon() && iconPosition() === 'left') {
        <i [class]="icon() + ' mr-2'"></i>
      }
      
      <!-- 按钮文字 -->
      <ng-content></ng-content>
      
      <!-- 右侧图标 -->
      @if (icon() && iconPosition() === 'right') {
        <i [class]="icon() + ' ml-2'"></i>
      }
    </button>
  `
})
export class ButtonComponent {
  // Signal 输入 - 对应 Figma 变体
  protected type = input<'primary' | 'secondary' | 'danger' | 'outline'>('primary');
  protected size = input<'small' | 'medium' | 'large'>('medium');
  protected disabled = input<boolean>(false);
  protected loading = input<boolean>(false);
  protected icon = input<string>('');
  protected iconPosition = input<'left' | 'right'>('left');
  
  // 计算类名 - 基于 Figma 设计
  protected buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    // 尺寸类名 - 对应 Figma Small/Medium/Large
    const sizeClasses = {
      'small': 'px-2.5 py-1.5 text-xs',
      'medium': 'px-3 py-2 text-sm',
      'large': 'px-4 py-2 text-base'
    }[this.size()];
    
    // 类型类名 - 对应 Figma Primary/Secondary 等
    const typeClasses = {
      'primary': 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      'secondary': 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      'danger': 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
      'outline': 'border border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 focus:ring-primary-500'
    }[this.type()];
    
    // 禁用状态 - 对应 Figma Disabled 状态
    const disabledClasses = this.disabled() || this.loading() 
      ? 'opacity-50 cursor-not-allowed pointer-events-none' 
      : '';
    
    return [baseClasses, sizeClasses, typeClasses, disabledClasses]
      .filter(Boolean)
      .join(' ');
  });
  
  protected clicked = output<MouseEvent>();
  
  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
```

### 2. 卡片组件转换示例

#### Figma 设计分析
```typescript
interface CardDesign {
  structure: {
    container: {
      background: 'White',
      border: 'Gray/200',
      borderRadius: '8px',
      shadow: 'sm',
      padding: '24px'
    },
    header: {
      marginBottom: '16px',
      title: {
        fontSize: 'Label/LG',
        color: 'Text/Strong'
      },
      subtitle: {
        fontSize: 'Body/SM',
        color: 'Text/Sub',
        marginTop: '4px'
      }
    },
    content: {
      fontSize: 'Body/MD',
      color: 'Text/Strong'
    }
  };
}
```

#### Angular 组件实现
```typescript
@Component({
  selector: 'app-card',
  template: `
    <div [class]="cardClasses()">      <!-- 卡片头部 -->
      @if (title() || subtitle()) {
        <div [class]="headerClasses()">
          @if (title()) {
            <h3 class="text-label-lg font-medium text-text-strong-950">
              {{ title() }}
            </h3>
          }
          @if (subtitle()) {
            <p class="text-body-sm text-text-sub-600 mt-1">
              {{ subtitle() }}
            </p>
          }
        </div>
      }
      
      <!-- 卡片内容 -->
      <div [class]="contentClasses()">
        <ng-content></ng-content>
      </div>
      
      <!-- 卡片底部 -->
      @if (hasFooter) {
        <div class="mt-6 pt-6 border-t border-stroke-soft-200">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      }
    </div>
  `
})
export class CardComponent implements AfterContentInit {
  // Signal 输入
  protected title = input<string>('');
  protected subtitle = input<string>('');
  protected bordered = input<boolean>(true);
  protected padding = input<'none' | 'small' | 'medium' | 'large'>('medium');
  protected shadow = input<'none' | 'sm' | 'md' | 'lg'>('sm');
  
  // 内部状态
  protected hasFooter = signal<boolean>(false);
  
  // 计算类名
  protected cardClasses = computed(() => {
    const baseClasses = 'bg-white rounded-lg';
    const borderClasses = this.bordered() ? 'border border-stroke-soft-200' : '';
    const shadowClasses = this.shadow() !== 'none' ? `shadow-custom-${this.shadow()}` : '';
    const paddingClasses = this.getPaddingClasses();
    
    return [baseClasses, borderClasses, shadowClasses, paddingClasses]
      .filter(Boolean)
      .join(' ');
  });
  
  protected headerClasses = computed(() => {
    return this.title() && this.subtitle() ? 'mb-4' : this.title() ? 'mb-4' : '';
  });
  
  protected contentClasses = computed(() => {
    return 'text-body-md text-text-strong-950';
  });
  
  private getPaddingClasses(): string {
    const paddingMap = {
      'none': '',
      'small': 'p-4',
      'medium': 'p-6',
      'large': 'p-8'
    };
    
    return paddingMap[this.padding()];
  }
  
  @ContentChildren('footer', { descendants: true })
  footerContent!: QueryList<ElementRef>;
  
  ngAfterContentInit(): void {
    this.hasFooter.set(this.footerContent.length > 0);
  }
}
```

## 状态映射

### 1. 交互状态转换

#### Figma 状态到 CSS 状态的映射
```typescript
// Figma 交互状态转换
const stateMapping = {
  // 悬停状态
  'Hover': {
    css: 'hover:',
    example: 'hover:bg-primary-700'
  },
  
  // 激活状态
  'Active/Pressed': {
    css: 'active:',
    example: 'active:bg-primary-800'
  },
  
  // 焦点状态
  'Focus': {
    css: 'focus:',
    example: 'focus:ring-2 focus:ring-primary-500'
  },
  
  // 禁用状态
  'Disabled': {
    css: 'disabled:',
    example: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  
  // 选中状态
  'Selected': {
    css: 'aria-selected:',
    example: 'aria-selected:bg-primary-50'
  }
};
```

#### 动态状态处理
```typescript
@Component({
  selector: 'app-interactive-element',
  template: `
    <div 
      [class]="elementClasses()"
      [attr.aria-selected]="selected()"
      [attr.aria-disabled]="disabled()"
    >
      <!-- 内容 -->
    </div>
  `
})
export class InteractiveElementComponent {
  protected selected = input<boolean>(false);
  protected disabled = input<boolean>(false);
  protected variant = input<'primary' | 'secondary'>('primary');
  
  protected elementClasses = computed(() => {
    const baseClasses = 'transition-all duration-200 cursor-pointer';
    
    // 基础样式
    const variantClasses = {
      'primary': 'bg-white border border-gray-200',
      'secondary': 'bg-gray-50 border border-gray-300'
    }[this.variant()];
    
    // 交互状态
    const interactionClasses = [
      // 悬停状态 - 对应 Figma Hover
      'hover:shadow-md hover:border-primary-300',
      
      // 焦点状态 - 对应 Figma Focus
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      
      // 激活状态 - 对应 Figma Active
      'active:scale-98',
    ].join(' ');
    
    // 条件状态
    const conditionalClasses = [
      // 选中状态 - 对应 Figma Selected
      this.selected() ? 'bg-primary-50 border-primary-500' : '',
      
      // 禁用状态 - 对应 Figma Disabled
      this.disabled() ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
    ].filter(Boolean).join(' ');
    
    return [baseClasses, variantClasses, interactionClasses, conditionalClasses]
      .filter(Boolean)
      .join(' ');
  });
}
```

## 响应式设计转换

### 1. Figma 断点到 Tailwind 断点

```typescript
// Figma 设备尺寸映射
const breakpointMapping = {
  'Mobile': {
    figmaWidth: '375px',
    tailwindBreakpoint: 'default', // 移动优先
    classes: 'block'
  },
  'Tablet': {
    figmaWidth: '768px',
    tailwindBreakpoint: 'md:',
    classes: 'md:flex'
  },
  'Desktop': {
    figmaWidth: '1024px',
    tailwindBreakpoint: 'lg:',
    classes: 'lg:grid lg:grid-cols-3'
  },
  'Large Desktop': {
    figmaWidth: '1440px',
    tailwindBreakpoint: 'xl:',
    classes: 'xl:max-w-7xl xl:mx-auto'
  }
};
```

### 2. 响应式组件实现

```typescript
@Component({
  selector: 'app-responsive-layout',
  template: `
    <!-- 对应 Figma 不同设备的布局 -->
    <div [class]="layoutClasses()">
      
      <!-- 移动端：垂直堆叠 -->
      <!-- 平板：2列网格 -->
      <!-- 桌面：3列网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ng-content></ng-content>
      </div>
      
      <!-- 移动端导航：底部固定 -->
      <!-- 桌面端导航：顶部横向 -->
      <nav class="fixed bottom-0 left-0 right-0 md:relative md:top-0">
        <!-- 导航内容 -->
      </nav>
      
    </div>
  `
})
export class ResponsiveLayoutComponent {
  protected layoutClasses = computed(() => {
    return [
      // 移动端样式 - 对应 Figma Mobile 设计
      'min-h-screen bg-gray-50',
      
      // 平板样式 - 对应 Figma Tablet 设计
      'md:bg-white md:container md:mx-auto',
      
      // 桌面样式 - 对应 Figma Desktop 设计
      'lg:max-w-7xl lg:px-8'
    ].join(' ');
  });
}
```

## 图标和图像处理

### 1. Figma 图标转换

```typescript
// Figma 图标到 Remix Icon 的映射
const iconMapping = {
  // 导航图标
  'Home': 'ri-home-line',
  'User': 'ri-user-line',
  'Settings': 'ri-settings-line',
  'Search': 'ri-search-line',
  
  // 操作图标
  'Add': 'ri-add-line',
  'Edit': 'ri-edit-line',
  'Delete': 'ri-delete-line',
  'Save': 'ri-save-line',
  
  // 状态图标
  'Success': 'ri-check-circle-line',
  'Error': 'ri-close-circle-line',
  'Warning': 'ri-error-warning-line',
  'Info': 'ri-information-line',
  
  // 箭头图标
  'Arrow Right': 'ri-arrow-right-line',
  'Arrow Left': 'ri-arrow-left-line',
  'Arrow Up': 'ri-arrow-up-line',
  'Arrow Down': 'ri-arrow-down-line',
  
  // 展开/收起
  'Chevron Right': 'ri-arrow-right-s-line',
  'Chevron Down': 'ri-arrow-down-s-line',
};
```

### 2. 图标组件实现

```typescript
@Component({
  selector: 'app-icon',
  template: `
    <i 
      [class]="iconClasses()"
      [attr.aria-hidden]="true"
    ></i>
  `
})
export class IconComponent {
  protected name = input.required<string>();
  protected size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md');
  protected color = input<'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'>('inherit');
  
  protected iconClasses = computed(() => {
    // Remix Icon 类名
    const iconName = this.getRemixIconName();
    
    // 尺寸类名
    const sizeClasses = {
      'xs': 'text-xs',
      'sm': 'text-sm',
      'md': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl'
    }[this.size()];
    
    // 颜色类名
    const colorClasses = {
      'inherit': '',
      'primary': 'text-primary-600',
      'secondary': 'text-gray-600',
      'success': 'text-success-600',
      'error': 'text-error-600',
      'warning': 'text-warning-600',
      'info': 'text-information-600'
    }[this.color()];
    
    return [iconName, sizeClasses, colorClasses]
      .filter(Boolean)
      .join(' ');
  });
  
  private getRemixIconName(): string {
    // 从映射表获取 Remix Icon 名称
    return iconMapping[this.name()] || `ri-${this.name()}-line`;
  }
}
```

## 最佳实践

### 1. 设计稿检查清单

在开始组件开发前，确保完成以下检查：

- [ ] 确认所有组件变体和状态
- [ ] 提取所有颜色、字体、间距值
- [ ] 分析组件的层级结构
- [ ] 确认响应式行为
- [ ] 检查交互状态定义
- [ ] 验证图标和图像资源

### 2. 开发流程

1. **设计分析**：完整分析 Figma 组件
2. **标记提取**：提取设计标记(Design Tokens)
3. **结构规划**：规划组件 HTML 结构
4. **样式转换**：将设计样式转换为 Tailwind 类
5. **交互实现**：实现组件交互逻辑
6. **测试验证**：与设计稿对比验证

### 3. 质量保证

- **像素完美**：确保组件与设计稿像素级一致
- **状态完整**：实现所有设计状态
- **响应式适配**：确保在所有设备上正确显示
- **无障碍支持**：添加适当的 ARIA 属性
- **性能优化**：确保组件加载和渲染性能

---

**相关文档：**
- [04-Tailwind 样式规范](./04-tailwind-styling.md)
- [03-组件开发规范](./03-component-development.md)
- [02-Signal API 规范](./02-signal-api.md)
