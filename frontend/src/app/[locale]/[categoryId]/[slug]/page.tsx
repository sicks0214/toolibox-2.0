import { notFound, redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import categories from '@/data/categories.json';
import tools from '@/data/tools.json';
import toolGroups from '@/data/toolGroups.json';

interface ToolPageProps {
  params: {
    categoryId: string;
    slug: string;
    locale: string;
  };
}

export function generateStaticParams() {
  const params = [];

  // Add all tool groups
  toolGroups.forEach((group) => {
    const category = categories.find((c) => c.id === group.categoryId);
    if (category) {
      params.push({
        categoryId: category.slug,
        slug: group.slug,
      });
    }
  });

  // Add all ungrouped tools
  tools.filter((t) => !t.groupId).forEach((tool) => {
    const category = categories.find((c) => c.id === tool.categoryId);
    if (category) {
      params.push({
        categoryId: category.slug,
        slug: tool.slug,
      });
    }
  });

  return params;
}

export default function ToolPage({ params }: ToolPageProps) {
  const t = useTranslations();
  const { categoryId: categorySlug, slug, locale } = params;

  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  // Try to find as tool group first
  const group = toolGroups.find(
    (g) => g.slug === slug && g.categoryId === category.id
  );

  if (group) {
    // This is a GROUP page
    const groupTools = tools.filter((t) => t.groupId === group.id);

    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: t('category.breadcrumb.home'), href: '/' },
              {
                label: category.name[locale as 'en' | 'zh'],
                href: `/${category.slug}`,
              },
              { label: group.name[locale as 'en' | 'zh'] },
            ]}
          />

          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{group.icon}</div>
            <h1 className="text-4xl font-bold text-neutral mb-4">
              {group.name[locale as 'en' | 'zh']}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {group.description[locale as 'en' | 'zh']}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupTools.map((tool) => (
              <Link
                key={tool.id}
                href={getLocalizedPath(
                  `/${category.slug}/${group.slug}/${tool.slug}`
                )}
                className="card p-6 hover:border-primary border-2 border-transparent transition-all"
              >
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="text-xl font-semibold text-neutral mb-2">
                  {tool.name[locale as 'en' | 'zh']}
                </h3>
                <p className="text-gray-600">
                  {tool.description[locale as 'en' | 'zh']}
                </p>
                {tool.comingSoon && (
                  <span className="inline-block mt-3 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
                    {t('home.popularTools.comingSoon')}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // This is a TOOL page (ungrouped)
  const tool = tools.find(
    (t) => t.slug === slug && t.categoryId === category.id && !t.groupId
  );

  if (!tool) {
    notFound();
  }

  // 如果工具已上线（comingSoon: false），重定向到实际工具页面
  if (!tool.comingSoon) {
    const toolPath = locale === 'en' ? `/tools/${slug}` : `/${locale}/tools/${slug}`;
    redirect(toolPath);
  }

  // 获取相关工具（同类目的其他工具，最多显示3个）
  const relatedTools = tools
    .filter((t) => t.categoryId === tool.categoryId && t.id !== tool.id)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: t('category.breadcrumb.home'), href: '/' },
            {
              label: category.name[locale as 'en' | 'zh'],
              href: `/${category.slug}`,
            },
            { label: tool.name[locale as 'en' | 'zh'] },
          ]}
        />

        <div className="max-w-3xl mx-auto text-center py-16">
          {/* Icon and Title */}
          <div className="text-6xl mb-6">{tool.icon}</div>
          <h1 className="text-3xl font-bold text-neutral mb-8">
            {tool.name[locale as 'en' | 'zh']}
          </h1>

          {/* Coming Soon Message */}
          <div className="bg-accent/10 border-2 border-accent rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-accent mb-4">
              🚧 {t('tool.comingSoon')} 🚧
            </h2>
            <p className="text-gray-700 mb-2">{t('tool.underDevelopment')}</p>
            <p className="text-gray-600">{t('tool.notifyReady')}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href={getLocalizedPath(`/${category.slug}`)}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-surface transition-all"
            >
              <ArrowLeft size={20} />
              <span>
                {t('tool.backTo', {
                  category: category.name[locale as 'en' | 'zh'],
                })}
              </span>
            </Link>
            <Link
              href={getLocalizedPath('/feedback')}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
            >
              <Mail size={20} />
              <span>{t('tool.requestAccess')}</span>
            </Link>
          </div>

          {/* About Tool */}
          <div className="bg-surface rounded-xl p-6 text-left mb-8">
            <h3 className="text-lg font-semibold text-neutral mb-2">
              {t('tool.aboutTool')}
            </h3>
            <p className="text-gray-700">
              {tool.description[locale as 'en' | 'zh']}
            </p>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="text-left">
              <h3 className="text-lg font-semibold text-neutral mb-4">
                {t('tool.relatedTools')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedTools.map((relatedTool) => (
                  <Link
                    key={relatedTool.id}
                    href={getLocalizedPath(`/${category.slug}/${relatedTool.slug}`)}
                    className="card p-4 hover:border-primary border-2 border-transparent text-center"
                  >
                    <div className="text-3xl mb-2">{relatedTool.icon}</div>
                    <p className="text-sm font-medium text-neutral">
                      {relatedTool.name[locale as 'en' | 'zh']}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
