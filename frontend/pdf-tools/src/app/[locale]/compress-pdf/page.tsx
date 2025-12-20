'use client';

import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CompressPDFPage() {
  const t = useTranslations('tools.compressPdf');
  const locale = useLocale();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-6xl mb-6 block">🗜️</span>
          <h1 className="text-3xl font-bold text-neutral mb-4">{t('title')}</h1>
          <p className="text-gray-600 mb-8">
            {locale === 'en'
              ? 'This tool is coming soon. Stay tuned!'
              : '此工具即将上线，敬请期待！'}
          </p>
          <div className="inline-block px-6 py-3 bg-gray-100 text-gray-500 rounded-lg">
            {locale === 'en' ? 'Coming Soon' : '即将上线'}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
