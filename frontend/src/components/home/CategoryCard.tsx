'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  slug: string;
  icon: string;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  gradient: string;
  toolCount: number;
}

export default function CategoryCard({
  slug,
  icon,
  name,
  description,
  gradient,
  toolCount,
}: CategoryCardProps) {
  const locale = useLocale();
  const t = useTranslations('home.categories');

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  return (
    <Link href={getLocalizedPath(`/category/${slug}`)}>
      <div
        className="category-card relative overflow-hidden group"
        style={{ background: gradient }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-2xl font-bold mb-2">
              {name[locale as 'en' | 'zh']}
            </h3>
            <p className="text-white/90 mb-4">
              {description[locale as 'en' | 'zh']}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-white/80">
            {toolCount} {t('tools')}
          </span>
          <ArrowRight
            size={24}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
}
