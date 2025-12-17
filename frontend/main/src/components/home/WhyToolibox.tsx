'use client';

import { useTranslations } from 'next-intl';
import { DollarSign, UserX, Shield, Zap } from 'lucide-react';

export default function WhyToolibox() {
  const t = useTranslations('home.whyToolibox');

  const features = [
    { icon: DollarSign, key: 'free' },
    { icon: UserX, key: 'noSignup' },
    { icon: Shield, key: 'secure' },
    { icon: Zap, key: 'fast' },
  ];

  return (
    <section className="container mx-auto px-12 md:px-16 lg:px-24 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon: Icon, key }) => (
          <div key={key} className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl mb-4 shadow-lg">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t(`${key}.title`)}
            </h3>
            <p className="text-gray-600">
              {t(`${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
