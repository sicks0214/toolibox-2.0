'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href={getLocalizedPath('/about')}
              className="text-neutral hover:text-primary transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href={getLocalizedPath('/privacy')}
              className="text-neutral hover:text-primary transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href={getLocalizedPath('/terms')}
              className="text-neutral hover:text-primary transition-colors"
            >
              {t('terms')}
            </Link>
            <Link
              href={getLocalizedPath('/feedback')}
              className="text-neutral hover:text-primary transition-colors"
            >
              {t('feedback')}
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
