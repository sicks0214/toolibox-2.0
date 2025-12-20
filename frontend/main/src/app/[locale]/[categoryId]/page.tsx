import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import categories from '@/data/categories.json';
import tools from '@/data/tools.json';
import { getToolUrl, isMicroserviceDeployed } from '@/config/toolRoutes';
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

  const categoryTools = tools.filter((t) => t.categoryId === category.id);

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

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => {
              // 使用 toolRoutes 获取正确的工具路径
              const toolHref = getToolUrl(category.id, tool.slug, locale);
              // 判断是否是外部链接（微前端）
              const isExternal = isMicroserviceDeployed(category.id) && !tool.comingSoon;

              return isExternal ? (
                <a
                  key={tool.id}
                  href={toolHref}
                  className="card p-6 hover:border-primary border-2 border-transparent transition-all"
                >
                  <div className="text-4xl mb-3">{tool.icon}</div>
                  <h3 className="text-xl font-semibold text-neutral mb-2">
                    {tool.name[locale as 'en' | 'zh']}
                  </h3>
                  <p className="text-gray-600">
                    {tool.description[locale as 'en' | 'zh']}
                  </p>
                </a>
              ) : (
                <Link
                  key={tool.id}
                  href={toolHref}
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
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
