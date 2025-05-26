---
applyTo: '**'
---
# Tailwind CSS 样式规范

本项目严格使用 Tailwind CSS 实现所有样式。本文档提供了完整的 Tailwind 使用规范和设计系统集成指南。

## 核心原则

### 1. 纯 Tailwind 实现

**✅ 正确做法：**
```html
<!-- 使用 Tailwind 实用工具类 -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  按钮
</button>

<div class="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg">
  <h2 class="text-xl font-semibold text-gray-900">标题</h2>
  <span class="text-sm text-gray-500">副文本</span>
</div>
```

**❌ 错误做法：**
```html
<!-- 不要使用自定义 CSS 类 -->
<button class="custom-button">按钮</button>

<div class="card">
  <h2 class="card-title">标题</h2>
</div>
```

### 2. 空样式文件策略

所有 `.css` 文件必须保持为空：

```css
/* button.component.css - 保持为空 */

/* ❌ 不要添加自定义样式 */
/* .custom-class {
  background: blue;
} */
```

## 设计系统颜色

### 1. 主色调 (Primary)

使用项目配置的主色调变量：

```html
<!-- 主色调的不同深度 -->
<div class="bg-primary-50">极浅主色</div>
<div class="bg-primary-100">浅主色</div>
<div class="bg-primary-500">标准主色</div>
<div class="bg-primary-600">深主色</div>
<div class="bg-primary-900">极深主色</div>

<!-- 主色调透明度 -->
<div class="bg-primary-alpha-10">10% 透明度</div>
<div class="bg-primary-alpha-16">16% 透明度</div>
<div class="bg-primary-alpha-24">24% 透明度</div>
```

### 2. 语义色彩 (Semantic Colors)

```html
<!-- 成功状态 -->
<div class="bg-success-50 border border-success-200 text-success-800">
  <i class="ri-check-circle-line text-success-600"></i>
  操作成功
</div>

<!-- 警告状态 -->
<div class="bg-warning-50 border border-warning-200 text-warning-800">
  <i class="ri-alert-line text-warning-600"></i>
  请注意
</div>

<!-- 错误状态 -->
<div class="bg-error-50 border border-error-200 text-error-800">
  <i class="ri-close-circle-line text-error-600"></i>
  操作失败
</div>

<!-- 信息状态 -->
<div class="bg-information-50 border border-information-200 text-information-800">
  <i class="ri-information-line text-information-600"></i>
  提示信息
</div>
```

### 3. 中性色彩 (Neutral Colors)

```html
<!-- 背景色 -->
<div class="bg-bg-white-0">白色背景</div>
<div class="bg-bg-weak-50">浅色背景</div>
<div class="bg-bg-soft-200">柔和背景</div>
<div class="bg-bg-surface-800">表面背景</div>
<div class="bg-bg-strong-950">强色背景</div>

<!-- 文字色 -->
<p class="text-text-strong-950">强调文字</p>
<p class="text-text-sub-600">次要文字</p>
<p class="text-text-soft-400">柔和文字</p>
<p class="text-text-disabled-300">禁用文字</p>

<!-- 边框色 -->
<div class="border border-stroke-soft-200">柔和边框</div>
<div class="border border-stroke-sub-300">次要边框</div>
<div class="border border-stroke-strong-950">强调边框</div>
```

## 组件样式模式

### 1. 按钮组件

```html
<!-- 主要按钮 -->
<button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
  主要按钮
</button>

<!-- 次要按钮 -->
<button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
  次要按钮
</button>

<!-- 轮廓按钮 -->
<button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
  轮廓按钮
</button>

<!-- 危险按钮 -->
<button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-error-600 text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500">
  危险按钮
</button>
```

### 2. 输入框组件

```html
<!-- 基本输入框 -->
<div class="w-full">
  <label class="block text-sm font-medium text-gray-700 mb-1">
    用户名
    <span class="text-red-500">*</span>
  </label>
  <input 
    type="text" 
    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
    placeholder="请输入用户名"
  />
</div>

<!-- 错误状态输入框 -->
<div class="w-full">
  <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
  <input 
    type="email" 
    class="block w-full px-3 py-2 border border-red-300 text-red-900 placeholder-red-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
    placeholder="请输入邮箱"
  />
  <p class="mt-1 text-sm text-red-600">请输入有效的邮箱地址</p>
</div>

<!-- 带图标的输入框 -->
<div class="w-full">
  <label class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <i class="ri-search-line text-gray-400"></i>
    </div>
    <input 
      type="text" 
      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      placeholder="搜索..."
    />
  </div>
</div>
```

### 3. 卡片组件

```html
<!-- 基本卡片 -->
<div class="bg-white rounded-lg border border-gray-200 shadow-sm">
  <div class="p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-2">卡片标题</h3>
    <p class="text-sm text-gray-500 mb-4">卡片描述文字</p>
    <div class="space-y-4">
      <!-- 卡片内容 -->
    </div>
  </div>
</div>

<!-- 带头部的卡片 -->
<div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
  <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
    <h3 class="text-lg font-medium text-gray-900">卡片标题</h3>
    <p class="text-sm text-gray-500">卡片副标题</p>
  </div>
  <div class="p-6">
    <!-- 卡片内容 -->
  </div>
</div>

<!-- 交互式卡片 -->
<div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
  <div class="p-6">
    <!-- 卡片内容 -->
  </div>
</div>
```

### 4. 警告框组件

```html
<!-- 信息警告框 -->
<div class="rounded-md bg-blue-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <i class="ri-information-line text-blue-400"></i>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-blue-800">信息提示</h3>
      <div class="mt-2 text-sm text-blue-700">
        <p>这是一条信息提示消息。</p>
      </div>
    </div>
  </div>
</div>

<!-- 成功警告框 -->
<div class="rounded-md bg-green-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <i class="ri-checkbox-circle-line text-green-400"></i>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-green-800">操作成功</h3>
      <div class="mt-2 text-sm text-green-700">
        <p>您的操作已成功完成。</p>
      </div>
    </div>
  </div>
</div>

<!-- 可关闭的警告框 -->
<div class="rounded-md bg-yellow-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <i class="ri-alert-line text-yellow-400"></i>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-yellow-800">警告</h3>
      <div class="mt-2 text-sm text-yellow-700">
        <p>请注意相关风险。</p>
      </div>
    </div>
    <div class="ml-auto pl-3">
      <div class="-mx-1.5 -my-1.5">
        <button type="button" class="inline-flex rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600">
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>
  </div>
</div>
```

## 响应式设计

### 1. 断点使用

```html
<!-- 响应式网格 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <!-- 网格项目 -->
</div>

<!-- 响应式隐藏/显示 -->
<div class="block md:hidden">移动端显示</div>
<div class="hidden md:block">桌面端显示</div>

<!-- 响应式间距 -->
<div class="p-4 md:p-6 lg:p-8">
  <!-- 内容 -->
</div>

<!-- 响应式文字大小 -->
<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
  响应式标题
</h1>
```

### 2. 移动优先设计

```html
<!-- 移动优先的布局 -->
<div class="flex flex-col md:flex-row">
  <!-- 在移动端为列布局，桌面端为行布局 -->
</div>

<!-- 移动优先的导航 -->
<nav class="fixed bottom-0 left-0 right-0 bg-white border-t md:relative md:border-t-0">
  <!-- 移动端底部导航，桌面端顶部导航 -->
</nav>
```

## 动画与过渡

### 1. 内置过渡

```html
<!-- 基本过渡 -->
<button class="transition-colors duration-200 hover:bg-blue-600">
  悬停变色
</button>

<!-- 组合过渡 -->
<div class="transition-all duration-300 hover:scale-105 hover:shadow-lg">
  悬停缩放和阴影
</div>

<!-- 变换过渡 -->
<div class="transform transition-transform duration-300 hover:rotate-6">
  悬停旋转
</div>
```

### 2. 加载动画

```html
<!-- 旋转加载器 -->
<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>

<!-- 脉冲加载器 -->
<div class="animate-pulse bg-gray-300 h-4 rounded w-3/4"></div>

<!-- 弹跳加载器 -->
<div class="flex space-x-1">
  <div class="animate-bounce bg-primary-600 h-2 w-2 rounded-full"></div>
  <div class="animate-bounce bg-primary-600 h-2 w-2 rounded-full animation-delay-100"></div>
  <div class="animate-bounce bg-primary-600 h-2 w-2 rounded-full animation-delay-200"></div>
</div>
```

## 排版系统

### 1. 字体大小

```html
<!-- 标题系列 -->
<h1 class="text-title-h1">主标题 H1</h1>
<h2 class="text-title-h2">次标题 H2</h2>
<h3 class="text-title-h3">三级标题 H3</h3>
<h4 class="text-title-h4">四级标题 H4</h4>
<h5 class="text-title-h5">五级标题 H5</h5>
<h6 class="text-title-h6">六级标题 H6</h6>

<!-- 标签系列 -->
<span class="text-label-xl">特大标签</span>
<span class="text-label-lg">大标签</span>
<span class="text-label-md">中标签</span>
<span class="text-label-sm">小标签</span>
<span class="text-label-xs">特小标签</span>

<!-- 正文系列 -->
<p class="text-body-xl">特大正文</p>
<p class="text-body-lg">大正文</p>
<p class="text-body-md">中正文</p>
<p class="text-body-sm">小正文</p>
<p class="text-body-xs">特小正文</p>
```

### 2. 字重和行高

```html
<!-- 字重 -->
<p class="font-thin">Thin (100)</p>
<p class="font-light">Light (300)</p>
<p class="font-normal">Normal (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>

<!-- 行高 -->
<p class="leading-tight">紧凑行高</p>
<p class="leading-normal">正常行高</p>
<p class="leading-relaxed">放松行高</p>
<p class="leading-loose">宽松行高</p>
```

## 阴影系统

### 1. 自定义阴影

```html
<!-- 项目自定义阴影 -->
<div class="shadow-custom-xs">超小阴影</div>
<div class="shadow-custom-sm">小阴影</div>
<div class="shadow-custom-md">中等阴影</div>
<div class="shadow-custom-lg">大阴影</div>
<div class="shadow-custom-xl">超大阴影</div>

<!-- 组件状态阴影 -->
<div class="shadow-sm hover:shadow-md transition-shadow">
  悬停增强阴影
</div>
```

### 2. 阴影应用场景

```html
<!-- 卡片阴影 -->
<div class="bg-white rounded-lg shadow-custom-sm">卡片</div>

<!-- 按钮阴影 -->
<button class="bg-primary-600 text-white px-4 py-2 rounded shadow-custom-xs hover:shadow-custom-sm transition-shadow">
  按钮
</button>

<!-- 浮动元素阴影 -->
<div class="fixed top-4 right-4 bg-white rounded-lg shadow-custom-lg">
  浮动通知
</div>
```

## 图标系统

### 1. Remix Icon 集成

```html
<!-- 基本图标 -->
<i class="ri-home-line"></i>
<i class="ri-user-line"></i>
<i class="ri-settings-line"></i>
<i class="ri-search-line"></i>

<!-- 带色彩的图标 -->
<i class="ri-check-circle-line text-success-600"></i>
<i class="ri-error-warning-line text-warning-600"></i>
<i class="ri-close-circle-line text-error-600"></i>
<i class="ri-information-line text-information-600"></i>

<!-- 不同大小的图标 -->
<i class="ri-star-line text-xs"></i>
<i class="ri-star-line text-sm"></i>
<i class="ri-star-line text-base"></i>
<i class="ri-star-line text-lg"></i>
<i class="ri-star-line text-xl"></i>
<i class="ri-star-line text-2xl"></i>
```

### 2. 图标与文字组合

```html
<!-- 左侧图标 -->
<button class="inline-flex items-center space-x-2">
  <i class="ri-download-line"></i>
  <span>下载</span>
</button>

<!-- 右侧图标 -->
<button class="inline-flex items-center space-x-2">
  <span>了解更多</span>
  <i class="ri-arrow-right-line"></i>
</button>

<!-- 图标按钮 -->
<button class="inline-flex items-center justify-center w-8 h-8 rounded">
  <i class="ri-close-line"></i>
</button>
```

## 最佳实践

### 1. 类名组织

```typescript
// 在 TypeScript 中组织类名
protected containerClasses = computed(() => {
  const baseClasses = 'flex items-center justify-between p-4 rounded-lg';
  const variantClasses = this.getVariantClasses();
  const sizeClasses = this.getSizeClasses();
  const stateClasses = this.getStateClasses();
  
  return [
    baseClasses,
    variantClasses,
    sizeClasses,
    stateClasses,
    this.customClass()
  ].filter(Boolean).join(' ');
});

private getVariantClasses(): string {
  const variants = {
    'primary': 'bg-primary-600 text-white',
    'secondary': 'bg-gray-200 text-gray-900',
    'danger': 'bg-error-600 text-white'
  };
  
  return variants[this.variant()];
}
```

### 2. 条件样式

```html
<!-- 使用 Angular 条件类名 -->
<div [class]="containerClasses()">
  <!-- 内容 -->
</div>

<!-- 使用 ngClass 指令 -->
<div [ngClass]="{
  'bg-green-50': status === 'success',
  'bg-red-50': status === 'error',
  'bg-blue-50': status === 'info'
}">
  <!-- 内容 -->
</div>
```

### 3. 重复样式提取

当多个组件使用相同的样式模式时，在计算属性中定义：

```typescript
// 创建可复用的样式函数
function getButtonBaseClasses(): string {
  return 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
}

function getInputBaseClasses(): string {
  return 'block w-full border rounded-md shadow-sm focus:outline-none focus:ring-1';
}
```

---

**相关文档：**
- [01-项目架构规范](./01-project-architecture.md)
- [03-组件开发规范](./03-component-development.md)
- [05-Figma 集成规范](./05-figma-integration.md)
