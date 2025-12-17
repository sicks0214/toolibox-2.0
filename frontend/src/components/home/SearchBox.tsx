'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const t = useTranslations('home.search');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mt-8 max-w-3xl mx-auto">
      <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
        <div className="pl-6 pr-3 py-4">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 py-4 px-2 text-base outline-none text-gray-700"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-medium px-8 py-4 rounded-full mr-1 transition-colors"
        >
          {t('button')}
        </button>
      </div>
    </form>
  );
}
