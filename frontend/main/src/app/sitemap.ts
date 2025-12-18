import { MetadataRoute } from 'next';
import categories from '@/data/categories.json';
import tools from '@/data/tools.json';
import toolGroups from '@/data/toolGroups.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolibox.com';
  const locales = ['en', 'zh'];

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

  // Tool group pages for each locale
  const groupPages = locales.flatMap((locale) =>
    toolGroups.map((group) => {
      const category = categories.find((c) => c.id === group.categoryId);
      return {
        url: locale === 'en'
          ? `${baseUrl}/${category?.slug}/${group.slug}`
          : `${baseUrl}/${locale}/${category?.slug}/${group.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    })
  );

  // Tool pages for each locale
  const toolPages = locales.flatMap((locale) =>
    tools.map((tool) => {
      const category = categories.find((c) => c.id === tool.categoryId);
      return {
        url: locale === 'en'
          ? `${baseUrl}/${category?.slug}/${tool.slug}`
          : `${baseUrl}/${locale}/${category?.slug}/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    })
  );

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
    ...groupPages,
    ...toolPages,
    ...staticPages,
  ];
}
