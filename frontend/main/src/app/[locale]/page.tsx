import { getTranslations, getLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import PopularTools from '@/components/home/PopularTools';
import CategorySection from '@/components/home/CategorySection';
import UseCases from '@/components/home/UseCases';
import WhyToolibox from '@/components/home/WhyToolibox';
import SearchTools from '@/components/home/SearchTools';
import { fetchPlugins, PluginData } from '@/lib/api';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const baseUrl = 'https://toolibox.com';
  const canonicalUrl = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`;

  const title = locale === 'en'
    ? 'Free Online Tools for PDF, Image, and More - Toolibox'
    : locale === 'zh'
    ? '免费在线工具 - PDF、图片等 - Toolibox'
    : 'Herramientas en línea gratuitas para PDF, imágenes y más - Toolibox';

  const description = locale === 'en'
    ? 'Simple, fast, and secure online tools to solve everyday tasks. Free PDF tools, image tools, text tools, and more.'
    : locale === 'zh'
    ? '简单、快速、安全的在线工具，解决日常任务。免费 PDF 工具、图片工具、文本工具等。'
    : 'Herramientas en línea simples, rápidas y seguras para resolver tareas cotidianas.';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': baseUrl,
        'zh': `${baseUrl}/zh`,
        'es': `${baseUrl}/es`,
      }
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

// 分类元数据
const categoryMeta: Record<string, { name: Record<string, string>; gradient: string }> = {
  pdf: {
    name: { en: 'PDF Tools', zh: 'PDF 工具', es: 'Herramientas PDF' },
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)'
  },
  image: {
    name: { en: 'Image Tools', zh: '图像工具', es: 'Herramientas de imagen' },
    gradient: 'linear-gradient(135deg, #51CF66 0%, #2F9E44 100%)'
  }
};

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('home');
  const locale = params.locale || 'en';

  let plugins: PluginData[] = [];
  let categories: Record<string, PluginData[]> = {};

  try {
    const response = await fetchPlugins(locale);
    if (response.success) {
      plugins = response.data.plugins;
      categories = response.data.categories;
    }
  } catch (error) {
    console.error('Failed to fetch plugins:', error);
  }

  // 获取热门工具
  const popularTools = plugins.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />

        {/* 搜索区域 */}
        <SearchTools plugins={plugins} locale={locale} />

        <PopularTools tools={popularTools} locale={locale} />

        <section className="container mx-auto px-12 md:px-16 lg:px-24 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('categories.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="space-y-12">
            {Object.entries(categories).map(([category, tools]) => (
              <CategorySection
                key={category}
                category={category}
                categoryName={categoryMeta[category]?.name[locale] || category}
                gradient={categoryMeta[category]?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                tools={tools}
                locale={locale}
              />
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
