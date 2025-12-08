import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  const t = useTranslations('about');

  const missions = [
    t('missions.0'),
    t('missions.1'),
    t('missions.2'),
    t('missions.3'),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral mb-8">{t('title')}</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-8">{t('intro')}</p>

            <h2 className="text-2xl font-semibold text-neutral mb-4">
              {t('mission')}
            </h2>
            <ul className="space-y-2 mb-8">
              {missions.map((mission, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-gray-700">{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
