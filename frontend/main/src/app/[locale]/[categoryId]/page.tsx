import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { fetchPlugins, PluginData } from '@/lib/api';

interface CategoryPageProps {
  params: {
    categoryId: string;
    locale: string;
  };
}

// 分类元数据
const categoryMeta: Record<string, {
  name: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  apiCategory: string;
}> = {
  'pdf-tools': {
    name: { en: 'PDF Tools', zh: 'PDF 工具', es: 'Herramientas PDF' },
    description: {
      en: 'Merge, compress, split and convert PDF files',
      zh: '合并、压缩、拆分和转换 PDF 文件',
      es: 'Fusionar, comprimir, dividir y convertir archivos PDF'
    },
    icon: '📄',
    apiCategory: 'pdf'
  },
  'image-tools': {
    name: { en: 'Image Tools', zh: '图像工具', es: 'Herramientas de imagen' },
    description: {
      en: 'Resize, compress, convert images and remove background',
      zh: '调整尺寸、压缩、转换图像和去除背景',
      es: 'Redimensionar, comprimir, convertir imágenes y eliminar fondo'
    },
    icon: '🖼️',
    apiCategory: 'image'
  }
};

export function generateStaticParams() {
  return Object.keys(categoryMeta).map((categoryId) => ({
    categoryId,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const t = await getTranslations();
  const { categoryId: categorySlug, locale } = params;

  const category = categoryMeta[categorySlug];

  if (!category) {
    notFound();
  }

  // 从 API 获取插件
  let categoryTools: PluginData[] = [];
  try {
    const response = await fetchPlugins(locale);
    if (response.success) {
      categoryTools = response.data.categories[category.apiCategory] || [];
    }
  } catch (error) {
    console.error('Failed to fetch plugins:', error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: t('category.breadcrumb.home'), href: '/' },
            { label: category.name[locale as 'en' | 'zh'] || category.name['en'] },
          ]}
        />

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold text-neutral mb-4">
            {category.name[locale as 'en' | 'zh'] || category.name['en']}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {category.description[locale as 'en' | 'zh'] || category.description['en']}
          </p>
        </div>

        <section>
          {categoryTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${categorySlug}/${tool.slug}`}
                  className="card p-6 hover:border-primary border-2 border-transparent transition-all"
                >
                  <div className="text-4xl mb-3">{tool.icon}</div>
                  <h3 className="text-xl font-semibold text-neutral mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600">
                    {tool.description}
                  </p>
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
