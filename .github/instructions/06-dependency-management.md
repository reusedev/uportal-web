# 06 - Dependency Management
*依赖管理策略与最佳实践*

## 概述

本文档定义了项目依赖管理的完整策略，包括依赖评估、版本控制、安装指导和维护实践。

## 依赖管理原则

### 1. 最小依赖原则
- **谨慎添加新依赖**：每个新依赖都应经过严格评估
- **优先使用内置功能**：能用原生 JavaScript/TypeScript 实现的功能避免引入外部库
- **避免功能重复**：检查现有依赖是否已提供所需功能

### 2. 依赖评估标准
- **包大小**：评估对最终构建包体积的影响
- **维护状态**：选择活跃维护、社区支持良好的库
- **安全记录**：检查已知安全漏洞和更新频率
- **兼容性**：确保与当前 Angular 版本和其他依赖兼容

### 3. 版本管理策略
- **精确版本号**：新依赖必须指定确切版本号
- **兼容性测试**：安装前验证与现有依赖的兼容性
- **定期更新**：建立依赖更新的定期检查机制

## 当前项目依赖清单

### 核心框架依赖
```json
{
  "@angular/core": "^19.2.0",
  "@angular/common": "^19.2.0",
  "@angular/router": "^19.2.0",
  "@angular/platform-browser": "^19.2.0",
  "@angular/forms": "^19.2.0"
}
```

### 样式与UI依赖
```json
{
  "tailwindcss": "3",
  "tailwindcss-animate": "^1.0.7",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.3"
}
```

### 开发工具依赖
```json
{
  "typescript": "~5.7.2",
  "eslint": "^9.26.0",
  "@angular/cli": "^19.2.12",
  "@angular/compiler-cli": "^19.2.0"
}
```

## 新依赖添加流程

### 1. 需求评估
在添加新依赖前，完成以下评估：

```typescript
// 评估清单
interface DependencyEvaluation {
  purpose: string;           // 依赖用途
  alternatives: string[];    // 可替代方案
  sizeImpact: string;       // 包大小影响
  maintenanceStatus: string; // 维护状态
  securityRecord: string;    // 安全记录
  compatibility: boolean;    // 兼容性确认
}
```

### 2. 用户提示格式
当确需新依赖时，使用以下格式提示用户：

```markdown
## 需要安装新依赖

**依赖名称**: chart.js
**用途**: 实现数据可视化图表功能
**版本**: 4.3.0 (与 Angular 19 兼容)
**包大小**: ~65KB (gzipped)

**安装命令**:
```bash
pnpm add chart.js@4.3.0
```

**说明**: 该版本经过兼容性测试，与当前项目依赖无冲突。
```

### 3. 版本兼容性矩阵

| Angular版本 | Node.js | TypeScript | 推荐包管理器 |
|------------|---------|------------|-------------|
| 19.x       | 18.19+  | 5.7+       | pnpm 8.x    |
| 18.x       | 18.19+  | 5.4+       | pnpm 8.x    |

### 4. 常见依赖兼容版本

```json
{
  "@angular/core": "^19.2.0",
  "rxjs": "~7.8.0",
  "zone.js": "~0.15.0",
  "tslib": "^2.3.0",
  "remixicon": "^4.6.0",
  "chart.js": "4.3.0",
  "date-fns": "2.30.0",
  "lodash-es": "4.17.21"
}
```

## 依赖使用最佳实践

### 1. 导入优化
```typescript
// ✅ 推荐：按需导入
import { Component, signal } from '@angular/core';
import { format } from 'date-fns';
import { debounce } from 'lodash-es';

// ❌ 避免：全量导入
import * as _ from 'lodash';
import * as dateFns from 'date-fns';
```

### 2. 类型定义
```typescript
// ✅ 使用 TypeScript 类型
import { Chart, ChartOptions, ChartData } from 'chart.js';

// 为第三方库定义接口
interface ChartConfig {
  type: 'line' | 'bar' | 'pie';
  data: ChartData;
  options?: ChartOptions;
}
```

### 3. 错误处理
```typescript
// ✅ 处理依赖加载错误
async loadChartLibrary() {
  try {
    const { Chart } = await import('chart.js');
    return Chart;
  } catch (error) {
    console.error('Failed to load Chart.js:', error);
    // 提供降级方案
    return null;
  }
}
```

## 依赖维护策略

### 1. 定期审计
- **月度检查**：检查依赖安全漏洞
- **季度更新**：评估依赖版本更新
- **年度清理**：移除不再使用的依赖

### 2. 安全检查
```bash
# 安全审计命令
pnpm audit

# 修复已知漏洞
pnpm audit --fix
```

### 3. 依赖分析
```bash
# 分析包大小
pnpm why <package-name>

# 查看依赖树
pnpm ls --depth=2
```

## 特殊依赖处理

### 1. Angular 特定依赖
```typescript
// Angular 19+ 推荐依赖模式
import { 
  Component, 
  input, 
  output, 
  signal, 
  computed 
} from '@angular/core';
```

### 2. Tailwind CSS 扩展
```json
// tailwind.config.ts 依赖管理
{
  "devDependencies": {
    "tailwindcss": "3",
    "tailwindcss-animate": "^1.0.7",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3"
  }
}
```

### 3. 开发时依赖
```json
{
  "devDependencies": {
    "@types/jasmine": "~5.1.0",
    "typescript-eslint": "8.32.0",
    "angular-eslint": "19.4.0",
    "karma": "~6.4.0"
  }
}
```

## 依赖冲突解决

### 1. 版本冲突
```bash
# 检查冲突
pnpm ls --depth=0

# 解决冲突
pnpm update <package-name>
```

### 2. 类型冲突
```typescript
// 使用命名空间避免类型冲突
import * as ChartJS from 'chart.js';
import * as D3Chart from 'd3';

interface AppChart {
  chartJs?: ChartJS.Chart;
  d3Chart?: D3Chart.Selection<any, any, any, any>;
}
```

### 3. 构建问题
```typescript
// angular.json 配置优化
{
  "build": {
    "options": {
      "optimization": true,
      "buildOptimizer": true,
      "vendorChunk": true,
      "extractLicenses": false
    }
  }
}
```

## 禁用依赖清单

以下依赖不应在项目中使用：

### 1. 过时的 Angular 依赖
- `@angular/http` (使用 `@angular/common/http`)
- `angular2-*` 系列包
- 不兼容 Angular 19+ 的包

### 2. 功能重复的工具库
- `moment.js` (使用 `date-fns`)
- `underscore.js` (使用 `lodash-es` 或原生方法)
- `jquery` (使用原生 DOM API)

### 3. 安全风险依赖
- 已知安全漏洞且无修复的包
- 长期无维护的包
- 不受信任来源的包

## 相关文档

- [项目架构](./01-project-architecture.md) - 了解项目结构对依赖选择的影响
- [代码质量](./07-code-quality.md) - 依赖质量评估标准
- [Signal API](./02-signal-api.md) - Angular 现代 API 使用指导

---

*最后更新: 2025-05-23*
