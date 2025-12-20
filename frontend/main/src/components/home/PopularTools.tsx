'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getToolUrl, isMicroserviceDeployed } from '@/config/toolRoutes';

interface Tool {
  id: string;
  slug: string;
  categoryId: string;
  icon: string;
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  comingSoon?: boolean;
  isPopular?: boolean;
}

interface PopularToolsProps {
  tools: Tool[];
}

export default function PopularTools({ tools }: PopularToolsProps) {
  const t = useTranslations('home.popularTools');
  const locale = useLocale();

  const popularTools = tools.filter((tool) => tool.isPopular);

  const renderToolCard = (tool: Tool) => {
    const toolHref = tool.comingSoon
      ? `/${locale}/${tool.categoryId}/${tool.slug}`
      : getToolUrl(tool.categoryId, tool.slug, locale);

    // 判断是否是外部链接（已部署的微前端）
    const isExternal = isMicroserviceDeployed(tool.categoryId) && !tool.comingSoon;

    const cardContent = (
      <div className="flex items-start gap-4">
        <div className="text-4xl">{tool.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {tool.name[locale as 'en' | 'zh']}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {tool.description[locale as 'en' | 'zh']}
          </p>
          {tool.comingSoon && (
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {t('comingSoon')}
            </span>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    );

    // 微前端使用 <a> 标签，内部路由使用 <Link>
    if (isExternal) {
      return (
        <a
          key={tool.id}
          href={toolHref}
          className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
        >
          {cardContent}
        </a>
      );
    }

    return (
      <Link
        key={tool.id}
        href={toolHref}
        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
      >
        {cardContent}
      </Link>
    );
  };

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
        {popularTools.map(renderToolCard)}
      </div>
    </section>
  );
}
