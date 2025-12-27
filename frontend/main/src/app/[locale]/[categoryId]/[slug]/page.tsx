import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SchemaRenderer from '@/components/tool/SchemaRenderer';
import { fetchPlugin, PluginData } from '@/lib/api';

interface ToolPageProps {
  params: {
    categoryId: string;
    slug: string;
    locale: string;
  };
}

// 分类映射
const categoryMap: Record<string, string> = {
  'pdf-tools': 'pdf',
  'image-tools': 'image'
};

const categoryNames: Record<string, Record<string, string>> = {
  'pdf-tools': { en: 'PDF Tools', zh: 'PDF 工具', es: 'Herramientas PDF' },
  'image-tools': { en: 'Image Tools', zh: '图像工具', es: 'Herramientas de imagen' }
};

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { categoryId, slug, locale } = params;
  const baseUrl = 'https://toolibox.com';

  try {
    const response = await fetchPlugin(slug, locale);
    if (!response.success) {
      return { title: 'Tool Not Found' };
    }

    const plugin = response.data;
    const canonicalUrl = `${baseUrl}/${locale}/${categoryId}/${slug}`;

    return {
      title: `${plugin.title} - Toolibox`,
      description: plugin.description,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'en': `${baseUrl}/en/${categoryId}/${slug}`,
          'zh': `${baseUrl}/zh/${categoryId}/${slug}`,
          'es': `${baseUrl}/es/${categoryId}/${slug}`,
        }
      },
      openGraph: {
        title: plugin.title,
        description: plugin.description,
        url: canonicalUrl,
        siteName: 'Toolibox',
        locale: locale,
        type: 'website',
      },
    };
  } catch {
    return { title: 'Tool Not Found' };
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { categoryId, slug, locale } = params;

  let plugin: PluginData;

  try {
    const response = await fetchPlugin(slug, locale);
    if (!response.success) {
      notFound();
    }
    plugin = response.data;
  } catch {
    notFound();
  }

  const categoryName = categoryNames[categoryId]?.[locale] || categoryId;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: locale === 'zh' ? '首页' : locale === 'es' ? 'Inicio' : 'Home', href: `/${locale}` },
            { label: categoryName, href: `/${locale}/${categoryId}` },
            { label: plugin.title },
          ]}
        />

        <div className="max-w-4xl mx-auto">
          {/* 工具标题 */}
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">{plugin.icon}</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{plugin.h1 || plugin.title}</h1>
            <p className="text-lg text-gray-600">{plugin.description}</p>
            {plugin.subtitle && (
              <p className="text-md text-gray-500 mt-2">{plugin.subtitle}</p>
            )}
          </div>

          {/* 功能列表 */}
          {plugin.features && plugin.features.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {locale === 'zh' ? '功能特性' : locale === 'es' ? 'Características' : 'Features'}
              </h2>
              <ul className="space-y-2">
                {plugin.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 上传说明 */}
          {plugin.upload && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-gray-700">{plugin.upload}</p>
            </div>
          )}

          {/* 工具操作区 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <SchemaRenderer plugin={plugin} locale={locale} />
          </div>

          {/* 操作说明 */}
          {plugin.actions && plugin.actions.length > 0 && (
            <div className="bg-green-50 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {locale === 'zh' ? '操作步骤' : locale === 'es' ? 'Pasos' : 'Steps'}
              </h2>
              <ol className="space-y-2 list-decimal list-inside">
                {plugin.actions.map((action: string, index: number) => (
                  <li key={index} className="text-gray-700">{action}</li>
                ))}
              </ol>
            </div>
          )}

          {/* 反馈信息 */}
          {plugin.feedback && (
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-8">
              <p className="text-gray-700">{plugin.feedback}</p>
            </div>
          )}

          {/* FAQ 区域 */}
          {plugin.faq && plugin.faq.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'zh' ? '常见问题' : locale === 'es' ? 'Preguntas frecuentes' : 'FAQ'}
              </h2>
              <div className="space-y-4">
                {plugin.faq.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 使用场景 */}
          {plugin.useCases && plugin.useCases.length > 0 && (
            <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {locale === 'zh' ? '使用场景' : locale === 'es' ? 'Casos de uso' : 'Use Cases'}
              </h2>
              <ul className="space-y-2">
                {plugin.useCases.map((useCase: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span className="text-gray-700">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 使用方法 */}
          {plugin.howTo && plugin.howTo.length > 0 && (
            <div className="bg-teal-50 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {locale === 'zh' ? '使用方法' : locale === 'es' ? 'Cómo usar' : 'How To Use'}
              </h2>
              <ol className="space-y-2 list-decimal list-inside">
                {plugin.howTo.map((step: string, index: number) => (
                  <li key={index} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
