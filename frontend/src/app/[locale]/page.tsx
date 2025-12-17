import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import PopularTools from '@/components/home/PopularTools';
import CategoryCard from '@/components/home/CategoryCard';
import UseCases from '@/components/home/UseCases';
import WhyToolibox from '@/components/home/WhyToolibox';
import categories from '@/data/categories.json';
import tools from '@/data/tools.json';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const baseUrl = 'https://toolibox.com';
  const canonicalUrl = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`;

  const title = locale === 'en'
    ? 'Free Online Tools for PDF, Image, and More - Toolibox'
    : '免费在线工具 - PDF、图片等 - Toolibox';

  const description = locale === 'en'
    ? 'Simple, fast, and secure online tools to solve everyday tasks. Free PDF tools, image tools, text tools, and more.'
    : '简单、快速、安全的在线工具，解决日常任务。免费 PDF 工具、图片工具、文本工具等。';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Toolibox',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations('home');

  const categoriesWithCount = categories.map((category) => ({
    ...category,
    toolCount: tools.filter((tool) => tool.categoryId === category.id).length,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <PopularTools tools={tools} />

        <section className="container mx-auto px-12 md:px-16 lg:px-24 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('categories.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithCount
              .sort((a, b) => a.order - b.order)
              .map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))}
          </div>
        </section>

        <UseCases />
        <WhyToolibox />
      </main>
      <Footer />
    </div>
  );
}
