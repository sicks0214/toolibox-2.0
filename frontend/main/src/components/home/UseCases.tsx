'use client';

import { useTranslations } from 'next-intl';
import { Printer, Mail, Share2, Briefcase } from 'lucide-react';

export default function UseCases() {
  const t = useTranslations('home.useCases');

  const cases = [
    { icon: Printer, key: 'printing' },
    { icon: Mail, key: 'email' },
    { icon: Share2, key: 'social' },
    { icon: Briefcase, key: 'office' },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-12 md:px-16 lg:px-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t(`${key}.title`)}
              </h3>
              <p className="text-sm text-gray-600">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
