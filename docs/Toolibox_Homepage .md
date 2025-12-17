# Toolibox 主站（导航站）需求与架构文档

> 版本：v2.0
> 更新时间：2025-12-17

---

## 一、项目定位

**Toolibox 主站**是一个工具聚合与导航入口，核心目标：

- 为用户快速找到合适工具
- 为搜索引擎建立清晰的站点结构（Topical Authority）
- 为子工具页持续分发权重与流量

👉 主站 **不直接承载复杂工具逻辑**，而是"入口 + 组织 + 搜索"。

### 类比说明

> 主站是"城市地图"，工具页是"具体商店"。
> 地图的任务不是卖东西，而是让人快速找到地方。

---

## 二、技术架构定位

### 2.1 架构类型定义

**Toolibox 采用 Micro-Frontend（微前端）架构**

这是一个**轻量、去中心化的微前端方案**，而非企业级复杂架构。

主站是一个 **配置驱动的 Host 应用**，通过子路径路由和 Nginx 反向代理，将多个完全独立的工具微前端应用组织在单域名下。每个工具独立构建、独立部署、独立运行。

### 2.2 架构角色划分

| 层级 | 角色 | 职责 |
|------|------|------|
| 主站 | Host / Shell / Router | 路由 + 链接 + 权重分发 |
| 工具应用 | Remote / Sub App | 独立功能实现 |

**关键原则**：
- 主站只负责导航和组织，不加载、不运行、不依赖工具代码
- 每个工具是完全独立的 Web 应用，可单独运行和部署

### 2.3 技术实现方式

**采用 HTTP 层路由切分，而非 JS 运行时加载**

```
Browser
   │
   ▼
Nginx (Reverse Proxy / Path Router)
   │
   ├─ /                     → frontend-main（Host）
   ├─ /pdf-tools/*          → frontend-pdf（Remote）
   ├─ /image-tools/*        → frontend-image（Remote）
   │
   └─ /api/*                → backend services
```

### 2.4 不采用的方案

| 方案 | 排除原因 |
|------|---------|
| Module Federation | 过度耦合、部署复杂 |
| iframe | SEO 差、用户体验差 |
| Monorepo 单构建 | 无法支撑 30+ 工具独立演进 |
| 单体前端 | 扩展性差、故障影响范围大 |

### 2.5 架构优势

针对 Toolibox 的实际需求：

| 需求 | 架构支持 |
|------|---------|
| 工具数量：30+ / 100+ | ✅ 横向扩展无上限 |
| 本地开发简单 | ✅ 每个工具独立 `npm run dev` |
| SEO 友好 | ✅ 每个页面独立 HTML |
| 故障隔离 | ✅ 单个工具故障不影响主站 |
| 独立部署 | ✅ 工具可单独更新回滚 |
| VPS 成本可控 | ✅ 按需启动容器 |

---

## 三、核心目标

1. 成为所有工具的统一入口
2. 建立清晰的分类体系（PDF / Image / Text / Color / AI）
3. 支持未来 30+ / 100+ 工具扩展
4. SEO 友好、加载快、结构稳定

---

## 四、站点结构

### 4.1 URL 结构

```
/                     首页（导航）
/pdf-tools/           PDF 分类页
/image-tools/         Image 分类页
/text-tools/          Text / Dev 分类页
/color-tools/         Color / Design 分类页
/ai-tools/            AI 工具分类页（预留）
```

### 4.2 技术实现层级

**主站层（Host Application）**
- 路径：`/`
- 职责：导航、分类、搜索、SEO
- 技术栈：Next.js / SSG
- 部署：独立 Docker 容器

**工具层（Remote Applications）**
- 路径：`/{category}-tools/*`
- 职责：具体工具功能实现
- 技术栈：独立选择（Next.js / React / Vue）
- 部署：独立 Docker 容器 + basePath 配置

**API 层（Backend Services）**
- 路径：`/api/{category}/*`
- 职责：工具后端处理逻辑
- 技术栈：Node.js / Python / Go
- 部署：独立 Docker 容器

### 4.3 主站不做的事情

- ❌ 不做工具核心计算
- ❌ 不做文件处理
- ❌ 不做复杂业务逻辑
- ❌ 不加载工具的 JS Bundle
- ❌ 不与工具共享运行时依赖

---

## 五、首页需求（Homepage）

### 5.1 首页核心职责

- 告诉用户：Toolibox 是什么
- 提供最快的工具入口
- 引导进入分类页与核心工具页

---

### 5.2 首页模块结构（从上到下）

#### 1️⃣ Header 导航

- Logo（Toolibox）
- 一级分类入口：
  - PDF Tools
  - Image Tools
  - Text Tools
  - Color Tools
  - AI Tools（可隐藏）
- 语言切换
- 用户认证（可选）

**技术要求**：
- 响应式设计（桌面端下拉菜单、移动端抽屉菜单）
- 分类数据配置化（从 categories.json 读取）

---

#### 2️⃣ Hero 区（首屏）

**内容要求：**
- H1：网站核心定位
- 简短说明
- 全站搜索框

**示例文案：**
```
H1: Free Online Tools for PDF, Image, and More
Sub: Simple, fast, and secure tools to solve everyday tasks.
```

**技术要求**：
- H1 标签用于 SEO
- 搜索框支持实时搜索或跳转到搜索结果页
- 搜索逻辑基于工具配置数据（tools.json）

---

#### 3️⃣ 热门工具（Popular Tools）

- 展示 6–9 个工具
- 只展示「成熟 & 场景清晰」工具
- 示例：
  - Merge PDF
  - Merge PDF for Printing
  - Compress PDF for Email

**技术要求**：
- 工具数据从 tools.json 读取
- 通过 `isPopular: true` 标记筛选
- 工具卡片包含：图标、名称、描述、"Coming Soon" 标记

---

#### 4️⃣ 分类入口（Categories）

每个分类卡片包含：
- 分类名称
- 简短描述
- 工具数量
- 进入分类页按钮

**技术要求**：
- 分类数据从 categories.json 读取
- 工具数量自动统计
- 支持分类排序（order 字段）

---

#### 5️⃣ 使用场景推荐（Optional）

示例：
- For Printing
- For Email
- For Social Media
- For Office Work

**技术要求**：
- 场景卡片包含图标和描述
- 国际化支持（中英文）

---

#### 6️⃣ Why Toolibox（信任模块）

说明：
- Free to use
- No signup required
- Secure file handling
- Fast processing

**技术要求**：
- 4个特性卡片
- 使用图标库（Lucide React）
- 国际化支持

---

#### 7️⃣ Footer

- About
- Privacy Policy
- Terms of Service
- Feedback
- Sitemap

**技术要求**：
- 链接到静态页面
- 版权信息动态年份
- 响应式布局

---

## 六、分类页需求（以 PDF 为例）

### 6.1 URL
```
/pdf-tools/
```

### 6.2 分类页职责

- 说明该分类能解决什么问题
- 聚合该分类下所有工具
- 向下分发权重（SEO）

---

### 6.3 分类页模块

1. **H1 + 分类介绍（300–500 字）**
   - 说明该分类的价值和应用场景
   - 包含关键词但不堆砌
   - 国际化支持

2. **核心工具分组（Popular Tools）**
   - 展示该分类下的热门工具
   - 通过 `isPopular: true` 筛选

3. **所有工具列表（All Tools）**
   - 展示该分类下的所有工具
   - 网格布局，响应式设计

4. **内链到具体工具页**
   - 每个工具卡片可点击
   - 链接格式：`/{category}/{tool-slug}`

**技术要求**：
- 分类介绍从国际化文件读取（`category.descriptions.{categoryId}`）
- 工具列表自动从 tools.json 筛选
- 面包屑导航
- SEO metadata（Title、Description、Canonical）

---

## 七、搜索功能需求（站内搜索）

### 7.1 功能说明

- 搜索工具名称
- 搜索工具描述
- 支持模糊匹配
- 支持多语言搜索

### 7.2 示例

输入：
```
merge pdf print
```

返回：
- Merge PDF for Printing
- Merge PDF (core)

### 7.3 技术要求

- 搜索页面路径：`/search?q={query}`
- 搜索逻辑：前端基于 tools.json 的客户端搜索
- 搜索结果展示：工具卡片 + 分类标签
- 空结果提示和返回首页按钮
- 国际化支持

---

## 八、SEO 基础要求

### 8.1 必须支持

- 每页独立 Title / Description
- Self-canonical
- sitemap.xml（自动生成）
- robots.txt
- Open Graph 标签
- Twitter Card 标签

### 8.2 首页 SEO

- 不堆关键词
- 只做品牌 + 总类目
- 不直接抢工具关键词

### 8.3 技术实现

**sitemap.xml 生成**：
- 使用 Next.js sitemap.ts
- 包含所有页面：首页、分类页、工具页、静态页
- 支持多语言（en、zh）
- 自动更新频率和优先级

**robots.txt**：
- 允许所有爬虫
- 禁止 /api/ 和 /admin/
- 指向 sitemap.xml

---

## 九、性能与技术要求

### 9.1 性能指标

- 首页 < 1.5s 加载
- 分类页 < 2s 加载
- Lighthouse 性能分数 > 90

### 9.2 技术栈

**主站应用**：
- 框架：Next.js 14+ (App Router)
- 渲染：SSG（静态生成）/ SSR（服务端渲染）
- 样式：Tailwind CSS
- 国际化：next-intl
- 图标：Lucide React

**数据管理**：
- 配置文件：JSON（categories.json、tools.json）
- 未来可迁移到数据库

**部署**：
- 容器化：Docker
- 反向代理：Nginx
- 托管：VPS / Cloud

### 9.3 技术要求

- 移动端优先（Mobile First）
- 无阻塞 JS
- 图片懒加载
- 代码分割
- 响应式设计

---

## 十、技术边界与职责划分

### 10.1 主站与工具的技术边界

| 维度 | 主站 | 工具应用 |
|------|------|---------|
| 构建 | 独立构建 | 独立构建 |
| 部署 | 独立部署 | 独立部署 |
| JS Bundle | 不共享 | 不共享 |
| 运行时依赖 | 自己管理 | 自己管理 |
| 失败影响 | 不影响工具 | 不影响主站 |
| 数据共享 | 通过配置文件 | 通过 API |

### 10.2 主站的技术职责

**必须做**：
- ✅ 路由和导航
- ✅ 工具发现和搜索
- ✅ SEO 和权重分发
- ✅ 分类和组织
- ✅ 用户认证（可选）

**不能做**：
- ❌ 工具核心逻辑
- ❌ 文件处理
- ❌ 复杂计算
- ❌ 加载工具代码

### 10.3 工具应用的技术要求

每个工具应用必须：
- 可独立运行（`npm run dev`）
- 支持 basePath 配置（生产环境）
- 提供 Health Check 端点
- 使用相对路径调用 API
- 不依赖主站代码

---

## 十一、可扩展性设计

### 11.1 配置驱动

- 新增工具无需改主站代码
- 分类页自动读取工具配置
- 工具信息配置化（JSON / DB）

### 11.2 工具注册机制

**工具配置文件**（tools.json）：
```json
{
  "id": "merge-pdf",
  "slug": "merge-pdf",
  "categoryId": "pdf-tools",
  "name": { "en": "Merge PDF", "zh": "合并PDF" },
  "description": { "en": "...", "zh": "..." },
  "icon": "📄",
  "isPopular": true,
  "comingSoon": false
}
```

**主站自动发现**：
- 读取 tools.json
- 按分类分组
- 生成导航和搜索索引
- 更新 sitemap

### 11.3 工具部署策略

**架构保持不变**：始终采用轻量微前端架构

**工具部署灵活性**：

**0-10 个工具**：
- 简单工具可集成在主站内（快速启动）
- 复杂工具可独立部署（按需选择）

**10-30 个工具**：
- 复杂工具独立部署为微前端应用
- 简单工具可继续集成在主站

**30+ 个工具**：
- 所有工具完全独立部署
- 主站专注导航和 SEO

---

## 十二、非功能性要求

### 12.1 用户体验

- 简洁 UI
- 明确层级
- 不信息过载
- 不做"工具堆砌"
- 快速响应

### 12.2 开发体验

- 本地开发简单
- 新工具接入流程清晰
- 文档完善
- 代码规范统一

### 12.3 运维要求

- 容器化部署
- 健康检查
- 日志监控
- 故障隔离
- 独立回滚

---

## 十三、成功标准

### 13.1 SEO 指标

- 首页被稳定收录
- 分类页开始有展示
- 工具页权重逐步提升
- 新工具上线可被快速索引

### 13.2 用户指标

- 首页跳出率 < 60%
- 平均停留时间 > 1 分钟
- 工具点击率 > 30%
- 搜索使用率 > 10%

### 13.3 技术指标

- 首页加载 < 1.5s
- 可用性 > 99.5%
- 新工具上线 < 1 小时
- 故障恢复 < 5 分钟

---

## 十四、技术架构总结

### 14.1 三句话定义

1️⃣ 主站是 **Host，不是 App**
2️⃣ 微前端在 **HTTP 层实现，不在 JS 层**
3️⃣ 所有工具 **独立生存、独立演进**

### 14.2 架构声明

> Toolibox is built with a lightweight, decentralized micro-frontend architecture.
>
> The main site acts as a host application responsible only for navigation
> and routing, while each tool is an independently built and deployed
> micro-frontend application served under its own sub-path via Nginx reverse proxy.

### 14.3 架构实施策略

**当前架构**：轻量微前端架构

**扩展策略**：
- 0-10 个工具：主站 + 简单工具可集成在主站内
- 10-30 个工具：复杂工具独立部署为微前端应用
- 30+ 个工具：所有工具完全独立部署

**核心原则**：架构保持不变，只是工具独立部署的比例逐步提高

---

## 附录：相关文档

- [新工具接入标准](./Toolibox_New_Tool_Onboarding_Standard.md)
- [实现符合性检查报告](./Implementation_Compliance_Check.md)
- [技术栈选型说明](./Tech_Stack_Selection.md)（待补充）

---

**文档维护**：
- 本文档随项目演进持续更新
- 重大架构变更需更新本文档
- 保持产品需求与技术实现的一致性
