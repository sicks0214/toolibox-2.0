# TooliBox 工具开发与接入通用指导书

> **版本**: v1.1
> **创建日期**: 2025-12-10
> **更新日期**: 2025-12-11
> **适用范围**: TooliBox 所有工具开发（30个工具）
> **目标**: 标准化工具开发流程，实现快速开发与无缝接入

---

## 📋 目录

1. [开发策略](#开发策略)
2. [技术栈规范](#技术栈规范)
3. [开发环境搭建](#开发环境搭建)
4. [组件架构设计](#组件架构设计)
5. [工具分类与设计模式](#工具分类与设计模式)
6. [样式规范](#样式规范)
7. [开发流程](#开发流程)
8. [接入主项目流程](#接入主项目流程)
9. [测试规范](#测试规范)
10. [部署指南](#部署指南)
11. [工具开发示例](#工具开发示例)
12. [**前后端分离工具开发指南**](#前后端分离工具开发指南) ⭐ NEW
13. [**外部 AI API 接入指南**](#外部-ai-api-接入指南) ⭐ NEW

---

## 开发策略

### 核心原则

```
外部独立开发 → 完整测试 → 提取组件 → 接入主项目 → 部署上线
```

### 为什么要独立开发？

| 优势 | 说明 |
|------|------|
| ✅ **开发效率高** | Vite 热重载速度快，无需等待 Next.js 编译 |
| ✅ **环境隔离** | 不受主项目路由、中间件、国际化等复杂配置干扰 |
| ✅ **调试方便** | 独立项目结构简单，问题定位快 |
| ✅ **可复用** | 组件自包含，可迁移到其他项目 |
| ✅ **接入简单** | 复制粘贴即可，无需构建脚本 |

---

## 技术栈规范

### 必须使用的技术

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **React** | 18.3.x | UI框架 | 与主项目一致 |
| **TypeScript** | 5.x | 类型安全 | 必须使用严格模式 |
| **Tailwind CSS** | 3.4.x | 样式 | 使用主项目配置 |
| **Vite** | 最新版 | 开发工具 | 快速热重载 |

### 禁止使用的技术

❌ **以下技术会导致接入问题，严禁使用**:

| 技术 | 原因 |
|------|------|
| CSS Modules | 难以迁移到主项目 |
| styled-components / emotion | 增加依赖复杂度 |
| Redux / Zustand / MobX | 外部开发不需要全局状态 |
| React Router | 主项目使用 Next.js 路由 |
| jQuery | 不符合 React 生态 |
| Lodash | 尽量使用原生 JS |

### 可选使用的技术

✅ **以下库可以根据工具需求选择性使用**:

| 技术 | 用途 | 示例工具 |
|------|------|---------|
| **axios** | HTTP 请求 | 需要调用外部 API 的工具 |
| **date-fns** | 日期处理 | Timestamp Converter |
| **qrcode** | 二维码生成 | QR Code Generator |
| **file-saver** | 文件下载 | PDF 相关工具 |
| **react-dropzone** | 文件上传 | Image Compressor |
| **canvas** / **konva** | 图像处理 | Image Cropper |
| **monaco-editor** | 代码编辑器 | JSON Formatter, Code Beautifier |

---

## 开发环境搭建

### 步骤1: 创建独立项目

```bash
# 1. 创建 Vite + React + TypeScript 项目
# 替换 {tool-name} 为你的工具名称（小写，用连字符分隔）
npm create vite@latest {tool-name}-dev -- --template react-ts

# 示例:
# npm create vite@latest word-counter-dev -- --template react-ts
# npm create vite@latest json-formatter-dev -- --template react-ts
# npm create vite@latest image-compressor-dev -- --template react-ts

# 2. 进入项目目录
cd {tool-name}-dev

# 3. 安装依赖
npm install

# 4. 安装 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# 5. 初始化 Tailwind
npx tailwindcss init -p
```

### 步骤2: 配置 Tailwind CSS

**⚠️ 重要：必须使用主项目的 Tailwind 配置，确保样式一致！**

#### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TooliBox 主题色（必须与主项目一致）
        primary: {
          DEFAULT: '#4A9C82',  // 翠绿色
          50: '#f0f9f6',
          100: '#d9f0e8',
          200: '#b3e1d1',
          300: '#80ccb3',
          400: '#4daf91',
          500: '#4A9C82',  // 主色
          600: '#3a7d68',
          700: '#2f6453',
          800: '#285043',
          900: '#234239',
        },
        accent: {
          DEFAULT: '#FF9F66',  // 橙色强调色
          50: '#fff5ed',
          100: '#ffe8d5',
          200: '#ffd0aa',
          300: '#ffb074',
          400: '#FF9F66',  // 强调色
          500: '#fb7c3c',
          600: '#ec5f1a',
          700: '#c44710',
          800: '#9b3a10',
          900: '#7c3111',
        },
        neutral: {
          DEFAULT: '#2C3E3A',  // 深灰绿
          50: '#f7f8f8',
          100: '#e3e5e4',
          200: '#c7cbc9',
          300: '#a5aca9',
          400: '#828b88',
          500: '#677170',
          600: '#525b59',
          700: '#444c4a',
          800: '#3a413f',
          900: '#2C3E3A',  // 中性色
        },
      },
      backgroundImage: {
        // 5个分类的渐变色
        'gradient-text': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-file': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-image': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-generate': 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
        'gradient-developer': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      },
    },
  },
  plugins: [],
}
```

#### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================ */
/* 基础样式 */
/* ============================================ */
@layer base {
  body {
    @apply text-neutral-900 bg-gray-50;
  }

  h1 {
    @apply text-3xl font-bold;
  }

  h2 {
    @apply text-2xl font-semibold;
  }

  h3 {
    @apply text-xl font-semibold;
  }
}

/* ============================================ */
/* 通用组件样式 */
/* ============================================ */
@layer components {
  /* 按钮样式 */
  .btn-primary {
    @apply bg-primary hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-neutral-900 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-accent {
    @apply bg-accent hover:bg-accent-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }

  /* 输入框样式 */
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  }

  .textarea-field {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y;
  }

  /* 卡片样式 */
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .card-hover {
    @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow;
  }

  /* 徽章样式 */
  .badge {
    @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
  }

  .badge-primary {
    @apply bg-primary-100 text-primary-800;
  }

  .badge-accent {
    @apply bg-accent-100 text-accent-800;
  }

  .badge-success {
    @apply bg-green-100 text-green-800;
  }

  .badge-warning {
    @apply bg-yellow-100 text-yellow-800;
  }

  .badge-error {
    @apply bg-red-100 text-red-800;
  }
}
```

### 步骤3: 清理初始文件

```bash
# 删除不需要的文件
rm src/App.css
rm src/assets/react.svg
rm public/vite.svg
```

---

## 组件架构设计

### 核心原则

#### 1. 自包含组件（Critical！）

```typescript
// ✅ 好的设计：组件完全自包含
export default function MyTool({ labels }: MyToolProps) {
  // ✅ 所有状态在组件内
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // ✅ 所有逻辑在组件内
  const processInput = (value: string) => {
    // 处理逻辑
  };

  // ✅ 所有UI在组件内
  return <div>...</div>;
}

// ❌ 不好的设计：依赖外部
import { useGlobalState } from 'some-library';  // ❌ 依赖外部状态
import { useRouter } from 'next/navigation';     // ❌ 依赖 Next.js
import './styles.css';                           // ❌ 外部 CSS 文件
```

#### 2. Props 驱动国际化

```typescript
interface MyToolProps {
  /**
   * 国际化文本标签（可选）
   * 外部开发时使用默认英文，接入时传入翻译文本
   */
  labels?: {
    title?: string;
    subtitle?: string;
    inputPlaceholder?: string;
    outputLabel?: string;
    // ... 其他文本
  };

  /**
   * 其他可选配置
   */
  initialValue?: string;
  theme?: 'light' | 'dark';
  showAdvancedOptions?: boolean;
}

// 默认标签（英文）
const DEFAULT_LABELS = {
  title: 'My Tool',
  subtitle: 'Description of the tool',
  inputPlaceholder: 'Enter your input...',
  // ...
};

export default function MyTool({ labels, initialValue = '' }: MyToolProps) {
  // 合并默认标签和传入的标签
  const mergedLabels = useMemo(() => ({
    ...DEFAULT_LABELS,
    ...labels,
  }), [labels]);

  return (
    <div>
      <h1>{mergedLabels.title}</h1>
      <p>{mergedLabels.subtitle}</p>
      {/* 使用 mergedLabels */}
    </div>
  );
}
```

#### 3. 组件拆分原则

```typescript
// 主组件目录结构
src/components/MyTool/
├── index.tsx          # 主组件（导出）
├── InputSection.tsx   # 输入区域子组件
├── OutputSection.tsx  # 输出区域子组件
├── ControlPanel.tsx   # 控制面板子组件
├── utils.ts           # 工具函数
├── types.ts           # 类型定义
└── constants.ts       # 常量定义

// 拆分建议：
// - 单个文件不超过 300 行
// - 独立功能模块拆分为子组件
// - 可复用逻辑提取为工具函数
```

---

## 工具分类与设计模式

### 5大分类及典型设计模式

#### 1️⃣ 文本工具 (Text Tools)

**特点**: 输入文本 → 处理 → 输出结果

**典型组件结构**:
```
┌─────────────────────────────────┐
│  标题 + 副标题                   │
├─────────────────────────────────┤
│  输入框 (Textarea)               │
│  [操作按钮]                      │
├─────────────────────────────────┤
│  输出区域 / 统计结果             │
└─────────────────────────────────┘
```

**示例工具**:
- Word Counter: 文本统计
- Case Converter: 大小写转换
- Text Diff Checker: 文本对比
- Lorem Ipsum Generator: 文本生成

**通用 Props**:
```typescript
interface TextToolProps {
  labels?: {
    title: string;
    inputPlaceholder: string;
    outputLabel: string;
  };
  initialText?: string;
}
```

---

#### 2️⃣ 文件工具 (File Tools)

**特点**: 上传文件 → 处理 → 下载结果

**典型组件结构**:
```
┌─────────────────────────────────┐
│  标题 + 副标题                   │
├─────────────────────────────────┤
│  文件上传区域 (Dropzone)         │
│  [支持拖拽上传]                  │
├─────────────────────────────────┤
│  文件列表 + 进度条               │
│  [处理按钮] [下载按钮]           │
└─────────────────────────────────┘
```

**示例工具**:
- PDF Merger: 合并 PDF
- PDF to Image: PDF 转图片
- File Compressor: 文件压缩
- CSV to JSON: 格式转换

**通用 Props**:
```typescript
interface FileToolProps {
  labels?: {
    title: string;
    uploadPrompt: string;
    processButton: string;
  };
  acceptedFormats?: string[];      // ['.pdf', '.png', '.jpg']
  maxFileSize?: number;             // 单位: MB
  maxFiles?: number;                // 最大文件数
}
```

**必须使用的库**:
- `react-dropzone`: 文件拖拽上传

---

#### 3️⃣ 图像工具 (Image Tools)

**特点**: 上传图片 → 预览/编辑 → 下载结果

**典型组件结构**:
```
┌─────────────────────────────────┐
│  标题 + 副标题                   │
├─────────────────────────────────┤
│  图片上传/预览区域               │
│  [Canvas 或 Image 组件]          │
├─────────────────────────────────┤
│  参数调整面板                    │
│  滑块、按钮等控制                │
├─────────────────────────────────┤
│  [下载按钮] [重置按钮]           │
└─────────────────────────────────┘
```

**示例工具**:
- Image Compressor: 图片压缩
- Image Resizer: 尺寸调整
- Image Cropper: 裁剪工具
- QR Code Generator: 二维码生成

**通用 Props**:
```typescript
interface ImageToolProps {
  labels?: {
    title: string;
    uploadPrompt: string;
    downloadButton: string;
  };
  outputFormat?: 'png' | 'jpg' | 'webp';
  quality?: number;                 // 0-100
}
```

**可能需要的库**:
- `react-easy-crop`: 图片裁剪
- `qrcode`: 二维码生成
- `browser-image-compression`: 图片压缩

---

#### 4️⃣ 生成工具 (Generate Tools)

**特点**: 配置参数 → 生成结果 → 复制/下载

**典型组件结构**:
```
┌─────────────────────────────────┐
│  标题 + 副标题                   │
├─────────────────────────────────┤
│  参数配置面板                    │
│  复选框、滑块、下拉框等          │
├─────────────────────────────────┤
│  生成结果展示                    │
│  [复制按钮] [重新生成]           │
└─────────────────────────────────┘
```

**示例工具**:
- Password Generator: 密码生成
- UUID Generator: UUID 生成
- Gradient Generator: 渐变生成
- Fake Data Generator: 测试数据生成

**通用 Props**:
```typescript
interface GenerateToolProps {
  labels?: {
    title: string;
    generateButton: string;
    copyButton: string;
  };
  autoGenerate?: boolean;           // 自动生成
}
```

---

#### 5️⃣ 开发者工具 (Developer Tools)

**特点**: 输入代码/数据 → 格式化/转换 → 输出结果

**典型组件结构**:
```
┌─────────────────────────────────┐
│  标题 + 副标题                   │
├─────────────────────────────────┤
│  输入编辑器 (Monaco/Textarea)    │
├─────────────────────────────────┤
│  [格式化] [验证] [转换]          │
├─────────────────────────────────┤
│  输出编辑器/结果展示             │
└─────────────────────────────────┘
```

**示例工具**:
- JSON Formatter: JSON 格式化
- Base64 Encoder: Base64 编码
- Regex Tester: 正则测试
- Code Beautifier: 代码美化

**通用 Props**:
```typescript
interface DevToolProps {
  labels?: {
    title: string;
    inputLabel: string;
    outputLabel: string;
  };
  language?: string;                // 'json' | 'javascript' | 'html'
  readOnly?: boolean;               // 输出是否只读
}
```

**可能需要的库**:
- `@monaco-editor/react`: 代码编辑器（高级工具）
- `prismjs`: 代码高亮（简单展示）

---

## 样式规范

### 响应式布局断点

```typescript
// 使用 Tailwind 断点
const breakpoints = {
  sm: '640px',   // 移动端
  md: '768px',   // 平板
  lg: '1024px',  // 桌面端
  xl: '1280px',  // 大屏幕
  '2xl': '1536px'
};

// 示例：响应式网格
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 移动端1列，平板2列，桌面3列 */}
</div>
```

### 配色方案

| 元素 | 颜色 | Tailwind 类名 | 使用场景 |
|------|------|--------------|---------|
| **主背景** | 灰色50 | `bg-gray-50` | 页面背景 |
| **卡片背景** | 白色 | `bg-white` | 卡片、面板 |
| **主标题** | 中性色900 | `text-neutral-900` | H1 标题 |
| **副标题** | 灰色600 | `text-gray-600` | H2、说明文字 |
| **主色调** | 翠绿色 | `text-primary` | 重要数据、图标 |
| **强调色** | 橙色 | `text-accent` | 高亮、警告 |
| **边框** | 灰色300 | `border-gray-300` | 输入框、分割线 |
| **成功** | 绿色 | `text-green-600` | 成功提示 |
| **错误** | 红色 | `text-red-600` | 错误提示 |

### 间距规范

```typescript
// 使用 Tailwind 间距
const spacing = {
  container: 'px-4 md:px-6 lg:px-8',      // 容器内边距
  section: 'py-8 md:py-12',                // 区块上下间距
  card: 'p-6',                             // 卡片内边距
  gap: 'gap-4',                            // 网格间距
  button: 'px-4 py-2',                     // 按钮内边距
};
```

### 阴影和圆角

```typescript
// 阴影
shadow-sm      // 小阴影（输入框）
shadow-md      // 中等阴影（卡片）
shadow-lg      // 大阴影（卡片悬停）
shadow-xl      // 超大阴影（弹窗）

// 圆角
rounded-lg     // 大圆角（卡片、按钮）
rounded-md     // 中圆角（输入框）
rounded-full   // 完全圆角（徽章、头像）
```

---

## 开发流程

### 第1步: 项目规划

#### 1.1 确定工具信息

从 `toolibox/frontend/src/data/tools.json` 查找你的工具：

```json
{
  "id": "word-counter",              // ← 工具 ID
  "slug": "word-counter",            // ← URL slug
  "categoryId": "text-tools",        // ← 分类 ID
  "icon": "📊",                      // ← 图标
  "name": {
    "en": "Word Counter",
    "zh": "字数统计工具"
  },
  "description": {
    "en": "Count words, characters, and more",
    "zh": "统计字数、字符数等信息"
  },
  "comingSoon": true                 // ← 开发完成后改为 false
}
```

#### 1.2 定义功能需求

创建一个需求文档（可以是 Markdown 或文本文件）：

```markdown
# {工具名称} 功能需求

## 基础功能
- [ ] 功能点1
- [ ] 功能点2
- [ ] 功能点3

## 高级功能（可选）
- [ ] 功能点4
- [ ] 功能点5

## UI 布局
[草图或描述]

## 技术选型
- 是否需要文件上传？
- 是否需要 Canvas？
- 是否需要外部库？
```

### 第2步: 创建项目

```bash
# 使用工具的 slug 作为项目名
npm create vite@latest {slug}-dev -- --template react-ts

# 示例:
# npm create vite@latest word-counter-dev -- --template react-ts
# npm create vite@latest json-formatter-dev -- --template react-ts
```

### 第3步: 定义类型

创建 `src/types/{toolName}.ts`:

```typescript
/**
 * 工具数据接口
 */
export interface ToolData {
  // 根据工具定义数据结构
  input: string;
  output: string;
  // ...
}

/**
 * 组件 Props
 */
export interface ToolProps {
  labels?: {
    title?: string;
    subtitle?: string;
    // ... 所有需要国际化的文本
  };
  initialValue?: string;
  theme?: 'light' | 'dark';
  // ... 其他配置
}

/**
 * 默认标签（英文）
 */
export const DEFAULT_LABELS = {
  title: 'Tool Name',
  subtitle: 'Tool description',
  // ...
};
```

### 第4步: 实现核心逻辑

创建 `src/utils/{toolName}.ts`:

```typescript
/**
 * 核心处理函数
 */
export function processData(input: string): string {
  // 实现核心逻辑
  // 这部分应该是纯函数，不依赖组件状态
  return output;
}

/**
 * 验证函数
 */
export function validateInput(input: string): boolean {
  // 输入验证
  return true;
}

/**
 * 格式化函数
 */
export function formatOutput(data: any): string {
  // 输出格式化
  return formatted;
}
```

### 第5步: 创建子组件

根据工具复杂度，拆分为多个子组件：

```typescript
// src/components/InputSection.tsx
export function InputSection({ value, onChange, placeholder }: Props) {
  return (
    <div className="card">
      <textarea
        className="textarea-field"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

// src/components/OutputSection.tsx
export function OutputSection({ value, label }: Props) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <pre className="bg-gray-100 p-4 rounded-lg">{value}</pre>
    </div>
  );
}
```

### 第6步: 创建主组件

创建 `src/components/{ToolName}.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { ToolProps, DEFAULT_LABELS } from '../types/{toolName}';
import { processData } from '../utils/{toolName}';

export default function ToolName({
  labels,
  initialValue = '',
}: ToolProps) {
  // 合并标签
  const mergedLabels = useMemo(() => ({
    ...DEFAULT_LABELS,
    ...labels,
  }), [labels]);

  // 状态管理
  const [input, setInput] = useState(initialValue);

  // 实时计算/处理
  const output = useMemo(() => processData(input), [input]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          {mergedLabels.title}
        </h1>
        <p className="text-lg text-gray-600">
          {mergedLabels.subtitle}
        </p>
      </div>

      {/* 主要内容 */}
      <div className="space-y-6">
        {/* 输入区域 */}
        {/* 输出区域 */}
        {/* 控制按钮 */}
      </div>
    </div>
  );
}
```

### 第7步: 测试调试

```bash
npm run dev
```

测试清单：
- [ ] 所有功能正常工作
- [ ] 输入验证正确
- [ ] 边界情况处理（空输入、超长输入等）
- [ ] 响应式布局正常
- [ ] 无 TypeScript 错误
- [ ] 无控制台警告

---

## 接入主项目流程

### 步骤1: 复制组件

```bash
# 创建工具组件目录
toolibox/frontend/src/components/tools/{ToolName}/

# 复制所有相关文件：
{tool-name}-dev/src/components/{ToolName}.tsx
  → toolibox/frontend/src/components/tools/{ToolName}/index.tsx

{tool-name}-dev/src/components/*.tsx
  → toolibox/frontend/src/components/tools/{ToolName}/

{tool-name}-dev/src/utils/{toolName}.ts
  → toolibox/frontend/src/components/tools/{ToolName}/utils.ts

{tool-name}-dev/src/types/{toolName}.ts
  → toolibox/frontend/src/components/tools/{ToolName}/types.ts
```

### 步骤2: 创建页面

创建 `toolibox/frontend/src/app/[locale]/tools/{slug}/page.tsx`:

```typescript
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolName from '@/components/tools/{ToolName}';

// 生成页面元数据（SEO）
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({
    locale,
    namespace: 'tools.{toolSlug}'
  });

  return {
    title: `${t('title')} - TooliBox`,
    description: t('subtitle'),
  };
}

export default function ToolPage() {
  const t = useTranslations('tools.{toolSlug}');

  // 国际化文本标签
  const labels = {
    title: t('title'),
    subtitle: t('subtitle'),
    // ... 映射所有文本
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ToolName labels={labels} />
      </main>
      <Footer />
    </div>
  );
}
```

### 步骤3: 添加国际化翻译

#### `toolibox/frontend/src/locales/en.json`

```json
{
  "tools": {
    "{toolSlug}": {
      "title": "Tool Name",
      "subtitle": "Tool description",
      "inputPlaceholder": "Enter your input...",
      // ... 所有文本的英文翻译
    }
  }
}
```

#### `toolibox/frontend/src/locales/zh.json`

```json
{
  "tools": {
    "{toolSlug}": {
      "title": "工具名称",
      "subtitle": "工具描述",
      "inputPlaceholder": "请输入...",
      // ... 所有文本的中文翻译
    }
  }
}
```

### 步骤4: 更新工具配置

编辑 `toolibox/frontend/src/data/tools.json`:

```json
{
  "id": "{tool-id}",
  "slug": "{slug}",
  "categoryId": "{category-id}",
  "icon": "📊",
  "name": {
    "en": "Tool Name",
    "zh": "工具名称"
  },
  "description": {
    "en": "Tool description",
    "zh": "工具描述"
  },
  "comingSoon": false  // ← 改为 false
}
```

### 步骤5: 本地测试

```bash
cd toolibox/frontend
npm run dev
```

测试检查清单：
- [ ] 访问 `/en/tools/{slug}` 正常
- [ ] 访问 `/zh/tools/{slug}` 正常
- [ ] 语言切换正常
- [ ] 从主页点击跳转正常
- [ ] 所有功能正常
- [ ] 响应式布局正常

---

## 测试规范

### 功能测试清单

```markdown
## 基础功能测试
- [ ] 输入功能正常
- [ ] 输出显示正确
- [ ] 按钮响应正常
- [ ] 复制功能工作

## 边界测试
- [ ] 空输入处理
- [ ] 超长输入处理
- [ ] 特殊字符处理
- [ ] 无效输入提示

## 性能测试
- [ ] 大数据处理流畅
- [ ] 内存占用合理
- [ ] 无内存泄漏

## 兼容性测试
- [ ] Chrome 测试通过
- [ ] Firefox 测试通过
- [ ] Safari 测试通过
- [ ] 移动端测试通过

## 国际化测试
- [ ] 中文显示正确
- [ ] 英文显示正确
- [ ] 切换语言正常

## 响应式测试
- [ ] 手机端（< 640px）
- [ ] 平板端（640-1024px）
- [ ] 桌面端（> 1024px）
```

---

## 部署指南

### 步骤1: 提交代码

```bash
# 进入主项目目录
cd toolibox

# 添加所有新文件
git add frontend/src/components/tools/{ToolName}/
git add frontend/src/app/[locale]/tools/{slug}/
git add frontend/src/data/tools.json
git add frontend/src/locales/en.json
git add frontend/src/locales/zh.json

# 提交
git commit -m "feat: add {Tool Name} tool"

# 推送
git push origin main
```

### 步骤2: VPS 部署

```bash
# SSH 登录 VPS
ssh root@YOUR_VPS_IP

# 进入前端目录
cd /var/www/toolibox/frontend

# 拉取最新代码
git pull origin main

# 安装依赖（如果有新依赖）
npm install --production

# 重新构建
npm run build

# 重启 PM2 进程
pm2 restart toolibox-frontend

# 查看日志
pm2 logs toolibox-frontend --lines 20
```

### 步骤3: 验证部署

```bash
# 检查 PM2 状态
pm2 status

# 测试前端访问
curl -I https://yourdomain.com/en/tools/{slug}
curl -I https://yourdomain.com/zh/tools/{slug}

# 预期返回: HTTP/1.1 200 OK
```

---

## 工具开发示例

### 示例1: Word Counter (文本工具)

**类型**: 纯前端计算工具
**复杂度**: 简单
**开发时间**: 2-4小时

**核心文件**:
```
src/
├── types/wordCounter.ts       # 类型定义
├── utils/textAnalyzer.ts      # 文本分析逻辑
└── components/
    ├── WordCounter.tsx        # 主组件
    └── StatCard.tsx           # 统计卡片
```

**关键代码**:
```typescript
// utils/textAnalyzer.ts
export function analyzeText(text: string) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  return { wordCount, charCount };
}
```

---

### 示例2: JSON Formatter (开发者工具)

**类型**: 数据格式化工具
**复杂度**: 中等
**开发时间**: 4-6小时

**核心文件**:
```
src/
├── types/jsonFormatter.ts
├── utils/
│   ├── jsonParser.ts          # JSON 解析
│   └── jsonValidator.ts       # JSON 验证
└── components/
    ├── JsonFormatter.tsx      # 主组件
    ├── JsonInput.tsx          # 输入编辑器
    └── JsonOutput.tsx         # 输出展示
```

**关键逻辑**:
```typescript
// utils/jsonParser.ts
export function formatJson(input: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
}
```

---

### 示例3: Image Compressor (图像工具)

**类型**: 文件处理工具
**复杂度**: 较高
**开发时间**: 8-12小时

**核心文件**:
```
src/
├── types/imageCompressor.ts
├── utils/
│   ├── imageProcessor.ts      # 图片压缩逻辑
│   └── fileValidator.ts       # 文件验证
└── components/
    ├── ImageCompressor.tsx    # 主组件
    ├── ImageUploader.tsx      # 上传组件
    ├── ImagePreview.tsx       # 预览组件
    └── CompressionControls.tsx # 控制面板
```

**需要的库**:
```bash
npm install react-dropzone browser-image-compression
```

**关键逻辑**:
```typescript
import imageCompression from 'browser-image-compression';

export async function compressImage(
  file: File,
  quality: number
): Promise<Blob> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: quality / 100,
  };

  return await imageCompression(file, options);
}
```

---

## 常见问题

### Q1: 如何选择外部库？

**A**: 遵循以下原则：
1. ✅ 优先使用原生 JavaScript/Browser API
2. ✅ 选择维护活跃、Star 数高的库
3. ✅ 检查库的大小（避免过大的库）
4. ✅ 确保库支持 TypeScript

### Q2: 组件太大如何拆分？

**A**: 拆分建议：
- 单个文件超过 300 行 → 拆分
- 独立的 UI 模块 → 子组件
- 可复用的逻辑 → 工具函数
- 可复用的UI → 通用组件

### Q3: 如何处理大文件上传？

**A**:
1. 使用 `react-dropzone` 限制文件大小
2. 显示上传进度
3. 使用 Web Worker 处理（避免阻塞UI）
4. 考虑分片上传（超大文件）

### Q4: 如何优化性能？

**A**:
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存函数
- 避免在 render 中创建新对象/数组
- 大数据处理使用 Web Worker
- 图片处理使用 Canvas + OffscreenCanvas

### Q5: 如何处理错误？

**A**: 统一错误处理模式：
```typescript
const [error, setError] = useState<string | null>(null);

try {
  const result = processData(input);
  setError(null);
} catch (err) {
  setError(err.message);
}

// UI 显示
{error && (
  <div className="bg-red-100 text-red-800 p-4 rounded-lg">
    {error}
  </div>
)}
```

---

## 总结

### 开发流程总览

```
1. 确定工具信息（从 tools.json）
   ↓
2. 创建独立项目（Vite + React + TS）
   ↓
3. 配置 Tailwind（与主项目一致）
   ↓
4. 定义类型和接口
   ↓
5. 实现核心逻辑（工具函数）
   ↓
6. 创建组件（主组件 + 子组件）
   ↓
7. 本地测试（功能、边界、响应式）
   ↓
8. 复制到主项目
   ↓
9. 创建页面和路由
   ↓
10. 添加国际化翻译
    ↓
11. 更新工具配置
    ↓
12. 主项目测试
    ↓
13. Git 提交
    ↓
14. VPS 部署
    ↓
15. 生产验证
```

### 关键要点

| 阶段 | 要点 |
|------|------|
| **独立开发** | ✅ 组件自包含、零依赖、Props 驱动 |
| **样式** | ✅ 使用 Tailwind、与主项目配置一致 |
| **国际化** | ✅ Props 传入标签、默认英文 |
| **测试** | ✅ 功能、边界、响应式全测试 |
| **接入** | ✅ 复制粘贴、创建页面、添加翻译 |
| **部署** | ✅ Git 提交、VPS 拉取、PM2 重启 |

---

## 附录：快速参考

### 工具分类速查表

| 分类 | categoryId | 典型模式 | 示例工具 |
|------|-----------|---------|---------|
| 文本工具 | `text-tools` | 输入→处理→输出 | Word Counter, Case Converter |
| 文件工具 | `file-tools` | 上传→处理→下载 | PDF Merger, File Compressor |
| 图像工具 | `image-tools` | 上传→编辑→下载 | Image Resizer, QR Generator |
| 生成工具 | `generate-tools` | 配置→生成→复制 | Password Generator, UUID |
| 开发工具 | `developer-tools` | 输入→格式化→输出 | JSON Formatter, Base64 Encoder |

### 常用库推荐

| 用途 | 库名 | 安装命令 |
|------|------|---------|
| 文件上传 | react-dropzone | `npm i react-dropzone` |
| 图片压缩 | browser-image-compression | `npm i browser-image-compression` |
| 图片裁剪 | react-easy-crop | `npm i react-easy-crop` |
| 二维码 | qrcode | `npm i qrcode` |
| 代码编辑器 | @monaco-editor/react | `npm i @monaco-editor/react` |
| 日期处理 | date-fns | `npm i date-fns` |
| 文件下载 | file-saver | `npm i file-saver` |

---

**版本历史**:
- v1.1 (2025-12-11): 新增前后端分离工具开发指南、外部 AI API 接入指南
- v1.0 (2025-12-10): 初始版本，包含完整开发流程

**维护者**: TooliBox 开发团队

**祝开发顺利！** 🚀

---

## 前后端分离工具开发指南

> 本章节适用于需要后端 API 支持的工具，如 AI 工具、数据处理工具、需要服务端计算的工具等。

### 工具类型判断

首先判断你的工具属于哪种类型：

| 类型 | 特点 | 示例 | 是否需要后端 |
|------|------|------|-------------|
| **纯前端工具** | 所有计算在浏览器完成 | Word Counter, JSON Formatter | ❌ 不需要 |
| **前后端分离工具** | 需要服务端处理或存储 | 文件转换、数据持久化 | ✅ 需要 |
| **AI 增强工具** | 调用外部 AI API | AI 写作、智能翻译 | ✅ 需要 |

### 架构设计原则

#### 为什么 AI API 必须走后端？

```
❌ 错误做法：前端直接调用 AI API
┌─────────┐     ┌─────────────┐
│ 前端    │────→│ OpenAI API  │
│ (暴露Key)│     │             │
└─────────┘     └─────────────┘
问题：API Key 暴露在浏览器中，任何人都能看到并滥用

✅ 正确做法：通过后端代理
┌─────────┐     ┌─────────┐     ┌─────────────┐
│ 前端    │────→│ 后端API │────→│ OpenAI API  │
│         │     │ (安全存储Key)│ │             │
└─────────┘     └─────────┘     └─────────────┘
优势：API Key 安全存储在服务器，前端无法访问
```

#### 架构图

```
┌────────────────────────────────────────────────────────────┐
│                        前端 (Next.js)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  工具组件 (React)                                    │   │
│  │  - 用户界面                                          │   │
│  │  - 状态管理                                          │   │
│  │  - 调用 /api/tools/{tool-name} 接口                  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP 请求
┌────────────────────────────────────────────────────────────┐
│                        后端 (Express)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  工具路由 /api/tools/{tool-name}                     │   │
│  │  - 请求验证                                          │   │
│  │  - 调用 AI 服务                                      │   │
│  │  - 返回处理结果                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│                              ▼                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  AI 服务层                                           │   │
│  │  - API Key 安全管理                                  │   │
│  │  - 请求封装                                          │   │
│  │  - 错误处理                                          │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼ 外部 API 调用
┌────────────────────────────────────────────────────────────┐
│                     外部 AI 服务                            │
│  OpenAI / Claude / DeepSeek / 其他 AI 服务                  │
└────────────────────────────────────────────────────────────┘
```

---

### 后端开发规范

#### 目录结构

```
backend/src/
├── routes/
│   └── tools/
│       ├── index.ts              # 工具路由聚合
│       └── {tool-name}.ts        # 具体工具路由
├── controllers/
│   └── tools/
│       └── {tool-name}Controller.ts  # 工具控制器
├── services/
│   ├── ai/
│   │   ├── index.ts              # AI 服务导出
│   │   ├── openaiService.ts      # OpenAI 服务
│   │   ├── claudeService.ts      # Claude 服务
│   │   └── deepseekService.ts    # DeepSeek 服务
│   └── tools/
│       └── {tool-name}Service.ts # 工具业务逻辑
├── config/
│   └── ai.ts                     # AI 配置
├── middleware/
│   ├── auth.ts                   # 认证中间件
│   ├── rateLimit.ts              # 速率限制
│   └── validateRequest.ts        # 请求验证
└── types/
    └── tools/
        └── {tool-name}.ts        # 工具类型定义
```

#### 步骤1: 创建 AI 服务配置

**`backend/src/config/ai.ts`**

```typescript
/**
 * AI 服务配置
 * 所有 API Key 必须从环境变量读取，禁止硬编码
 */

export const aiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    defaultModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    baseUrl: process.env.CLAUDE_BASE_URL || 'https://api.anthropic.com',
    defaultModel: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    defaultModel: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  },
};

/**
 * 验证 AI 配置是否有效
 */
export function validateAiConfig(provider: 'openai' | 'claude' | 'deepseek'): boolean {
  const config = aiConfig[provider];
  return !!(config.apiKey && config.baseUrl);
}
```

#### 步骤2: 创建通用 AI 服务

**`backend/src/services/ai/openaiService.ts`**

```typescript
import axios from 'axios';
import { aiConfig } from '../../config/ai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

interface ChatCompletionResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * OpenAI 兼容 API 服务
 * 支持 OpenAI、DeepSeek 等兼容接口
 */
export class OpenAIService {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(
    apiKey: string = aiConfig.openai.apiKey,
    baseUrl: string = aiConfig.openai.baseUrl,
    defaultModel: string = aiConfig.openai.defaultModel
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
  }

  /**
   * 发送聊天请求
   */
  async chat(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<ChatCompletionResponse> {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 2000,
    } = options;

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 60000, // 60秒超时
        }
      );

      const data = response.data;
      return {
        content: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
      };
    } catch (error: any) {
      // 统一错误处理
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error?.message || 'AI service error';

        if (status === 401) {
          throw new Error('AI API authentication failed. Check API key.');
        } else if (status === 429) {
          throw new Error('AI API rate limit exceeded. Please try again later.');
        } else if (status === 500) {
          throw new Error('AI service temporarily unavailable.');
        }
        throw new Error(`AI API error: ${message}`);
      }
      throw new Error('Failed to connect to AI service.');
    }
  }

  /**
   * 流式响应（用于实时输出）
   */
  async chatStream(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {},
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 2000,
    } = options;

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        responseType: 'stream',
        timeout: 120000,
      }
    );

    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim());
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              resolve();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      });

      response.data.on('error', reject);
      response.data.on('end', resolve);
    });
  }
}

// 导出默认实例
export const openaiService = new OpenAIService();

// 导出 DeepSeek 实例
export const deepseekService = new OpenAIService(
  aiConfig.deepseek.apiKey,
  aiConfig.deepseek.baseUrl,
  aiConfig.deepseek.defaultModel
);
```

#### 步骤3: 创建工具路由

**`backend/src/routes/tools/index.ts`**

```typescript
import { Router } from 'express';
import aiWriterRoutes from './ai-writer';
// 导入其他工具路由...

const router = Router();

// 注册工具路由
router.use('/ai-writer', aiWriterRoutes);
// router.use('/ai-translator', aiTranslatorRoutes);
// router.use('/other-tool', otherToolRoutes);

export default router;
```

**`backend/src/routes/tools/ai-writer.ts`**（示例）

```typescript
import { Router } from 'express';
import {
  generateContent,
  improveContent,
  streamGenerateContent
} from '../../controllers/tools/aiWriterController';
import { validateRequest } from '../../middleware/validateRequest';
import { rateLimiter } from '../../middleware/rateLimit';

const router = Router();

// 应用速率限制
router.use(rateLimiter({
  windowMs: 60 * 1000, // 1分钟
  max: 10, // 最多10次请求
}));

// 生成内容
router.post('/generate', validateRequest, generateContent);

// 改进内容
router.post('/improve', validateRequest, improveContent);

// 流式生成（SSE）
router.get('/stream', streamGenerateContent);

export default router;
```

#### 步骤4: 创建工具控制器

**`backend/src/controllers/tools/aiWriterController.ts`**（示例）

```typescript
import { Request, Response } from 'express';
import { openaiService } from '../../services/ai/openaiService';

interface GenerateRequest {
  prompt: string;
  style?: 'professional' | 'casual' | 'creative';
  length?: 'short' | 'medium' | 'long';
}

/**
 * 生成内容
 */
export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt, style = 'professional', length = 'medium' } = req.body as GenerateRequest;

    // 输入验证
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required',
      });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Prompt too long (max 5000 characters)',
      });
    }

    // 构建系统提示
    const systemPrompt = buildSystemPrompt(style, length);

    // 调用 AI 服务
    const result = await openaiService.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ], {
      temperature: style === 'creative' ? 0.9 : 0.7,
      maxTokens: length === 'long' ? 3000 : length === 'medium' ? 1500 : 500,
    });

    return res.status(200).json({
      success: true,
      data: {
        content: result.content,
        usage: result.usage,
      },
    });
  } catch (error: any) {
    console.error('AI Writer error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate content',
    });
  }
};

/**
 * 改进内容
 */
export const improveContent = async (req: Request, res: Response) => {
  try {
    const { content, instruction } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      });
    }

    const result = await openaiService.chat([
      {
        role: 'system',
        content: 'You are a professional editor. Improve the given content based on the instruction.'
      },
      {
        role: 'user',
        content: `Content:\n${content}\n\nInstruction: ${instruction || 'Improve grammar and clarity'}`
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        content: result.content,
        usage: result.usage,
      },
    });
  } catch (error: any) {
    console.error('AI Improve error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to improve content',
    });
  }
};

/**
 * 流式生成（SSE）
 */
export const streamGenerateContent = async (req: Request, res: Response) => {
  const { prompt } = req.query;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Prompt is required',
    });
  }

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await openaiService.chatStream(
      [
        { role: 'system', content: 'You are a helpful writing assistant.' },
        { role: 'user', content: prompt },
      ],
      {},
      (chunk) => {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
    );

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

/**
 * 构建系统提示
 */
function buildSystemPrompt(style: string, length: string): string {
  const styleGuide = {
    professional: 'Write in a professional, formal tone.',
    casual: 'Write in a friendly, conversational tone.',
    creative: 'Write in a creative, engaging tone with vivid descriptions.',
  };

  const lengthGuide = {
    short: 'Keep the response concise, around 100-200 words.',
    medium: 'Provide a moderate response, around 300-500 words.',
    long: 'Provide a detailed response, around 800-1200 words.',
  };

  return `You are a professional content writer. ${styleGuide[style] || ''} ${lengthGuide[length] || ''}`;
}
```

#### 步骤5: 添加速率限制中间件

**`backend/src/middleware/rateLimit.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * 简单的速率限制中间件
 * 生产环境建议使用 Redis 存储
 */
export function rateLimiter(options: RateLimitOptions) {
  const { windowMs, max } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // 使用 IP 作为标识（生产环境可结合用户 ID）
    const key = req.ip || 'unknown';
    const now = Date.now();

    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    if (store[key].count >= max) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
      });
    }

    store[key].count++;
    next();
  };
}
```

#### 步骤6: 注册路由到主应用

**`backend/src/app.ts`**（更新）

```typescript
import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import feedbackRoutes from './routes/feedback';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import toolsRoutes from './routes/tools';  // ← 新增
import { startBackupCron } from './services/backupCron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json({ limit: '10mb' }));  // ← 增加请求体大小限制
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Routes
app.use('/api', feedbackRoutes);
app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api/tools', toolsRoutes);  // ← 新增工具路由

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📝 API: http://localhost:${PORT}/api`);
  console.log(`🔧 Tools API: http://localhost:${PORT}/api/tools`);  // ← 新增
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);

  if (process.env.NODE_ENV === 'production') {
    startBackupCron();
  }
});

export default app;
```

---

### 前端开发规范

#### 前端调用后端 API

**`frontend/src/lib/toolsApi.ts`**

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const toolsApi = axios.create({
  baseURL: `${API_BASE_URL}/api/tools`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // AI 请求可能较慢
});

// 请求拦截器：添加 token
toolsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一错误处理
toolsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      throw new Error('请求过于频繁，请稍后再试');
    }
    throw new Error(error.response?.data?.message || '服务暂时不可用');
  }
);

/**
 * AI Writer API
 */
export const aiWriterApi = {
  generate: async (prompt: string, options?: {
    style?: 'professional' | 'casual' | 'creative';
    length?: 'short' | 'medium' | 'long';
  }) => {
    const response = await toolsApi.post('/ai-writer/generate', {
      prompt,
      ...options,
    });
    return response.data;
  },

  improve: async (content: string, instruction?: string) => {
    const response = await toolsApi.post('/ai-writer/improve', {
      content,
      instruction,
    });
    return response.data;
  },
};
```

#### 前端组件示例

**`frontend/src/components/tools/AIWriter/index.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { aiWriterApi } from '@/lib/toolsApi';

interface AIWriterProps {
  labels?: {
    title?: string;
    subtitle?: string;
    promptPlaceholder?: string;
    generateButton?: string;
    generatingText?: string;
    resultLabel?: string;
    errorPrefix?: string;
  };
}

const DEFAULT_LABELS = {
  title: 'AI Writer',
  subtitle: 'Generate high-quality content with AI',
  promptPlaceholder: 'Describe what you want to write...',
  generateButton: 'Generate',
  generatingText: 'Generating...',
  resultLabel: 'Generated Content',
  errorPrefix: 'Error',
};

export default function AIWriter({ labels }: AIWriterProps) {
  const mergedLabels = useMemo(() => ({
    ...DEFAULT_LABELS,
    ...labels,
  }), [labels]);

  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 配置选项
  const [style, setStyle] = useState<'professional' | 'casual' | 'creative'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult('');

    try {
      const response = await aiWriterApi.generate(prompt, { style, length });
      if (response.success) {
        setResult(response.data.content);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          {mergedLabels.title}
        </h1>
        <p className="text-lg text-gray-600">
          {mergedLabels.subtitle}
        </p>
      </div>

      {/* 输入区域 */}
      <div className="card mb-6">
        <textarea
          className="textarea-field min-h-[150px]"
          placeholder={mergedLabels.promptPlaceholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />

        {/* 选项 */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
            <select
              className="input-field"
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              disabled={loading}
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
            <select
              className="input-field"
              value={length}
              onChange={(e) => setLength(e.target.value as any)}
              disabled={loading}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        <button
          className="btn-primary w-full mt-4"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? mergedLabels.generatingText : mergedLabels.generateButton}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          {mergedLabels.errorPrefix}: {error}
        </div>
      )}

      {/* 结果区域 */}
      {result && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">{mergedLabels.resultLabel}</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {result}
          </div>
          <button
            className="btn-secondary mt-4"
            onClick={() => navigator.clipboard.writeText(result)}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 外部 AI API 接入指南

### 支持的 AI 服务

| 服务 | 接口类型 | 推荐场景 | 成本 |
|------|---------|---------|------|
| **OpenAI** | OpenAI 标准 | 通用场景、高质量输出 | 中等 |
| **Claude** | Anthropic | 长文本、复杂推理 | 较高 |
| **DeepSeek** | OpenAI 兼容 | 中文场景、性价比高 | 较低 |
| **通义千问** | OpenAI 兼容 | 中文场景 | 较低 |
| **智谱 AI** | OpenAI 兼容 | 中文场景 | 较低 |

### 环境变量配置

**`backend/.env`**

```bash
# ============================================
# AI 服务配置
# ============================================

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# Claude (Anthropic)
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
CLAUDE_BASE_URL=https://api.anthropic.com
CLAUDE_MODEL=claude-3-haiku-20240307

# DeepSeek
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# 通义千问 (阿里云)
QWEN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-turbo

# 智谱 AI
ZHIPU_API_KEY=xxxxxxxxxxxxxxxxxxxx
ZHIPU_BASE_URL=https://open.bigmodel.cn/api/paas/v4
ZHIPU_MODEL=glm-4-flash
```

**⚠️ 安全警告**：
- `.env` 文件必须添加到 `.gitignore`
- 生产环境使用环境变量或密钥管理服务
- 定期轮换 API Key

### API Key 安全最佳实践

```typescript
// ❌ 绝对禁止
const apiKey = 'sk-xxxxxxxx'; // 硬编码

// ❌ 禁止
// 在前端代码中使用 API Key
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}` }
});

// ✅ 正确做法
// 只在后端使用，从环境变量读取
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not configured');
}
```

### 多 AI 服务支持

**`backend/src/services/ai/index.ts`**

```typescript
import { OpenAIService, openaiService, deepseekService } from './openaiService';
import { aiConfig, validateAiConfig } from '../../config/ai';

type AIProvider = 'openai' | 'deepseek' | 'qwen' | 'zhipu';

/**
 * AI 服务工厂
 * 根据 provider 返回对应的服务实例
 */
export function getAIService(provider: AIProvider = 'openai'): OpenAIService {
  switch (provider) {
    case 'openai':
      if (!validateAiConfig('openai')) {
        throw new Error('OpenAI is not configured');
      }
      return openaiService;

    case 'deepseek':
      if (!validateAiConfig('deepseek')) {
        throw new Error('DeepSeek is not configured');
      }
      return deepseekService;

    case 'qwen':
      return new OpenAIService(
        process.env.QWEN_API_KEY || '',
        process.env.QWEN_BASE_URL || '',
        process.env.QWEN_MODEL || 'qwen-turbo'
      );

    case 'zhipu':
      return new OpenAIService(
        process.env.ZHIPU_API_KEY || '',
        process.env.ZHIPU_BASE_URL || '',
        process.env.ZHIPU_MODEL || 'glm-4-flash'
      );

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

/**
 * 获取可用的 AI 服务列表
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  if (validateAiConfig('openai')) providers.push('openai');
  if (validateAiConfig('deepseek')) providers.push('deepseek');
  if (process.env.QWEN_API_KEY) providers.push('qwen');
  if (process.env.ZHIPU_API_KEY) providers.push('zhipu');

  return providers;
}
```

### 错误处理与重试

**`backend/src/services/ai/retryWrapper.ts`**

```typescript
interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

/**
 * 带重试的 AI 请求包装器
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // 不重试的错误
      if (
        error.message.includes('authentication') ||
        error.message.includes('API key') ||
        error.message.includes('invalid')
      ) {
        throw error;
      }

      // 最后一次尝试，直接抛出
      if (attempt === maxRetries) {
        throw error;
      }

      // 速率限制：等待更长时间
      if (error.message.includes('rate limit')) {
        delay = Math.min(delay * 3, maxDelay);
      }

      console.log(`AI request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError!;
}
```

### 使用量监控（可选）

**`backend/src/services/ai/usageTracker.ts`**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UsageRecord {
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  toolName: string;
  userId?: number;
}

/**
 * 记录 AI 使用量
 * 可用于成本分析和监控
 */
export async function trackUsage(record: UsageRecord): Promise<void> {
  try {
    // 如果有 AIUsage 表，可以记录到数据库
    // await prisma.aIUsage.create({ data: record });

    // 或者简单地记录日志
    console.log('[AI Usage]', JSON.stringify(record));
  } catch (error) {
    console.error('Failed to track AI usage:', error);
  }
}
```

---

## 完整接入流程（前后端分离工具）

### 流程总览

```
1. 后端开发
   ├── 创建 AI 服务配置
   ├── 实现工具 Controller
   ├── 创建工具路由
   └── 注册到主应用
        ↓
2. 前端开发
   ├── 创建 API 调用模块
   ├── 开发工具组件（独立项目）
   ├── 测试功能
   └── 复制到主项目
        ↓
3. 接入主项目
   ├── 复制前端组件
   ├── 创建页面
   ├── 添加国际化翻译
   └── 更新 tools.json
        ↓
4. 部署
   ├── 配置生产环境变量
   ├── 部署后端
   ├── 部署前端
   └── 验证功能
```

### 环境变量检查清单

**后端 `.env`**：
```bash
# 数据库
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key

# AI 服务（至少配置一个）
OPENAI_API_KEY=sk-...
# 或
DEEPSEEK_API_KEY=sk-...

# 其他配置
PORT=8000
NODE_ENV=production
```

**前端 `.env.local`**：
```bash
# API 地址
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 测试检查清单

```markdown
## 后端测试
- [ ] API 路由正常响应
- [ ] 错误情况正确处理（无 API Key、无效输入等）
- [ ] 速率限制生效
- [ ] 超时处理正常

## 前端测试
- [ ] 正常请求成功
- [ ] 加载状态显示
- [ ] 错误提示正确
- [ ] 网络异常处理

## 集成测试
- [ ] 端到端流程正常
- [ ] 国际化切换正常
- [ ] 响应式布局正常
```

---

## 附录：AI 工具快速参考

### 常见 AI 工具类型

| 工具类型 | 示例 | 后端逻辑 |
|---------|------|---------|
| **文本生成** | AI Writer, Blog Generator | 单次 chat 调用 |
| **文本改写** | Paraphraser, Grammar Fixer | 单次 chat 调用 |
| **翻译工具** | AI Translator | 单次 chat 调用 |
| **代码工具** | Code Explainer, Code Generator | 单次 chat 调用 |
| **对话工具** | Chatbot | 多轮对话，需要上下文 |
| **分析工具** | Sentiment Analyzer | 结构化输出 |

### API 请求模板

```typescript
// 简单生成
const result = await aiService.chat([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: userInput },
]);

// 带上下文的对话
const result = await aiService.chat([
  { role: 'system', content: 'You are a helpful assistant.' },
  ...previousMessages,
  { role: 'user', content: userInput },
]);

// 结构化输出
const result = await aiService.chat([
  { role: 'system', content: 'Return JSON format: { "sentiment": "positive|negative|neutral", "score": 0-100 }' },
  { role: 'user', content: textToAnalyze },
]);
const parsed = JSON.parse(result.content);
```
