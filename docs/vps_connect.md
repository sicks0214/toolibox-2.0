# 网站部署系统接入指南（阶段 2）

## 1. 目标

将前后端分离的多站点系统接入到已初始化的 VPS 环境中。

## 2. 目录结构规范

    /var/www/
    ├── site1/
    │   ├── frontend/   # 静态文件
    │   └── backend/    # Node 后端服务(监听 127.0.0.1:3001)
    ├── site2/
    │   ├── frontend/
    │   └── backend/
    └── siteN/
        ├── frontend/
        └── backend/

------------------------------------------------------------------------

## 3. 后端接入流程

### 3.1 上传后端代码

``` bash
mkdir -p /var/www/site1/backend
scp -r ./backend/* user@server:/var/www/site1/backend/
```

### 3.2 安装依赖

``` bash
cd /var/www/site1/backend
npm install --production
```

### 3.3 配置环境变量

建立：

    /var/www/site1/backend/.env.production

### 3.4 使用 PM2 启动后端

``` bash
pm2 start npm --name site1 -- run start
pm2 save
```

------------------------------------------------------------------------

## 4. 前端接入流程

### 4.1 上传构建后的静态文件

``` bash
mkdir -p /var/www/site1/frontend
scp -r ./dist/* user@server:/var/www/site1/frontend/
```

------------------------------------------------------------------------

## 5. 配置 Nginx 站点

文件路径：

    /etc/nginx/sites-enabled/site1.conf

示例：

    server {
        server_name site1.com;
        root /var/www/site1/frontend;

        location /api/ {
            proxy_pass http://127.0.0.1:3001;
        }
    }

启用并重启：

``` bash
sudo nginx -t
sudo systemctl restart nginx
```

------------------------------------------------------------------------

## 6. 验证系统接入

### 前端访问：

    https://site1.com

### 后端访问 API：

    https://site1.com/api/test

------------------------------------------------------------------------

# 系统接入完成

可以开始部署更多站点或添加安全增强。
