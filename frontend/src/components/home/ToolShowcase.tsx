'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import categories from '@/data/categories.json';

interface Tool {
  id: string;
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

interface ToolShowcaseProps {
  categoryId: string;
  tools: Tool[];
  maxItems?: number;
}

export default function ToolShowcase({
  categoryId,
  tools,
  maxItems = 6,
}: ToolShowcaseProps) {
  const locale = useLocale();
  const t = useTranslations('home');

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  // Find category info
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;

  // Filter tools for this category and limit
  const displayTools = tools
    .filter((tool) => tool.categoryId === categoryId)
    .slice(0, maxItems);

  if (displayTools.length === 0) return null;

  return (
    <section className="container mx-auto px-12 md:px-16 lg:px-24 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <h2 className="text-2xl font-bold text-neutral">
            {category.name[locale as 'en' | 'zh']}
          </h2>
        </div>
        <Link
          href={getLocalizedPath(`/category/${category.slug}`)}
          className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
        >
          {t('seeAll')}
          <ArrowRight size={20} />
        </Link>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTools.map((tool) => (
          <Link
            key={tool.id}
            href={getLocalizedPath(`/${category.slug}/${tool.slug}`)}
            className="group"
          >
            <div className="card p-6 h-full flex flex-col hover:border-primary border-2 border-transparent transition-all">
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">{tool.icon}</div>

              {/* Title */}
              <h3 className="text-base font-semibold text-neutral mb-2 text-center line-clamp-2 min-h-[3rem]">
                {tool.name[locale as 'en' | 'zh']}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 flex-1 text-center line-clamp-3">
                {tool.description[locale as 'en' | 'zh']}
              </p>

              {/* Open Button */}
              <div className="flex items-center justify-center">
                <span className="text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t('open')}
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
