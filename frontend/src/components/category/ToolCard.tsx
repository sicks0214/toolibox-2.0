'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

interface ToolCardProps {
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
}

export default function ToolCard({ slug, icon, name, description }: ToolCardProps) {
  const locale = useLocale();

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  return (
    <Link href={getLocalizedPath(`/tools/${slug}`)}>
      <div className="card p-6 h-full hover:border-primary border-2 border-transparent">
        <div className="text-3xl mb-4">{icon}</div>
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
