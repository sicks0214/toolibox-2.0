'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import tools from '@/data/tools.json';
import categories from '@/data/categories.json';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const locale = useLocale();
  const t = useTranslations('home.search');
  const tPopular = useTranslations('home.popularTools');
  const router = useRouter();

  const searchResults = tools.filter((tool) => {
    const searchTerm = query.toLowerCase();
    const toolName = tool.name[locale as 'en' | 'zh'].toLowerCase();
    const toolDesc = tool.description[locale as 'en' | 'zh'].toLowerCase();
    return toolName.includes(searchTerm) || toolDesc.includes(searchTerm);
  });

  const getToolPath = (tool: any) => {
    return `/${tool.categoryId}/${tool.slug}`;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name[locale as 'en' | 'zh'] : categoryId;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {query ? t('resultsFor', { query }) : t('searchTools')}
            </h1>
            <p className="text-gray-600">
              {searchResults.length === 1
                ? t('toolFound', { count: searchResults.length })
                : t('toolsFound', { count: searchResults.length })}
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((tool) => (
                <Link
                  key={tool.id}
                  href={getToolPath(tool)}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{tool.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {tool.name[locale as 'en' | 'zh']}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {tool.description[locale as 'en' | 'zh']}
                      </p>
                      <span className="inline-block text-xs text-primary font-medium">
                        {getCategoryName(tool.categoryId)}
                      </span>
                      {tool.comingSoon && (
                        <span className="ml-2 inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {tPopular('comingSoon')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('noResults')}</h2>
              <p className="text-gray-600 mb-6">{t('tryDifferent')}</p>
              <button
                onClick={() => router.push('/')}
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                {t('backHome')}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
