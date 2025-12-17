import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  const t = useTranslations('terms');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral mb-4">{t('title')}</h1>
          <p className="text-gray-500 mb-8">
            {t('lastUpdated', { date: '2025-12-08' })}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-neutral mb-3">
                {t('sections.acceptance.title')}
              </h2>
              <p className="text-gray-700">{t('sections.acceptance.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral mb-3">
                {t('sections.license.title')}
              </h2>
              <p className="text-gray-700">{t('sections.license.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral mb-3">
                {t('sections.disclaimer.title')}
              </h2>
              <p className="text-gray-700">{t('sections.disclaimer.content')}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
