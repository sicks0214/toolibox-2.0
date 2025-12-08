'use client';

import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('home.hero');

  return (
    <div className="bg-gradient-to-br from-surface to-white py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <span className="text-6xl">🛠️</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          {t('subtitle')}
        </p>
        <p className="text-lg text-gray-500">
          {t('description')}
        </p>
      </div>
    </div>
  );
}
