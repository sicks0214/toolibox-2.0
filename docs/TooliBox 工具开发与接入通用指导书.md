# TooliBox 工具开发与接入通用指导书

> **版本**: v1.0
> **创建日期**: 2025-12-10
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
- v1.0 (2025-12-10): 初始版本，包含完整开发流程

**维护者**: TooliBox 开发团队

**祝开发顺利！** 🚀
