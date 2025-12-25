'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PluginData } from '@/lib/api';

// 分类元数据
const categoryMeta: Record<string, { name: Record<string, string>; categoryId: string }> = {
  pdf: {
    name: { en: 'PDF Tools', zh: 'PDF 工具', es: 'Herramientas PDF' },
    categoryId: 'pdf-tools'
  },
  image: {
    name: { en: 'Image Tools', zh: '图像工具', es: 'Herramientas de imagen' },
    categoryId: 'image-tools'
  }
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const locale = useLocale();
  const t = useTranslations('home.search');
  const router = useRouter();
  const [plugins, setPlugins] = useState<PluginData[]>([]);
  const [loading, setLoading] = useState(true);

  // 从 API 获取插件
  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE_URL}/api/plugins?lang=${locale}`);
        const data = await response.json();
        if (data.success) {
          setPlugins(data.data.plugins);
        }
      } catch (error) {
        console.error('Failed to fetch plugins:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlugins();
  }, [locale]);

  const searchResults = plugins.filter((tool) => {
    const searchTerm = query.toLowerCase();
    const toolName = tool.title.toLowerCase();
    const toolDesc = tool.description.toLowerCase();
    return toolName.includes(searchTerm) || toolDesc.includes(searchTerm);
  });

  const getToolPath = (tool: PluginData) => {
    const categoryId = categoryMeta[tool.category]?.categoryId || `${tool.category}-tools`;
    return `/${categoryId}/${tool.slug}`;
  };

  const getCategoryName = (category: string) => {
    return categoryMeta[category]?.name[locale] || category;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  key={tool.slug}
                  href={getToolPath(tool)}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{tool.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {tool.description}
                      </p>
                      <span className="inline-block text-xs text-primary font-medium">
                        {getCategoryName(tool.category)}
                      </span>
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
