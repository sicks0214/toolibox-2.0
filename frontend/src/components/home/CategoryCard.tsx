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
        className="category-card relative overflow-hidden group !p-6 min-h-[280px] flex flex-col"
        style={{ background: gradient }}
      >
        <div className="flex-1 flex flex-col">
          <div className="text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2 line-clamp-2">
              {name[locale as 'en' | 'zh']}
            </h3>
            <p className="text-white/90 text-sm mb-4 line-clamp-2">
              {description[locale as 'en' | 'zh']}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/20">
          <span className="text-sm text-white/80">
            {toolCount} {t('tools')}
          </span>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
}
