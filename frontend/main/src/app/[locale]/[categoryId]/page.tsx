import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { fetchPlugins, PluginData } from '@/lib/api';
import { categories, getCategoryById, getCategoryName, getCategoryDescription } from '@/config/categories';

interface CategoryPageProps {
  params: {
    categoryId: string;
    locale: string;
  };
}

export function generateStaticParams() {
  return categories.map((cat) => ({
    categoryId: cat.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categoryId, locale } = params;
  const category = getCategoryById(categoryId);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const baseUrl = 'https://toolibox.com';
  const canonicalUrl = `${baseUrl}/${locale}/${categoryId}`;
  const title = `${getCategoryName(category, locale)} - Toolibox`;
  const description = getCategoryDescription(category, locale);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${baseUrl}/en/${categoryId}`,
        'zh': `${baseUrl}/zh/${categoryId}`,
        'es': `${baseUrl}/es/${categoryId}`,
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
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const t = await getTranslations();
  const { categoryId, locale } = params;

  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  let categoryTools: PluginData[] = [];
  try {
    const response = await fetchPlugins(locale);
    if (response.success) {
      categoryTools = response.data.categories[category.apiCategory] || [];
    }
  } catch (error) {
    console.error('Failed to fetch plugins:', error);
  }

  const categoryName = getCategoryName(category, locale);
  const categoryDescription = getCategoryDescription(category, locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: t('category.breadcrumb.home'), href: '/' },
            { label: categoryName },
          ]}
        />

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold text-neutral mb-4">{categoryName}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{categoryDescription}</p>
        </div>

        <section>
          {categoryTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${categoryId}/${tool.slug}`}
                  className="card p-6 hover:border-primary border-2 border-transparent transition-all"
                >
                  <div className="text-4xl mb-3">{tool.icon}</div>
                  <h3 className="text-xl font-semibold text-neutral mb-2">{tool.title}</h3>
                  <p className="text-gray-600">{tool.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">
                {locale === 'zh' ? '暂无可用工具' : locale === 'es' ? 'No hay herramientas disponibles' : 'No tools available'}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
