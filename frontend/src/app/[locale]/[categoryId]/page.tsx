import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import categories from '@/data/categories.json';
import tools from '@/data/tools.json';
import toolGroups from '@/data/toolGroups.json';

interface CategoryPageProps {
  params: {
    categoryId: string;
    locale: string;
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({
    categoryId: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const t = await getTranslations();
  const { categoryId: categorySlug, locale } = params;

  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const categoryToolGroups = toolGroups
    .filter((g) => g.categoryId === category.id)
    .sort((a, b) => a.order - b.order);

  const groupsWithCount = categoryToolGroups.map((group) => ({
    ...group,
    toolCount: tools.filter((t) => t.groupId === group.id).length,
  }));

  const ungroupedTools = tools.filter(
    (t) => t.categoryId === category.id && !t.groupId
  );

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
            { label: category.name[locale as 'en' | 'zh'] },
          ]}
        />

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold text-neutral mb-4">
            {category.name[locale as 'en' | 'zh']}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {category.description[locale as 'en' | 'zh']}
          </p>
        </div>

        {groupsWithCount.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral mb-6">
              {t('category.coreTools')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupsWithCount.map((group) => (
                <Link
                  key={group.id}
                  href={getLocalizedPath(`/${category.slug}/${group.slug}`)}
                  className="card p-6 hover:border-primary border-2 border-transparent transition-all"
                >
                  <div className="text-4xl mb-3">{group.icon}</div>
                  <h3 className="text-xl font-semibold text-neutral mb-2">
                    {group.name[locale as 'en' | 'zh']}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {group.description[locale as 'en' | 'zh']}
                  </p>
                  <span className="text-sm text-primary font-medium">
                    {group.toolCount} {t('category.description', { count: group.toolCount })}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {ungroupedTools.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-neutral mb-6">
              {t('category.allTools')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ungroupedTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={getLocalizedPath(`/${category.slug}/${tool.slug}`)}
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
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
