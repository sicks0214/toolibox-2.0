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

        {/* Search Box */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
            <div className="pl-6 pr-3 py-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 py-4 px-2 text-base outline-none text-gray-700"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-4 rounded-full mr-1 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
