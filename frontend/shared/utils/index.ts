// Utility functions shared across all applications

/**
 * Get the URL for a tool category
 */
export function getCategoryUrl(slug: string): string {
  const urlMap: Record<string, string> = {
    'pdf-tools': '/pdf-tools',
    'image-tools': '/image-tools',
    'text-tools': '/text-tools',
    'color-tools': '/color-tools',
    'ai-tools': '/ai-tools',
  };
  return urlMap[slug] || '/';
}

/**
 * Get the URL for a specific tool
 */
export function getToolUrl(categorySlug: string, toolSlug: string): string {
  const baseUrl = getCategoryUrl(categorySlug);
  return `${baseUrl}/${toolSlug}`;
}

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US');
}
