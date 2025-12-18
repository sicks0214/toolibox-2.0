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

### 2. 准备环境变量

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

# 构建前端镜像
docker build -t toolibox/frontend-main ./frontend/main

# 构建后端镜像
docker build -t toolibox/backend-main ./backend
```

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

## 十、联系与支持

- VPS IP: 82.29.67.124
- SSH 用户: toolibox
- 项目目录: /var/www/toolibox
- Nginx 配置: /etc/nginx/sites-available/toolibox.conf

---

**部署完成后，Main 应用将作为 VPS 微前端架构的核心入口，为用户提供导航和工具展示功能。**
