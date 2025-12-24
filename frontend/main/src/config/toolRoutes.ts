/**
 * 工具路由配置
 * 用于将工具链接映射到VPS微前端架构的子路径
 */

// 已部署的微前端服务列表
export const DEPLOYED_MICROSERVICES: string[] = [
  // 'pdf-tools',  // 未部署
  // 'image-tools',  // 未部署
];

// 工具类别到微前端子路径的映射
export const CATEGORY_ROUTES: Record<string, string> = {
  'pdf-tools': '/pdf-tools',
  'image-tools': '/image-tools',
  'text-tools': '/text-tools',
  'color-tools': '/color-tools',
  'ai-tools': '/ai-tools',
};

/**
 * 检查分类是否已部署微前端服务
 */
export function isMicroserviceDeployed(categoryId: string): boolean {
  return DEPLOYED_MICROSERVICES.includes(categoryId);
}

/**
 * 获取工具的完整URL
 * @param categoryId 工具类别ID
 * @param slug 工具slug
 * @param locale 语言
 * @returns 工具的完整URL
 */
export function getToolUrl(categoryId: string, slug: string, locale: string = 'en'): string {
  const basePath = CATEGORY_ROUTES[categoryId];

  // 如果该类别有独立的微前端服务且已部署，返回微前端子路径
  if (basePath && isMicroserviceDeployed(categoryId)) {
    // 微前端服务使用 localePrefix: 'always'，所有路径都需要语言前缀
    return `${basePath}/${locale}/${slug}`;
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

  // 如果该类别有独立的微前端服务且已部署，返回子路径
  if (basePath && isMicroserviceDeployed(categoryId)) {
    return `${basePath}/${locale}`;
  }

  // 否则返回当前应用的路由
  return `/${locale}/${categoryId}`;
}
