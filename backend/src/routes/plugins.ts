import { Router, Request, Response } from 'express';
import { loadPlugins, formatPluginForAPI, getPluginBySlug, Plugin } from '../plugin-loader';

const router = Router();

let plugins: Plugin[] = [];

export function initPlugins() {
  plugins = loadPlugins();
  return plugins;
}

// GET /api/plugins - 返回所有工具列表
router.get('/plugins', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'en';

  const formattedPlugins = plugins.map(p => formatPluginForAPI(p, lang));

  // 按分类分组
  const categories: Record<string, any[]> = {};
  for (const plugin of formattedPlugins) {
    if (!categories[plugin.category]) {
      categories[plugin.category] = [];
    }
    categories[plugin.category].push(plugin);
  }

  res.json({
    success: true,
    data: {
      plugins: formattedPlugins,
      categories
    }
  });
});

// GET /api/plugins/:slug - 返回单个工具配置
router.get('/plugins/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const lang = (req.query.lang as string) || 'en';

  const plugin = getPluginBySlug(plugins, slug);

  if (!plugin) {
    return res.status(404).json({
      success: false,
      message: 'Plugin not found'
    });
  }

  res.json({
    success: true,
    data: formatPluginForAPI(plugin, lang)
  });
});

export default router;
