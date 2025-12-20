# Toolibox Main 应用 VPS 部署指南

本文档说明如何将 Toolibox Main 应用部署到 VPS (82.29.67.124)，作为微前端架构中的主站应用。

## 一、应用角色定位

**Main 应用在 VPS 架构中的职责：**
- 端口：3000（前端）+ 8000（后端）
- 路由：`/` 根路径
- 功能：
  - 主站导航和首页
  - 工具展示和分类
  - 用户认证（登录/注册）
  - 反馈收集
  - 提供到各个独立工具服务的入口链接

## 二、部署前准备

### 1. 环境要求
- Ubuntu 22.04 LTS
- Docker 和 Docker Compose 已安装
- Nginx 已安装并配置
- PostgreSQL 14+ 数据库
- 域名或 IP 访问（当前：82.29.67.124）

### 2. 关键技术说明

**⚠️ 重要：本应用已针对生产部署进行优化**

#### 前端构建（Next.js）
- 使用 **standalone 输出模式**（next.config.js 已配置）
- 多阶段 Docker 构建，优化镜像大小
- 包含 i18n 国际化文件的完整追踪
- 生产环境自动启用 SSR

#### 后端构建（TypeScript + Express）
- **已修复**：原 Dockerfile 存在 TypeScript 编译问题
- 当前版本使用 **多阶段构建**：
  - Builder 阶段：编译 TypeScript → JavaScript
  - Runner 阶段：仅包含生产依赖和编译后的代码
- 正确的入口点：`node dist/app.js`（不是 `src/app.ts`）
- 自动生成 Prisma Client

#### Docker 镜像特点
```
前端镜像：node:18-alpine (多阶段)
  ├── 构建阶段：编译 Next.js
  └── 运行阶段：仅包含 standalone 输出

后端镜像：node:18-alpine (多阶段)
  ├── 构建阶段：编译 TypeScript + 生成 Prisma Client
  └── 运行阶段：仅包含编译后的 JS 文件
```

### 3. 准备环境变量

在 VPS 上创建 `.env` 文件：

```bash
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/toolibox"

# JWT 密钥
JWT_SECRET="your-secret-key-here"

# Cloudflare R2 配置
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="toolibox-backups"

# DeepSeek AI API
DEEPSEEK_API_KEY="your-deepseek-api-key"
```

## 三、部署步骤

### 步骤 1：上传代码到 VPS

```bash
# 在本地打包代码
tar -czf toolibox-main.tar.gz \
  frontend/main \
  backend \
  docker-compose.yml \
  nginx/toolibox.conf

# 上传到 VPS
scp toolibox-main.tar.gz toolibox@82.29.67.124:/var/www/

# 在 VPS 上解压
ssh toolibox@82.29.67.124
cd /var/www
tar -xzf toolibox-main.tar.gz
mv toolibox-main toolibox
```

### 步骤 2：配置数据库

```bash
# 进入后端目录
cd /var/www/toolibox/backend

# 运行数据库迁移
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate
```

### 步骤 3：构建 Docker 镜像

```bash
cd /var/www/toolibox

# 构建前端镜像（包含 Next.js 编译）
docker build -t toolibox/frontend-main ./frontend/main

# 构建后端镜像（包含 TypeScript 编译）
docker build -t toolibox/backend-main ./backend

# 验证镜像构建成功
docker images | grep toolibox
```

**构建说明：**
- 前端构建时间约 3-5 分钟（包含依赖安装和 Next.js 编译）
- 后端构建时间约 2-3 分钟（包含 TypeScript 编译和 Prisma 生成）
- 如果构建失败，检查 `.env` 文件是否存在于项目根目录
- 多阶段构建会自动优化镜像大小（前端约 200MB，后端约 150MB）

### 步骤 4：启动容器

```bash
# 复制环境变量文件
cp .env /var/www/toolibox/

# 启动所有服务
docker compose up -d

# 查看运行状态
docker ps

# 查看日志
docker compose logs -f
```

### 步骤 5：配置 Nginx

```bash
# 复制 Nginx 配置
sudo cp /var/www/toolibox/nginx/toolibox.conf /etc/nginx/sites-available/

# 创建软链接
sudo ln -sf /etc/nginx/sites-available/toolibox.conf /etc/nginx/sites-enabled/

# 删除默认配置（如果存在）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 步骤 6：验证部署

```bash
# 检查容器状态
docker ps

# 应该看到：
# - toolibox-frontend-main (端口 3000)
# - toolibox-backend-main (端口 8000)

# 测试访问
curl http://localhost:3000
curl http://localhost:8000/api/health

# 通过浏览器访问
# http://82.29.67.124
```

## 四、与微前端架构的集成

### 当前架构状态

```
Internet
   │
   ▼
Nginx (82.29.67.124)
   │
   ├── /                    → Main 应用 (端口 3000) ✅ 已部署
   ├── /api/*               → Main 后端 (端口 8000) ✅ 已部署
   │
   ├── /pdf-tools/*         → PDF 工具前端 (端口 3001) ⏳ 待部署
   ├── /image-tools/*       → Image 工具前端 (端口 3002) ⏳ 待部署
```

### 工具链接路由逻辑

Main 应用已配置智能路由：

1. **Coming Soon 工具**：链接到当前应用的占位页面
   - 例如：`/en/pdf-tools/merge-pdf`

2. **已部署的独立工具**：链接到微前端子路径
   - 例如：`/pdf-tools/merge-pdf`（直接访问独立服务）

配置文件：`frontend/main/src/config/toolRoutes.ts`

### 添加新的微前端服务

当部署新的工具服务时（如 PDF Tools）：

1. 在 `docker-compose.yml` 中添加服务：
```yaml
frontend-pdf:
  image: toolibox/frontend-pdf
  restart: always
  ports:
    - "3001:3001"
```

2. Nginx 配置已预留路由（无需修改）：
```nginx
location /pdf-tools/ {
    proxy_pass http://127.0.0.1:3001/;
}
```

3. 更新工具数据，将 `comingSoon: false`：
```json
{
  "id": "merge-pdf",
  "comingSoon": false
}
```

## 五、常用运维命令

### Docker 操作

```bash
# 查看运行容器
docker ps

# 查看日志
docker compose logs -f frontend-main
docker compose logs -f backend-main

# 重启服务
docker compose restart frontend-main
docker compose restart backend-main

# 停止所有服务
docker compose down

# 重新构建并启动
docker compose up -d --build
```

### Nginx 操作

```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

### 数据库操作

```bash
# 进入 PostgreSQL
psql -U username -d toolibox

# 查看表
\dt

# 备份数据库
pg_dump -U username toolibox > backup.sql

# 恢复数据库
psql -U username toolibox < backup.sql
```

## 六、故障排查

### 问题 1：502 Bad Gateway

**原因**：Docker 容器未运行

**解决**：
```bash
docker ps  # 检查容器状态
docker compose up -d  # 启动容器
docker compose logs -f  # 查看日志
```

### 问题 2：数据库连接失败

**原因**：DATABASE_URL 配置错误或数据库未启动

**解决**：
```bash
# 检查环境变量
cat .env | grep DATABASE_URL

# 测试数据库连接
psql -U username -d toolibox

# 检查后端日志
docker compose logs backend-main
```

### 问题 3：Next.js 构建失败

**原因**：缺少依赖或配置错误

**解决**：
```bash
# 进入前端目录
cd frontend/main

# 清理并重新安装
rm -rf node_modules .next
npm install
npm run build

# 重新构建镜像
docker build -t toolibox/frontend-main .
```

### 问题 4：后端容器启动失败（TypeScript 相关）

**症状**：容器启动后立即退出，日志显示 `Cannot find module` 或 TypeScript 错误

**原因**：
- 旧版本 Dockerfile 未编译 TypeScript
- 尝试直接运行 `.ts` 文件

**解决**：
```bash
# 确认使用的是最新的 Dockerfile（包含多阶段构建）
cat backend/Dockerfile | grep "FROM node:18-alpine AS builder"

# 如果没有看到 "AS builder"，说明 Dockerfile 需要更新
# 最新版本应该包含：
# 1. Builder 阶段：编译 TypeScript
# 2. Runner 阶段：运行编译后的 JS
# 3. 入口点：CMD ["node", "dist/app.js"]

# 重新构建镜像
docker compose build backend-main

# 查看构建日志确认 TypeScript 编译成功
docker compose logs backend-main | grep "✅"
```

### 问题 5：Prisma Client 生成失败

**症状**：后端日志显示 `@prisma/client` 未找到

**解决**：
```bash
# 进入后端容器
docker exec -it toolibox-backend-main sh

# 手动生成 Prisma Client
npx prisma generate

# 退出容器
exit

# 重启后端服务
docker compose restart backend-main
```

### 问题 6：环境变量未生效

**症状**：容器运行但功能异常，日志显示 `undefined` 环境变量

**解决**：
```bash
# 确认 .env 文件在项目根目录
ls -la /var/www/toolibox/.env

# 检查 docker-compose.yml 是否正确引用环境变量
cat docker-compose.yml | grep "env_file"

# 重新启动容器（会重新加载环境变量）
docker compose down
docker compose up -d

# 验证环境变量已加载
docker exec toolibox-backend-main env | grep DATABASE_URL
```

## 七、更新部署

### 更新代码

```bash
# 1. 在本地拉取最新代码
git pull origin main

# 2. 重新打包上传
tar -czf toolibox-main.tar.gz frontend/main backend docker-compose.yml
scp toolibox-main.tar.gz toolibox@82.29.67.124:/var/www/

# 3. 在 VPS 上解压
ssh toolibox@82.29.67.124
cd /var/www/toolibox
tar -xzf ../toolibox-main.tar.gz

# 4. 重新构建镜像
docker compose build

# 5. 重启服务
docker compose up -d

# 6. 查看日志确认
docker compose logs -f
```

### 零停机更新

```bash
# 使用滚动更新
docker compose up -d --no-deps --build frontend-main
docker compose up -d --no-deps --build backend-main
```

## 八、安全建议

1. **配置 HTTPS**（需要域名）：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d toolibox.com
```

2. **配置防火墙**：
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

3. **定期备份**：
- 数据库备份（每日）
- 代码备份（每次部署前）
- 配置文件备份

4. **监控日志**：
```bash
# 设置日志轮转
sudo nano /etc/logrotate.d/nginx
```

## 九、性能优化

1. **启用 Nginx 缓存**（已配置）
2. **使用 CDN**（可选）
3. **数据库索引优化**
4. **Docker 资源限制**：

```yaml
services:
  frontend-main:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

## 十、关键修复说明（2025-12-18）

### 🔧 后端 Dockerfile 重大修复

**修复前的问题：**
```dockerfile
# ❌ 旧版本（会导致运行失败）
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 8000
CMD ["node", "src/server.js"]  # ❌ 错误：尝试运行 TypeScript 文件
```

**问题分析：**
1. 后端代码是 TypeScript，但 Dockerfile 没有编译步骤
2. 入口点指向 `src/server.js`，但实际文件是 `src/app.ts`
3. 只安装生产依赖，无法编译 TypeScript
4. 容器启动时会报错：`Cannot find module 'src/server.js'`

**修复后的版本：**
```dockerfile
# ✅ 新版本（多阶段构建）
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci  # 安装所有依赖（包括 TypeScript）
COPY . .
RUN npx prisma generate
RUN npm run build  # 编译 TypeScript → dist/

FROM node:18-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY prisma ./prisma
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
EXPOSE 8000
CMD ["node", "dist/app.js"]  # ✅ 正确：运行编译后的 JS
```

**修复效果：**
- ✅ TypeScript 正确编译为 JavaScript
- ✅ 生产镜像只包含必要文件，体积更小
- ✅ 入口点指向正确的编译后文件
- ✅ Prisma Client 在两个阶段都正确生成

### 📋 部署前检查清单

在部署到 VPS 前，请确认以下内容：

- [ ] 后端 Dockerfile 包含 `AS builder` 和 `AS runner` 两个阶段
- [ ] 后端 Dockerfile 的 CMD 是 `["node", "dist/app.js"]`
- [ ] 前端 next.config.js 包含 `output: 'standalone'`
- [ ] 项目根目录有 .env 文件（从 .env.example 复制并填写真实值）
- [ ] docker-compose.yml 正确引用环境变量
- [ ] PostgreSQL 数据库已创建并可连接

### 🎯 验证部署成功的标志

部署成功后，应该看到：

```bash
# 1. 容器正常运行
$ docker ps
CONTAINER ID   IMAGE                      STATUS
abc123         toolibox/frontend-main     Up 2 minutes
def456         toolibox/backend-main      Up 2 minutes

# 2. 后端健康检查通过
$ curl http://localhost:8000/api/health
{"success":true,"message":"Server is running","timestamp":"..."}

# 3. 前端可访问
$ curl http://localhost:3000
<!DOCTYPE html>...

# 4. 后端日志显示成功启动
$ docker logs toolibox-backend-main
✅ Server is running on port 8000
📝 API: http://localhost:8000/api
💚 Health check: http://localhost:8000/api/health
```

## 十一、联系与支持

- VPS IP: 82.29.67.124
- SSH 用户: toolibox
- 项目目录: /var/www/toolibox
- Nginx 配置: /etc/nginx/sites-available/toolibox.conf

---

**部署完成后，Main 应用将作为 VPS 微前端架构的核心入口，为用户提供导航和工具展示功能。**

**重要提示：** 本文档已更新，包含 2025-12-18 的关键修复。如果您使用的是旧版本代码，请确保更新 `backend/Dockerfile` 文件。

---

## 十二、微前端架构升级记录（2025-12-20）

### 🎯 升级目标

将 Toolibox 从单体应用升级为微前端架构：
- 每个工具类别（PDF/Image/Text）作为独立容器运行
- Main 应用作为导航入口，链接到各个微前端服务
- 各服务独立部署、独立扩展

### 📁 新增目录结构

```
toolibox-2.0/
├── frontend/
│   ├── main/                 # 主应用（导航入口）
│   └── pdf-tools/            # PDF 工具微前端 ✅ 已完成
│       ├── src/
│       │   ├── app/
│       │   │   └── [locale]/
│       │   │       ├── page.tsx           # 首页
│       │   │       ├── merge-pdf/page.tsx # 合并 PDF
│       │   │       ├── split-pdf/page.tsx # 拆分 PDF
│       │   │       └── compress-pdf/page.tsx
│       │   ├── components/
│       │   │   └── layout/
│       │   │       ├── Header.tsx
│       │   │       ├── Footer.tsx
│       │   │       └── ToolCard.tsx
│       │   ├── locales/
│       │   │   ├── en.json
│       │   │   └── zh.json
│       │   ├── i18n.ts
│       │   └── middleware.ts
│       ├── public/
│       ├── next.config.js
│       ├── package.json
│       ├── Dockerfile
│       └── tailwind.config.js
```

### 🔧 关键技术实现

#### 1. Next.js basePath 配置

PDF Tools 运行在 `/pdf-tools` 子路径下：

```javascript
// frontend/pdf-tools/next.config.js
const nextConfig = {
  basePath: '/pdf-tools',
  output: 'standalone',
  async redirects() {
    return [
      { source: '/', destination: '/en', permanent: false },
    ];
  },
};
```

#### 2. 国际化路由配置

使用 `localePrefix: 'always'` 确保所有 URL 都包含语言前缀：

```typescript
// frontend/pdf-tools/src/middleware.ts
export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always'  // 避免重定向循环
});
```

#### 3. URL 路由设计

| 路径 | 说明 |
|------|------|
| `/pdf-tools` | 307 重定向到 `/pdf-tools/en` |
| `/pdf-tools/en` | PDF 工具首页（英文） |
| `/pdf-tools/zh` | PDF 工具首页（中文） |
| `/pdf-tools/en/merge-pdf` | 合并 PDF 工具（英文） |
| `/pdf-tools/zh/merge-pdf` | 合并 PDF 工具（中文） |

#### 4. Main 应用路由更新

```typescript
// frontend/main/src/config/toolRoutes.ts
export const DEPLOYED_MICROSERVICES: string[] = [
  'pdf-tools',  // PDF 工具微前端已部署
  // 'image-tools',  // 待部署
  // 'text-tools',   // 待部署
];

export function getToolUrl(categoryId: string, slug: string, locale: string = 'en'): string {
  const basePath = CATEGORY_ROUTES[categoryId];

  if (basePath && isMicroserviceDeployed(categoryId)) {
    return `${basePath}/${locale}/${slug}`;  // 微前端路径
  }

  return `/${locale}/${categoryId}/${slug}`;  // 本地路由
}
```

#### 5. Docker Compose 配置

```yaml
# docker-compose.yml 新增服务
frontend-pdf-tools:
  build:
    context: ./frontend/pdf-tools
    dockerfile: Dockerfile
  image: toolibox/frontend-pdf-tools
  restart: always
  ports:
    - "3001:3001"
```

### 🚀 本地测试验证

#### 启动所有服务

```bash
docker compose up -d
```

#### 容器状态

| 容器名 | 端口 | 状态 |
|--------|------|------|
| toolibox-frontend-main | 3000 | ✅ Running |
| toolibox-frontend-pdf-tools | 3001 | ✅ Running |
| toolibox-backend-main | 8000 | ✅ Running |

#### 测试 URL

```bash
# Main 首页
curl http://localhost:3000/  # 200 OK

# PDF Tools 首页
curl http://localhost:3001/pdf-tools/en  # 200 OK

# 合并 PDF 工具
curl http://localhost:3001/pdf-tools/en/merge-pdf  # 200 OK

# 拆分 PDF 工具
curl http://localhost:3001/pdf-tools/zh/split-pdf  # 200 OK
```

### 📝 已实现的 PDF 工具

| 工具 | 路径 | 功能 | 状态 |
|------|------|------|------|
| 合并 PDF | `/pdf-tools/{locale}/merge-pdf` | 多个 PDF 合并为一个 | ✅ 可用 |
| 拆分 PDF | `/pdf-tools/{locale}/split-pdf` | 按页拆分或提取页面 | ✅ 可用 |
| 压缩 PDF | `/pdf-tools/{locale}/compress-pdf` | 减小 PDF 文件大小 | 🔲 待实现 |

### 🔗 Main 与微前端的集成

Main 首页的 PDF 工具链接已更新：

- **Merge PDF** → `href="/pdf-tools/en/merge-pdf"` （跳转到微前端）
- **Split PDF** → `href="/pdf-tools/en/split-pdf"` （跳转到微前端）
- **Compress PDF** → `href="/en/pdf-tools/compress-pdf"` （Coming Soon，本地路由）

### 🌐 VPS 部署 Nginx 配置

```nginx
# /etc/nginx/sites-available/toolibox.conf

# Main 应用
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# PDF Tools 微前端
location /pdf-tools/ {
    proxy_pass http://127.0.0.1:3001/pdf-tools/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# 后端 API
location /api/ {
    proxy_pass http://127.0.0.1:8000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 📋 后续待完成

1. **Image Tools 微前端**（端口 3002）
   - compress-image
   - resize-image
   - convert-image

2. **Text Tools 微前端**（端口 3003）
   - case-converter
   - word-counter
   - text-diff

3. **VPS 部署**
   - 上传 PDF Tools 代码
   - 构建 Docker 镜像
   - 更新 Nginx 配置
   - 验证生产环境

### 🔄 架构升级总结

```
升级前（单体应用）：
┌─────────────────────────────────────┐
│           Main App (3000)           │
│  ┌─────────┬─────────┬─────────┐   │
│  │PDF Tools│Img Tools│Txt Tools│   │
│  │(Coming) │(Coming) │(Coming) │   │
│  └─────────┴─────────┴─────────┘   │
└─────────────────────────────────────┘

升级后（微前端架构）：
┌─────────────────────────────────────┐
│        Main App (3000) - 导航        │
└───────────┬───────────┬─────────────┘
            │           │
    ┌───────▼───┐ ┌─────▼─────┐ ┌─────────┐
    │ PDF Tools │ │Img Tools  │ │Txt Tools│
    │   (3001)  │ │  (3002)   │ │ (3003)  │
    │  ✅ 已完成 │ │ ⏳ 待开发  │ │ ⏳ 待开发│
    └───────────┘ └───────────┘ └─────────┘
```

---

**更新日期：** 2025-12-20
**更新内容：** 完成 PDF Tools 微前端架构升级，包含合并 PDF 和拆分 PDF 功能

---

## 十三、路由与语言切换问题修复（2025-12-20）

### 🐛 发现的问题

在完成微前端架构升级后，发现以下路由问题：

#### 问题 1：PDF Tools 语言切换路径重复

**症状**：切换语言后 URL 变成 `/pdf-tools/zh/pdf-tools/merge-pdf`

**原因**：`localePrefix: 'always'` 配置下，Next.js 会自动添加 basePath，代码中不应再手动添加

**修复文件**：
- `frontend/pdf-tools/src/components/layout/Header.tsx`
- `frontend/pdf-tools/src/components/ToolCard.tsx`

```typescript
// ❌ 修复前（Header.tsx）
const finalPath = newLocale === 'en'
  ? `/pdf-tools${newPath}`
  : `/pdf-tools/${newLocale}${newPath}`;

// ✅ 修复后
const finalPath = `/${newLocale}${newPath}`;
```

```typescript
// ❌ 修复前（ToolCard.tsx）
const basePath = locale === 'en' ? '' : `/${locale}`;
return `/pdf-tools${basePath}/${tool.slug}`;

// ✅ 修复后
return `/${locale}/${tool.slug}`;
```

#### 问题 2：Main 应用工具链接重复 locale

**症状**：Image/Text 工具链接变成 `/zh/zh/image-tools/...`

**原因**：`getToolUrl()` 已返回包含 locale 的路径，外层又用 `getLocalizedPath()` 包装

**修复文件**：
- `frontend/main/src/components/layout/Header.tsx`
- `frontend/main/src/components/home/PopularTools.tsx`
- `frontend/main/src/app/[locale]/[categoryId]/page.tsx`

```typescript
// ❌ 修复前
href={getLocalizedPath(getToolPath(tool))}

// ✅ 修复后
href={getToolPath(tool)}
```

#### 问题 3：微前端链接使用错误的组件

**症状**：点击 PDF 工具链接时页面不完全刷新

**原因**：微前端是独立的 Next.js 应用，需要完整页面跳转

**修复**：已部署的微前端工具使用 `<a>` 标签，未部署的使用 `<Link>`

```tsx
// ✅ PopularTools.tsx
if (isExternal) {
  return <a href={toolHref}>...</a>;  // 微前端用 <a>
}
return <Link href={toolHref}>...</Link>;  // 内部路由用 <Link>
```

#### 问题 4：Coming Soon 页面重定向错误

**症状**：已上线工具从 Coming Soon 页面重定向到错误路径

**修复文件**：`frontend/main/src/app/[locale]/[categoryId]/[slug]/page.tsx`

```typescript
// ❌ 修复前
const toolPath = locale === 'en' ? `/tools/${slug}` : `/${locale}/tools/${slug}`;

// ✅ 修复后
const toolPath = getToolUrl(category.id, slug, locale);
```

#### 问题 5：CORS 配置缺少 VPS IP

**修复文件**：`backend/src/middleware/cors.ts`

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://82.29.67.124',  // ✅ 新增
  'https://toolibox.com',
];
```

### 📋 修复后的文件清单

| 文件 | 修复内容 |
|------|----------|
| `frontend/pdf-tools/src/components/layout/Header.tsx` | 语言切换路径 |
| `frontend/pdf-tools/src/components/ToolCard.tsx` | 工具链接路径 |
| `frontend/pdf-tools/src/app/[locale]/compress-pdf/page.tsx` | 添加国际化 |
| `frontend/main/src/components/layout/Header.tsx` | 移除重复 locale |
| `frontend/main/src/components/home/PopularTools.tsx` | 微前端用 `<a>` |
| `frontend/main/src/app/[locale]/[categoryId]/page.tsx` | 工具链接路径 |
| `frontend/main/src/app/[locale]/[categoryId]/[slug]/page.tsx` | 重定向路径 |
| `backend/src/middleware/cors.ts` | 添加 VPS IP |

### ⚠️ 开发注意事项

#### basePath 与 localePrefix 的协作

当使用 `basePath: '/pdf-tools'` 和 `localePrefix: 'always'` 时：

1. **Next.js Link/router 会自动添加 basePath**
2. **代码中的路径不应包含 basePath**
3. **所有语言（包括默认语言 en）都需要 locale 前缀**

```
代码中写：         /${locale}/${slug}
Next.js 生成：     /pdf-tools/${locale}/${slug}
```

#### 微前端链接规则

```tsx
// 在 Main 应用中引用微前端
if (isMicroserviceDeployed(categoryId)) {
  // 微前端：使用 <a> 标签进行完整页面跳转
  return <a href={getToolUrl(categoryId, slug, locale)}>...</a>;
} else {
  // 内部路由：使用 <Link> 进行客户端导航
  return <Link href={path}>...</Link>;
}
```

### ✅ 验证测试

修复后的路由测试：

```bash
# 主站语言切换
http://localhost:3000/en → http://localhost:3000/zh  ✅

# PDF Tools 语言切换
http://localhost:3001/pdf-tools/en → http://localhost:3001/pdf-tools/zh  ✅

# PDF 工具页面语言切换
http://localhost:3001/pdf-tools/en/merge-pdf → http://localhost:3001/pdf-tools/zh/merge-pdf  ✅

# 从主站跳转到 PDF 工具
http://localhost:3000 → /pdf-tools/en/merge-pdf  ✅
```

---

**修复日期：** 2025-12-20
**修复内容：** 解决语言切换和微前端路由问题
