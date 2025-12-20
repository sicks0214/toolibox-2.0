import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolCard from '@/components/ToolCard';
import tools from '@/data/tools.json';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  const title = locale === 'en'
    ? 'PDF Tools - Free Online PDF Editor | Toolibox'
    : 'PDF 工具 - 免费在线 PDF 编辑器 | Toolibox';

  const description = locale === 'en'
    ? 'Free online PDF tools to merge, split, compress and convert PDF files. No signup required.'
    : '免费在线 PDF 工具，合并、拆分、压缩和转换 PDF 文件。无需注册。';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function PDFToolsHomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations('home');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-pdf py-16 px-6">
          <div className="mx-auto max-w-4xl text-center text-white">
            <span className="text-6xl mb-6 block">📄</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-neutral mb-8">
              {t('allTools')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
