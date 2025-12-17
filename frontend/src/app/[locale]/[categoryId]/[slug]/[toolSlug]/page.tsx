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

interface GroupedToolPageProps {
  params: {
    categoryId: string;
    slug: string;
    toolSlug: string;
    locale: string;
  };
}

export function generateStaticParams() {
  const params: Array<{ categoryId: string; slug: string; toolSlug: string }> = [];

  tools.filter((t) => t.groupId).forEach((tool) => {
    const group = toolGroups.find((g) => g.id === tool.groupId);
    const category = categories.find((c) => c.id === tool.categoryId);

    if (group && category) {
      params.push({
        categoryId: category.slug,
        slug: group.slug,
        toolSlug: tool.slug,
      });
    }
  });

  return params;
}

export default function GroupedToolPage({ params }: GroupedToolPageProps) {
  const t = useTranslations();
  const { categoryId: categorySlug, slug: groupSlug, toolSlug, locale } = params;

  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const group = toolGroups.find(
    (g) => g.slug === groupSlug && g.categoryId === category.id
  );

  if (!group) {
    notFound();
  }

  const tool = tools.find(
    (t) => t.slug === toolSlug && t.groupId === group.id
  );

  if (!tool) {
    notFound();
  }

  if (!tool.comingSoon) {
    const toolPath = locale === 'en' ? `/tools/${toolSlug}` : `/${locale}/tools/${toolSlug}`;
    redirect(toolPath);
  }

  const relatedTools = tools
    .filter((t) => t.groupId === group.id && t.id !== tool.id)
    .slice(0, 3);

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

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
            {
              label: group.name[locale as 'en' | 'zh'],
              href: `/${category.slug}/${group.slug}`,
            },
            { label: tool.name[locale as 'en' | 'zh'] },
          ]}
        />

        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="text-6xl mb-6">{tool.icon}</div>
          <h1 className="text-3xl font-bold text-neutral mb-8">
            {tool.name[locale as 'en' | 'zh']}
          </h1>

          <div className="bg-accent/10 border-2 border-accent rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-accent mb-4">
              🚧 {t('tool.comingSoon')} 🚧
            </h2>
            <p className="text-gray-700 mb-2">{t('tool.underDevelopment')}</p>
            <p className="text-gray-600">{t('tool.notifyReady')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href={getLocalizedPath(`/${category.slug}/${group.slug}`)}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-surface transition-all"
            >
              <ArrowLeft size={20} />
              <span>
                {t('tool.backTo', {
                  category: group.name[locale as 'en' | 'zh'],
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

          <div className="bg-surface rounded-xl p-6 text-left mb-8">
            <h3 className="text-lg font-semibold text-neutral mb-2">
              {t('tool.aboutTool')}
            </h3>
            <p className="text-gray-700">
              {tool.description[locale as 'en' | 'zh']}
            </p>
          </div>

          {relatedTools.length > 0 && (
            <div className="text-left">
              <h3 className="text-lg font-semibold text-neutral mb-4">
                {t('tool.relatedTools')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedTools.map((relatedTool) => (
                  <Link
                    key={relatedTool.id}
                    href={getLocalizedPath(
                      `/${category.slug}/${group.slug}/${relatedTool.slug}`
                    )}
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
