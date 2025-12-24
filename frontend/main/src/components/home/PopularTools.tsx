'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PluginData } from '@/lib/api';

interface PopularToolsProps {
  tools: PluginData[];
  locale: string;
}

export default function PopularTools({ tools, locale }: PopularToolsProps) {
  const t = useTranslations('home.popularTools');

  const renderToolCard = (tool: PluginData) => {
    const toolHref = `/${locale}/${tool.category}-tools/${tool.slug}`;

    return (
      <Link
        key={tool.slug}
        href={toolHref}
        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">{tool.icon}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {tool.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {tool.description}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    );
  };

  if (tools.length === 0) return null;

  return (
    <section className="container mx-auto px-12 md:px-16 lg:px-24 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(renderToolCard)}
      </div>
    </section>
  );
}
