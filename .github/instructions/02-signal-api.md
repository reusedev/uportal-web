---
applyTo: '**'
---
# Angular Signal API 规范

Angular 17+ 的 Signal API 是本项目的核心状态管理机制。本文档提供了完整的 Signal API 使用规范和最佳实践。

## 基础使用规范

### 1. Signal 输入 (input)

使用 `input()` 函数替代传统的 `@Input()` 装饰器：

```typescript
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  // ...
})
export class ButtonComponent {
  // ✅ 基本输入
  protected type = input<'primary' | 'secondary' | 'danger'>('primary');
  
  // ✅ 必填输入
  protected label = input.required<string>();
  
  // ✅ 带转换的输入
  protected disabled = input(false, {
    transform: (value: unknown) => value === '' || value === true
  });
  
  // ✅ 计算属性基于输入
  protected buttonClasses = computed(() => {
    const baseClasses = 'px-4 py-2 rounded font-medium';
    const typeClasses = {
      'primary': 'bg-blue-500 text-white',
      'secondary': 'bg-gray-200 text-gray-800',
      'danger': 'bg-red-500 text-white'
    }[this.type()];
    
    return `${baseClasses} ${typeClasses}`;
  });
}
```

### 2. Signal 输出 (output)

使用 `output()` 函数替代 `@Output()` 装饰器和 EventEmitter：

```typescript
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-alert',
  // ...
})
export class AlertComponent {
  // ✅ 基本输出
  protected closed = output<void>();
  
  // ✅ 带数据的输出
  protected valueChange = output<string>();
  
  // 触发输出事件
  close(): void {
    this.closed.emit();
  }
  
  updateValue(newValue: string): void {
    this.valueChange.emit(newValue);
  }
}
```

### 3. 双向绑定 (model)

使用 `model()` 函数创建可双向绑定的信号：

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-input',
  template: `
    <input 
      [value]="value()" 
      (input)="updateValue($event)"
      [placeholder]="placeholder()"
    />
  `
})
export class InputComponent {
  // ✅ 双向绑定信号
  protected value = model<string>('');
  protected placeholder = input<string>('');
  
  updateValue(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }
}
```

## 状态管理规范

### 1. 内部状态

使用 `signal()` 管理组件内部状态：

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  // ...
})
export class DropdownComponent {
  // ✅ 内部状态信号
  private isOpen = signal<boolean>(false);
  private selectedIndex = signal<number>(-1);
  
  // ✅ 计算属性
  protected dropdownClasses = computed(() => {
    return [
      'dropdown',
      this.isOpen() ? 'dropdown-open' : 'dropdown-closed'
    ].join(' ');
  });
  
  toggle(): void {
    this.isOpen.update(open => !open);
  }
}
```

### 2. 计算属性

使用 `computed()` 创建派生状态：

```typescript
@Component({
  selector: 'app-card',
  // ...
})
export class CardComponent {
  protected title = input<string>('');
  protected bordered = input<boolean>(false);
  protected padding = input<'none' | 'small' | 'medium' | 'large'>('medium');
  
  // ✅ 基于多个输入的计算属性
  protected cardClasses = computed(() => {
    const classes = ['card'];
    
    if (this.bordered()) {
      classes.push('border border-gray-200');
    }
    
    const paddingMap = {
      'none': '',
      'small': 'p-2',
      'medium': 'p-4',
      'large': 'p-6'
    };
    
    classes.push(paddingMap[this.padding()]);
    
    return classes.filter(c => c).join(' ');
  });
}
```

### 3. 副作用处理

使用 `effect()` 处理副作用：

```typescript
import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  // ...
})
export class ThemeSwitcherComponent {
  protected theme = signal<'light' | 'dark'>('light');
  
  constructor() {
    // ✅ 副作用：主题变化时更新 DOM
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
    });
  }
}
```

## 信号更新模式

### 1. 不可变更新

确保使用不可变方式更新集合数据：

```typescript
@Component({
  selector: 'app-todo-list',
  // ...
})
export class TodoListComponent {
  protected todos = signal<Todo[]>([]);
  
  // ✅ 添加项目 - 创建新数组
  addTodo(todo: Todo): void {
    this.todos.update(current => [...current, todo]);
  }
  
  // ✅ 删除项目 - 创建新数组
  removeTodo(id: string): void {
    this.todos.update(current => current.filter(todo => todo.id !== id));
  }
  
  // ✅ 更新项目 - 创建新数组
  updateTodo(id: string, updates: Partial<Todo>): void {
    this.todos.update(current => 
      current.map(todo => 
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  }
}
```

### 2. 条件更新

使用 `untracked()` 避免不必要的依赖：

```typescript
import { Component, signal, computed, untracked } from '@angular/core';

@Component({
  selector: 'app-counter',
  // ...
})
export class CounterComponent {
  protected count = signal<number>(0);
  protected maxCount = signal<number>(10);
  
  // ✅ 使用 untracked 避免对 maxCount 的依赖
  protected displayValue = computed(() => {
    const current = this.count();
    const max = untracked(() => this.maxCount());
    
    return current > max ? `${max}+` : current.toString();
  });
}
```

## 访问修饰符规范

### 1. 模板可见性

- `protected`: 在模板中使用的信号
- `private`: 仅组件内部使用的信号

```typescript
@Component({
  selector: 'app-example',
  template: `
    <!-- ✅ 可以访问 protected 信号 -->
    <div [class]="containerClasses()">
      <h1>{{ title() }}</h1>
    </div>
  `
})
export class ExampleComponent {
  // ✅ protected - 模板中使用
  protected title = input<string>('');
  protected containerClasses = computed(() => 'container');
  
  // ✅ private - 仅内部使用
  private internalState = signal<boolean>(false);
}
```

## 性能优化

### 1. OnPush 策略

配合 Signal API 使用 OnPush 变更检测策略：

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ 推荐
  // ...
})
export class OptimizedComponent {
  // Signal API 与 OnPush 完美配合
}
```

### 2. 避免过度计算

合理组织计算属性，避免不必要的重复计算：

```typescript
@Component({
  selector: 'app-list',
  // ...
})
export class ListComponent {
  protected items = input<Item[]>([]);
  protected filter = input<string>('');
  
  // ✅ 拆分复杂计算
  protected filteredItems = computed(() => {
    const items = this.items();
    const filter = this.filter();
    
    if (!filter) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  });
  
  protected itemCount = computed(() => this.filteredItems().length);
  
  // ❌ 避免在一个计算属性中做太多事情
  // protected listData = computed(() => {
  //   // 大量复杂逻辑...
  // });
}
```

## 迁移指南

### 从传统装饰器迁移到 Signal API

**迁移前:**
```typescript
@Component({
  selector: 'app-old',
  // ...
})
export class OldComponent {
  @Input() title: string = '';
  @Input() set type(value: string) {
    this.typeSignal.set(value);
  }
  get type(): string {
    return this.typeSignal();
  }
  private typeSignal = signal<string>('primary');
  
  @Output() closed = new EventEmitter<void>();
}
```

**迁移后:**
```typescript
@Component({
  selector: 'app-new',
  // ...
})
export class NewComponent {
  protected title = input<string>('');
  protected type = input<string>('primary');
  protected closed = output<void>();
}
```

## 最佳实践

1. **组织信号**：将相关信号分组，先输入信号，再输出信号，最后内部状态信号
2. **命名规范**：使用描述性名称，避免使用 Signal 后缀
3. **类型安全**：始终为信号提供明确的类型参数
4. **文档注释**：为复杂的计算属性添加注释说明其用途
5. **测试覆盖**：确保信号的各种状态变化都有相应的测试用例

---

**相关文档：**
- [01-项目架构规范](./01-project-architecture.md)
- [03-组件开发规范](./03-component-development.md)
- [07-代码质量规范](./07-code-quality.md)
