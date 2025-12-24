import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { upload, imageUpload } from './middleware/upload';
import feedbackRoutes from './routes/feedback';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import simplifyRoutes from './routes/simplify';
import pluginsRoutes, { initPlugins } from './routes/plugins';
import { startBackupCron } from './services/backupCron';
import { Plugin } from './plugin-loader';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// 加载插件
const plugins = initPlugins();

// 自动注册插件路由
function registerPluginRoutes(plugins: Plugin[]) {
  for (const plugin of plugins) {
    if (!plugin.handler) continue;

    const { category, slug } = plugin.config;
    const routePath = `/api/${category}/${slug}`;

    // 根据 schema 决定上传类型
    const isMultiple = plugin.schema?.upload?.multiple;
    const fileTypes = plugin.schema?.upload?.types || [];
    const isPdf = fileTypes.some(t => t === 'pdf' || t.includes('pdf'));

    if (isMultiple) {
      app.post(routePath, upload.array('files', 20), plugin.handler);
    } else if (isPdf) {
      app.post(routePath, upload.single('file'), plugin.handler);
    } else {
      app.post(routePath, imageUpload.single('file'), plugin.handler);
    }

    console.log(`📌 Registered route: POST ${routePath}`);
  }
}

registerPluginRoutes(plugins);

// 静态路由
app.use('/api', pluginsRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', simplifyRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📝 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 Plugins API: http://localhost:${PORT}/api/plugins`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`📦 Loaded ${plugins.length} plugins`);

  if (process.env.NODE_ENV === 'production') {
    startBackupCron();
  } else {
    console.log('[Dev Mode] Backup cron job is disabled in development');
  }
});

export default app;
