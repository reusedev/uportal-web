---
applyTo: '**'
---
# Angular 项目综合开发规范

本文档整合了所有与 Angular 开发相关的规范和最佳实践，为项目开发提供统一的指导方针。

## 目录

1. [组件开发概述](#组件开发概述)
2. [Angular API 规范](#angular-api-规范)
3. [组件组织结构](#组件组织结构) 
4. [Tailwind CSS 与样式实现](#tailwind-css-与样式实现)
5. [依赖管理](#依赖管理)

## 组件开发概述

Angular 组件开发是项目构建的基础。遵循以下原则能确保组件的高质量和可维护性：

### 核心原则

1. **组件类型分类**：
   - UI组件：通用、可复用的界面元素（按钮、输入框等）
   - 布局组件：处理页面结构（页头、侧边栏等）
   - 业务组件：特定业务功能的实现

2. **现代化API使用**：
   - 使用 Angular 最新的 Signal API 进行状态管理
   - 避免使用旧式装饰器（@Input/@Output）
   - 采用 functional approach（功能式方法）

3. **Tailwind 优先**：
   - 组件样式必须使用 Tailwind CSS 类实现
   - 避免编写传统 CSS，保持样式文件为空
   - 遵循 Figma 设计到 Tailwind 类的转换规则

4. **依赖最小化**：
   - 优先使用项目现有依赖
   - 避免不必要的依赖引入
   - 严格管理依赖版本

### 组件创建流程

1. **设计分析**：
   - 分析 Figma 设计，确定组件结构和变体
   - 确定组件的输入属性、输出事件和状态

2. **组件生成**：
   - 使用 Angular CLI 生成标准组件结构
   ```bash
   ng generate component path/to/component-name
   ```

3. **组件实现**：
   - 使用 Signal API 定义输入和输出
   - 用 Tailwind 类实现样式
   - 保持 `.css` 文件为空

4. **组件测试**：
   - 确保组件功能符合预期
   - 验证样式和响应式行为
   - 检查可访问性

## Angular API 规范

Angular 17+ 引入了现代化的 Signal API，本项目必须严格遵循这些最新实践。

### Signal API 基础使用

1. **状态管理基础**：
   - 优先使用 `signal()`、`computed()` 和 `effect()` 函数管理组件状态
   - 对于模板中使用的信号，使用 `protected` 访问修饰符而非 `private`
   - **严格避免**传统的 `@Input()` 装饰器与 getter/setter 组合的模式

2. **Signal 输入**：
   - 使用 `input()` 函数替代传统 `@Input()` 装饰器
   - 对于必填输入，使用 `input.required<类型>()`
   - 使用 `input.transform()` 在输入时转换值

   ```typescript
   // 正确做法:
   // 基本输入
   protected type = input<string>('default');
   
   // 必填输入
   protected required = input.required<number>();
   
   // 带转换的输入
   protected count = input(0, { transform: (v: string) => Number(v) });
   ```

3. **信号创建与更新**：
   ```typescript
   // 创建信号
   protected count = signal(0);
   
   // 创建计算信号
   protected doubleCount = computed(() => this.count() * 2);
   
   // 更新信号值
   this.count.set(1);           // 直接设置
   this.count.update(c => c+1); // 基于当前值更新
   ```

4. **双向绑定**：
   - 使用 `model()` 函数创建可双向绑定的信号
   ```typescript
   protected username = model('');  // 创建可双向绑定的信号
   
   // 在模板中使用
   <input [(ngModel)]="username">
   ```

5. **输出信号**：
   - 使用 `output()` 函数替代传统 `@Output()` 装饰器和 EventEmitter
   ```typescript
   protected closed = output<void>();
   
   // 触发输出
   this.closed.emit();
   ```

### Angular Control Flow (推荐)

Angular 17+ 引入了新的控制流语法，必须优先使用这些现代语法替代传统指令：

1. **条件渲染 - @if/@else**：
   ```html
   <!-- 替代 *ngIf -->
   @if (condition()) {
     <div>条件为真时显示</div>
   } @else {
     <div>条件为假时显示</div>
   }
   
   <!-- 多重条件 -->
   @if (status() === 'loading') {
     <div>加载中...</div>
   } @else if (status() === 'error') {
     <div>出错了</div>
   } @else {
     <div>正常内容</div>
   }
   ```

2. **列表渲染 - @for**：
   ```html
   <!-- 替代 *ngFor -->
   @for (item of items(); track item.id) {
     <div>{{ item.name }}</div>
   } @empty {
     <div>暂无数据</div>
   }
   
   <!-- 带索引的列表渲染 -->
   @for (item of items(); track item.id; let i = $index) {
     <div>{{ i + 1 }}. {{ item.name }}</div>
   }
   ```

3. **切换渲染 - @switch**：
   ```html
   <!-- 替代 ngSwitch -->
   @switch (type()) {
     @case ('primary') {
       <button class="btn-primary">主要按钮</button>
     }
     @case ('secondary') {
       <button class="btn-secondary">次要按钮</button>
     }
     @default {
       <button class="btn-default">默认按钮</button>
     }
   }
   ```

4. **性能优势**：
   - 编译时优化，性能更好
   - 类型安全性更强
   - 代码更简洁易读
   - 无需在组件中导入 CommonModule

### 依赖注入与资源管理

1. **函数式注入**：
   - 使用 `inject()` 函数代替构造函数依赖注入
   ```typescript
   export class MyComponent {
     private service = inject(MyService);
     // 替代 constructor(private service: MyService) {}
   }
   ```

2. **资源管理**：
   - 使用 `DestroyRef` 和 `takeUntilDestroyed()` 管理订阅
   ```typescript
   export class MyComponent {
     private destroyRef = inject(DestroyRef);
     
     ngOnInit() {
       someObservable.pipe(
         takeUntilDestroyed(this.destroyRef)
       ).subscribe(/* ... */);
     }
   }
   ```

### 状态管理与性能优化

1. **不可变更新**：
   - 处理集合数据时创建不可变更新，确保正确触发变更检测
   ```typescript
   protected items = signal<string[]>([]);
   
   addItem(item: string) {
     // 创建新数组而非修改原数组
     this.items.update(current => [...current, item]);
   }
   ```

2. **性能优化**：
   - 使用 `untracked()` 避免不必要的信号依赖
   - 使用 `ChangeDetectionStrategy.OnPush` 提高性能

### 路由与导航

1. **路由API**：
   - 使用现代路由API，如`Router.navigateByUrl()`
   - 使用 `inject(ActivatedRoute)` 获取路由信息

## 组件组织结构

### 组件分类与目录结构

1. **UI组件**：
   - 存放位置：`src/app/components` 目录
   - 用途：按钮、输入框、卡片等基础UI组件
   - 特点：高度可重用，不包含业务逻辑

2. **布局组件**：
   - 存放位置：`src/app/layouts` 目录
   - 用途：页面布局、头部、侧边栏等结构性组件
   - 特点：定义页面整体结构，可在多个页面中复用

3. **业务组件**：
   - 存放位置：各模块的 `components` 子目录
   - 示例：`src/app/pages/dashboard/components`
   - 特点：包含特定业务逻辑，通常只在特定模块中使用

### 命名规范

1. **文件命名**：
   - 组件源文件：`component-name.component.ts`
   - 模板文件：`component-name.component.html`
   - 样式文件：`component-name.component.css` (注意：应保留空文件，样式通过Tailwind实现)

2. **类命名**：
   - 使用 PascalCase 格式
   - 示例：`ComponentNameComponent`

3. **选择器命名**：
   - 使用 'app' 前缀和 kebab-case 格式
   - 示例：`app-component-name`

4. **Tailwind类命名**：
   - 优先使用Tailwind提供的类名
   - 类名按逻辑分组：布局 → 间距 → 尺寸 → 颜色 → 其他
   - 示例：`flex justify-between items-center p-4 text-lg text-slate-700`

### 组件设计原则

1. **单一责任**：每个组件应只负责单一功能或视图

2. **组件封装**：
   - 使用输入和输出属性进行组件定制
   - 避免组件间直接访问彼此的内部状态

3. **组件文档**：
   - 为每个组件提供详细说明其用途和使用方法的文档注释
   - 包含输入输出属性的说明

4. **组件导出**：
   - 确保组件正确导出和导入
   - 为相关组件创建barrel导出文件（index.ts）

5. **Figma设计集成**：
   - 从 Figma 设计中识别重复出现的 UI 模式和组件
   - 将常见UI模式提取为可复用组件
   - 确保组件结构与Figma设计系统中的组件层次一致

## Tailwind CSS 与样式实现

### 组件生成基本规则

1. **使用 Angular CLI**：
   - 使用 Angular CLI 生成新组件
   ```bash
   ng generate component path/to/component-name
   ```
   - 生成组件时保留默认文件结构

2. **避免使用 CSS 文件**：
   - 组件生成后，保留 `.component.css` 文件为空
   - 不要在 `.component.css` 文件中添加任何样式代码
   - 所有样式必须使用 Tailwind CSS 类名在 HTML 模板中实现

3. **组件文件组织**：
   - 保持文件结构符合 Angular 标准
   - 确保组件遵循命名规范
   - 将组件放置在正确的目录结构中

### 组件 HTML 模板规范

1. **仅使用 Tailwind 类名**：
   - HTML 元素样式必须仅通过 Tailwind 类名实现
   - 避免使用内联样式 `[style]` 或 `[ngStyle]`
   - 避免通过 `:host` 选择器添加样式

2. **HTML 结构**：
   - 保持 HTML 结构简洁清晰
   - 使用语义化标签
   - 确保可访问性

3. **类名组织**：
   ```html
   <!-- 推荐的类名顺序 -->
   <div class="
     flex justify-between items-center  <!-- 布局 -->
     w-full h-12                       <!-- 尺寸 -->
     p-4 mx-2 my-3                     <!-- 间距 -->
     bg-white                          <!-- 背景 -->
     border border-gray-200 rounded-lg <!-- 边框 -->
     text-gray-800 font-medium         <!-- 文字 -->
     shadow-sm                         <!-- 其他 -->
     hover:bg-gray-50                  <!-- 状态 -->
   ">
     内容
   </div>
   ```

### 组件 TypeScript 规范

1. **组件装饰器**：
   ```typescript
   @Component({
     selector: 'app-component-name',
     standalone: true,
     imports: [CommonModule],
     templateUrl: './component-name.component.html',
     styleUrls: ['./component-name.component.css'], // 保留空文件引用
     changeDetection: ChangeDetectionStrategy.OnPush // 推荐使用 OnPush
   })
   ```

2. **避免样式相关代码**：
   - 不要使用 `ViewEncapsulation.None`
   - 不要在组件类中使用动态样式生成
   - 不要使用 `Renderer2` 添加样式类

3. **组件变体和状态**：
   - 使用 Signal 输入创建组件变体：
   
   ```typescript
   // button.component.ts
   import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
   import { CommonModule } from '@angular/common';
   
   @Component({
     selector: 'app-button',
     standalone: true,
     imports: [CommonModule],
     templateUrl: './button.component.html',
     styleUrls: ['./button.component.css'], // 保留空文件
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class ButtonComponent {
     // 使用 Signal API 输入
     protected variant = input<'primary' | 'secondary' | 'danger'>('primary');
     protected disabled = input<boolean>(false);
     
     // 计算 Tailwind 类
     protected buttonClasses = computed(() => {
       const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
       
       const variantClasses = {
         'primary': 'bg-blue-500 hover:bg-blue-600 text-white',
         'secondary': 'bg-gray-200 hover:bg-gray-300 text-gray-800',
         'danger': 'bg-red-500 hover:bg-red-600 text-white'
       }[this.variant()];
       
       return `${baseClasses} ${variantClasses}`;
     });
   }
   ```

   ```html
   <!-- button.component.html -->
   <button 
     [class]="buttonClasses()"
     [disabled]="disabled()"
   >
     <ng-content></ng-content>
   </button>
   ```

4. **从 Figma 设计到组件实现**：

   **Figma 设计（卡片组件）**：
   ```
   属性               Figma值
   ------------------  ----------------
   宽度:               320px
   内边距:             24px
   背景色:             白色
   边框:               1px solid #E5E7EB
   圆角:               8px
   阴影:               0 1px 3px rgba(0,0,0,0.1)
   ```

   **Angular 组件实现**：

   `card.component.html`:
   ```html
   <div class="w-80 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
     <ng-content></ng-content>
   </div>
   ```

   `card.component.ts`:
   ```typescript
   import { Component, ChangeDetectionStrategy, input } from '@angular/core';
   import { CommonModule } from '@angular/common';

   @Component({
     selector: 'app-card',
     standalone: true,
     imports: [CommonModule],
     templateUrl: './card.component.html',
     styleUrls: ['./card.component.css'], // 保留但不使用
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class CardComponent {
     // 使用 Signal API 的输入
     protected elevation = input<'low' | 'medium' | 'high'>('low');
     
     // 可以添加计算属性根据 elevation 输入生成不同的阴影类
   }
   ```

   `card.component.css`: **（保持为空）**

## 依赖管理

### 添加新依赖指南

1. **用户提示**：
   - 当功能实现确实需要新依赖时，必须明确提示用户安装
   - 提供完整的安装命令，包括确切的版本号
   - 示例：
     ```
     需要安装 chart.js 库来实现图表功能：
     
     npm install chart.js@4.3.0
     ```
     或
     ```
     pnpm add chart.js@4.3.0
     ```

2. **版本兼容性**：
   - 建议新依赖时，务必提供与现有依赖兼容的特定版本号
   - 考虑项目的 Angular 版本和其他核心依赖的兼容性
   - 避免安装可能导致版本冲突的依赖

3. **依赖评估**：
   - 评估新依赖的包大小、性能影响和安全记录
   - 考虑依赖的维护状态和社区活跃度
   - 优先选择稳定、成熟且维护良好的库

### 依赖使用最佳实践

1. **最小依赖原则**：
   - 只添加必要的依赖，避免项目臃肿和潜在的安全风险
   - 考虑是否可以使用原生功能或简单实现替代外部依赖

2. **依赖文档**：
   - 在引入新依赖时，在代码中添加适当的注释，说明依赖的用途和关键功能
   - 对复杂或不常见的依赖用法提供示例代码

3. **依赖导入优化**：
   - 只导入需要的特定模块，而非整个库
   - 例如：`import { Component } from '@angular/core'` 而非 `import * from '@angular/core'`
