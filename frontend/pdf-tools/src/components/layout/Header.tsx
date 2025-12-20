'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
  ];

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) {
      setIsLanguageMenuOpen(false);
      return;
    }

    setIsLanguageMenuOpen(false);

    // 获取当前路径（去除 locale 前缀）
    let newPath = pathname;
    if (pathname.startsWith(`/${locale}`)) {
      newPath = pathname.slice(locale.length + 1) || '/';
    }

    // 构建新路径
    const finalPath = newLocale === 'en'
      ? `/pdf-tools${newPath}`
      : `/pdf-tools/${newLocale}${newPath}`;

    startTransition(() => {
      router.push(finalPath);
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left: Back to Main + Logo */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Toolibox</span>
          </a>

          <Link href="/pdf-tools" className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <span className="text-xl font-bold text-neutral">{t('title')}</span>
          </Link>
        </div>

        {/* Right: Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            className="flex items-center gap-2 text-sm font-medium text-neutral hover:text-primary transition-colors"
          >
            <GlobeAltIcon className="h-5 w-5" />
            <span>{languages.find((l) => l.code === locale)?.name}</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${
                isLanguageMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isLanguageMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsLanguageMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    disabled={isPending}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-surface transition-colors ${
                      locale === lang.code
                        ? 'bg-surface text-primary font-semibold'
                        : 'text-neutral'
                    } ${isPending ? 'opacity-50' : ''}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
