import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ToolCard from '@/components/category/ToolCard';
import categories from '@/data/categories.json';
import tools from '@/data/tools.json';

interface CategoryPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const t = useTranslations();
  const { slug, locale } = params;

  // 查找类目
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // 查找该类目下的所有工具
  const categoryTools = tools.filter((tool) => tool.categoryId === category.id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-2 md:px-3 lg:px-4 py-8 max-w-6xl">
        <Breadcrumb
          items={[
            { label: t('category.breadcrumb.home'), href: '/' },
            { label: category.name[locale as 'en' | 'zh'] },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-4xl">{category.icon}</span>
            <h1 className="text-3xl font-bold text-neutral">
              {category.name[locale as 'en' | 'zh']}
            </h1>
          </div>
          <p className="text-gray-600">
            {t('category.description', { count: categoryTools.length })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
