'use client';

import { useTranslations } from 'next-intl';
import SearchBox from './SearchBox';

export default function Hero() {
  const t = useTranslations('home.hero');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <span className="text-6xl">🛠️</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <SearchBox />
      </div>
    </div>
  );
}
