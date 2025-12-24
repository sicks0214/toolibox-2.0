import Link from 'next/link';
import { PluginData } from '@/lib/api';

interface CategorySectionProps {
  category: string;
  categoryName: string;
  gradient: string;
  tools: PluginData[];
  locale: string;
}

export default function CategorySection({
  category,
  categoryName,
  gradient,
  tools,
  locale
}: CategorySectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl"
          style={{ background: gradient }}
        >
          {category === 'pdf' ? '📄' : '🖼️'}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{categoryName}</h3>
        <span className="text-sm text-gray-500">({tools.length})</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${locale}/${category}-tools/${tool.slug}`}
            className="group flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition-all"
          >
            <span className="text-3xl mb-2">{tool.icon}</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary text-center">
              {tool.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
