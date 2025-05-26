---
applyTo: '**'
---
# 项目架构与组织

本文档定义了 Angular 项目的整体架构和组织结构，确保代码的可维护性和可扩展性。

## 目录结构规范

### 核心目录结构

```
src/
├── app/
│   ├── components/          # 可复用 UI 组件
│   │   ├── index.ts        # Barrel 导出文件
│   │   ├── button/
│   │   ├── input/
│   │   ├── card/
│   │   └── ...
│   ├── layouts/            # 布局组件
│   │   ├── index.ts
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── layout/
│   ├── pages/              # 页面组件
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── ...
│   ├── services/           # 业务服务
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   └── app.component.ts    # 根组件
└── assets/                 # 静态资源
```

### 组件分类和存放

#### 1. UI 组件 (`src/app/components/`)
- **用途**：通用、可复用的界面元素
- **特点**：
  - 高度可重用，不包含业务逻辑
  - 基于 Figma 设计系统构建
  - 使用 Signal API 进行状态管理
- **示例**：按钮、输入框、卡片、模态框、表格等

```typescript
// src/app/components/button/button.component.ts
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'] // 保持空文件
})
export class ButtonComponent {
  protected variant = input<'primary' | 'secondary' | 'danger'>('primary');
  protected disabled = input<boolean>(false);
  protected clicked = output<void>();
}
```

#### 2. 布局组件 (`src/app/layouts/`)
- **用途**：页面结构和布局相关组件
- **特点**：
  - 定义页面整体结构
  - 可在多个页面中复用
  - 处理全局导航和页面框架
- **示例**：页头、侧边栏、页脚、主布局容器

#### 3. 页面组件 (`src/app/pages/`)
- **用途**：具体的页面或路由组件
- **特点**：
  - 包含特定业务逻辑
  - 组合多个 UI 组件
  - 处理页面级别的数据管理

## 文件命名规范

### 组件文件命名

```
component-name/
├── component-name.component.ts      # 组件类
├── component-name.component.html    # 模板文件
├── component-name.component.css     # 样式文件（保持空白）
└── component-name.component.spec.ts # 测试文件
```

### 命名约定

1. **文件名**：使用 kebab-case
   - `user-profile.component.ts`
   - `data-table.component.ts`

2. **类名**：使用 PascalCase
   - `UserProfileComponent`
   - `DataTableComponent`

3. **选择器**：使用 'app' 前缀 + kebab-case
   - `app-user-profile`
   - `app-data-table`

4. **变量和方法**：使用 camelCase
   - `userName`
   - `handleClick()`

## 导出规范

### Barrel 导出文件

每个组件目录应包含 `index.ts` 文件，用于统一导出：

```typescript
// src/app/components/index.ts
export * from './button/button.component';
export * from './input/input.component';
export * from './card/card.component';
export * from './alert/alert.component';
export * from './badge/badge.component';
export * from './page-container/page-container.component';
```

### 组件导入

使用 barrel 导出进行导入：

```typescript
// 推荐做法
import { ButtonComponent, InputComponent, CardComponent } from '../components';

// 避免的做法
import { ButtonComponent } from '../components/button/button.component';
import { InputComponent } from '../components/input/input.component';
import { CardComponent } from '../components/card/card.component';
```

## 模块组织原则

### 1. 单一职责原则
- 每个组件只负责一个特定功能
- 避免创建过于复杂的组件

### 2. 依赖关系管理
- UI 组件不应依赖业务逻辑
- 页面组件可以依赖 UI 组件和服务
- 布局组件应保持通用性

### 3. 可重用性设计
- UI 组件应该高度可配置
- 使用 Signal 输入进行组件定制
- 避免硬编码业务逻辑

## 类型定义组织

### 全局类型 (`src/app/types/`)

```typescript
// src/app/types/ui.types.ts
export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type InputSize = 'small' | 'medium' | 'large';
export type AlertType = 'info' | 'success' | 'warning' | 'error';

// src/app/types/business.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}
```

### 组件内部类型

```typescript
// 在组件文件内定义仅该组件使用的类型
export type TableColumn = {
  key: string;
  title: string;
  sortable?: boolean;
};

@Component({...})
export class DataTableComponent {
  protected columns = input<TableColumn[]>([]);
}
```

## 服务组织

### 服务分类

```
src/app/services/
├── api/              # API 相关服务
│   ├── user.service.ts
│   └── auth.service.ts
├── state/            # 状态管理服务
│   └── app-state.service.ts
└── utils/            # 工具服务
    └── storage.service.ts
```

### 服务注入

使用函数式依赖注入：

```typescript
@Component({...})
export class MyComponent {
  private userService = inject(UserService);
  private router = inject(Router);
}
```

## 资源文件组织

### 静态资源结构

```
src/assets/
├── images/           # 图片文件
├── icons/            # 图标文件
├── fonts/            # 字体文件
└── data/             # 静态数据文件
```

### 资源引用

```typescript
// 在组件中引用资源
@Component({
  template: `<img src="assets/images/logo.png" alt="Logo">`
})
export class HeaderComponent {}
```

## 最佳实践

1. **保持目录结构扁平**：避免过深的嵌套目录
2. **使用一致的命名**：遵循既定的命名约定
3. **及时重构**：当组件变得复杂时，考虑拆分
4. **文档注释**：为每个组件和服务添加清晰的文档注释
5. **类型安全**：充分利用 TypeScript 的类型系统
