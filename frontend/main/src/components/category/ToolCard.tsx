'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import categories from '@/data/categories.json';

interface ToolCardProps {
  slug: string;
  categoryId: string;
  icon: string;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  comingSoon?: boolean;
}

export default function ToolCard({ slug, categoryId, icon, name, description, comingSoon = true }: ToolCardProps) {
  const locale = useLocale();

  // Find the category slug
  const category = categories.find((c) => c.id === categoryId);
  const categorySlug = category?.slug || categoryId;

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  // If tool is ready (not coming soon), link to /tools/{slug}
  // Otherwise, link to /{category}/{slug} (coming soon page)
  const toolPath = comingSoon
    ? `/${categorySlug}/${slug}`
    : `/tools/${slug}`;

  return (
    <Link href={getLocalizedPath(toolPath)}>
      <div className="card p-5 h-full hover:border-primary border-2 border-transparent">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-neutral mb-2">
          {name[locale as 'en' | 'zh']}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {description[locale as 'en' | 'zh']}
        </p>
      </div>
    </Link>
  );
}
