---
applyTo: '**'
---
# Angular 项目开发规范

本项目遵循现代 Angular 开发最佳实践，使用 Signal API、Tailwind CSS 和 Figma 设计系统。所有开发规范按功能模块组织，确保高内聚低耦合。

## 核心规范文档

### 1. [项目架构与组织](./01-project-architecture.md)
- 项目目录结构规范
- 模块划分和组织原则
- 文件命名和导出规范

### 2. [Angular Signal API 规范](./02-signal-api.md)
- Signal API 使用指南
- 组件状态管理
- 依赖注入和资源管理

### 3. [组件开发规范](./03-component-development.md)
- 组件分类和设计原则
- 组件生命周期管理
- 组件通信模式

### 4. [Tailwind CSS 样式规范](./04-tailwind-styling.md)
- Tailwind 类名组织和使用
- 响应式设计实现
- 样式文件管理

### 5. [Figma 设计集成](./05-figma-integration.md)
- Figma 设计到组件的转换流程
- 设计令牌和样式映射
- 组件变体实现

### 6. [依赖管理规范](./06-dependency-management.md)
- 依赖添加和版本管理
- 包导入优化
- 第三方库集成

### 7. [代码质量保证](./07-code-quality.md)
- TypeScript 类型定义
- ESLint 规则遵循
- 测试和文档规范

## 快速开始

1. **组件开发**：参考 [组件开发规范](./03-component-development.md) 和 [Signal API 规范](./02-signal-api.md)
2. **样式实现**：参考 [Tailwind CSS 样式规范](./04-tailwind-styling.md) 和 [Figma 设计集成](./05-figma-integration.md)
3. **项目结构**：参考 [项目架构与组织](./01-project-architecture.md)

## 重要原则

- ✅ **使用 Signal API**：严格使用 `input()`, `output()`, `model()` 替代传统装饰器
- ✅ **Tailwind 优先**：所有样式使用 Tailwind CSS 类名实现
- ✅ **组件化设计**：基于 Figma 设计系统构建可复用组件
- ✅ **最小依赖**：优先使用项目现有依赖，避免引入不必要的包
- ❌ **避免传统 CSS**：不在 `.css` 文件中编写自定义样式
- ❌ **避免旧式装饰器**：不使用 `@Input()`, `@Output()` 装饰器
