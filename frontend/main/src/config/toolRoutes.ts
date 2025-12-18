/**
 * 工具路由配置
 * 用于将工具链接映射到VPS微前端架构的子路径
 */

// 工具类别到微前端子路径的映射
export const CATEGORY_ROUTES: Record<string, string> = {
  'pdf-tools': '/pdf-tools',
  'image-tools': '/image-tools',
  'text-tools': '/text-tools',
  'color-tools': '/color-tools',
  'ai-tools': '/ai-tools',
};

/**
 * 获取工具的完整URL
 * @param categoryId 工具类别ID
 * @param slug 工具slug
 * @param locale 语言
 * @returns 工具的完整URL
 */
export function getToolUrl(categoryId: string, slug: string, locale: string = 'en'): string {
  const basePath = CATEGORY_ROUTES[categoryId];

  // 如果该类别有独立的微前端服务，返回子路径
  if (basePath) {
    return `${basePath}/${slug}`;
  }

  // 否则返回当前应用的路由（用于未部署的工具）
  return `/${locale}/${categoryId}/${slug}`;
}

/**
 * 获取分类页面URL
 * @param categoryId 工具类别ID
 * @param locale 语言
 * @returns 分类页面URL
 */
export function getCategoryUrl(categoryId: string, locale: string = 'en'): string {
  const basePath = CATEGORY_ROUTES[categoryId];

  // 如果该类别有独立的微前端服务，返回子路径
  if (basePath) {
    return basePath;
  }

  // 否则返回当前应用的路由
  return `/${locale}/${categoryId}`;
}
