'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PluginData } from '@/lib/api';

interface SearchToolsProps {
  plugins: PluginData[];
  locale: string;
}

export default function SearchTools({ plugins, locale }: SearchToolsProps) {
  const [query, setQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return plugins.filter(
      (plugin) =>
        plugin.title.toLowerCase().includes(lowerQuery) ||
        plugin.description.toLowerCase().includes(lowerQuery) ||
        plugin.slug.toLowerCase().includes(lowerQuery)
    );
  }, [query, plugins]);

  const placeholderText = locale === 'zh'
    ? '搜索工具...'
    : locale === 'es'
    ? 'Buscar herramientas...'
    : 'Search tools...';

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholderText}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {query.trim() && (
          <div className="mt-4 bg-white rounded-lg shadow-lg border">
            {filteredTools.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {locale === 'zh' ? '未找到工具' : locale === 'es' ? 'No se encontraron herramientas' : 'No tools found'}
              </div>
            ) : (
              <ul className="divide-y">
                {filteredTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/${locale}/${tool.category}-tools/${tool.slug}`}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{tool.title}</p>
                        <p className="text-sm text-gray-500">{tool.description}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
