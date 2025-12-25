import { MetadataRoute } from 'next';

// 分类元数据 - sitemap 需要静态生成，所以保留基本分类信息
const categories = [
  { slug: 'pdf-tools', apiCategory: 'pdf' },
  { slug: 'image-tools', apiCategory: 'image' }
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://toolibox.com';
  const locales = ['en', 'zh', 'es'];

  // Homepage for each locale
  const homepages = locales.map((locale) => ({
    url: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Category pages for each locale
  const categoryPages = locales.flatMap((locale) =>
    categories.map((category) => ({
      url: locale === 'en'
        ? `${baseUrl}/${category.slug}`
        : `${baseUrl}/${locale}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // 从 API 获取工具列表
  let toolPages: MetadataRoute.Sitemap = [];
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_BASE_URL}/api/plugins?lang=en`);
    const data = await response.json();

    if (data.success) {
      const plugins = data.data.plugins;

      toolPages = locales.flatMap((locale) =>
        plugins.map((plugin: { slug: string; category: string }) => {
          const category = categories.find(c => c.apiCategory === plugin.category);
          const categorySlug = category?.slug || `${plugin.category}-tools`;
          return {
            url: locale === 'en'
              ? `${baseUrl}/${categorySlug}/${plugin.slug}`
              : `${baseUrl}/${locale}/${categorySlug}/${plugin.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          };
        })
      );
    }
  } catch (error) {
    console.error('Failed to fetch plugins for sitemap:', error);
  }

  // Static pages for each locale
  const staticPages = locales.flatMap((locale) =>
    ['about', 'privacy', 'terms', 'feedback'].map((page) => ({
      url: locale === 'en'
        ? `${baseUrl}/${page}`
        : `${baseUrl}/${locale}/${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  );

  return [
    ...homepages,
    ...categoryPages,
    ...toolPages,
    ...staticPages,
  ];
}
