'use client';

import Link from 'next/link';

interface Tool {
  id: string;
  slug: string;
  icon: string;
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  comingSoon: boolean;
  isPopular: boolean;
}

interface ToolCardProps {
  tool: Tool;
  locale: string;
}

export default function ToolCard({ tool, locale }: ToolCardProps) {
  const name = tool.name[locale as 'en' | 'zh'];
  const description = tool.description[locale as 'en' | 'zh'];

  const getToolPath = () => {
    const basePath = locale === 'en' ? '' : `/${locale}`;
    return `/pdf-tools${basePath}/${tool.slug}`;
  };

  if (tool.comingSoon) {
    return (
      <div className="tool-card opacity-60 cursor-not-allowed">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{tool.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-neutral">{name}</h3>
              <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                {locale === 'en' ? 'Coming Soon' : '即将上线'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={getToolPath()} className="tool-card block">
      <div className="flex items-start gap-4">
        <span className="text-4xl">{tool.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-neutral mb-1">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}
