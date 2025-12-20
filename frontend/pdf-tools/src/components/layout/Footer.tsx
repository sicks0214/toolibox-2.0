'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">{t('copyright')}</p>
          <a
            href="/"
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            {t('backToMain')} →
          </a>
        </div>
      </div>
    </footer>
  );
}
