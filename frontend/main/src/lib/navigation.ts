import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['en', 'zh', 'es'],

  // 默认语言
  defaultLocale: 'en',

  // 语言路径策略
  localePrefix: 'as-needed'
});

// Create lightweight wrappers around Next.js' navigation APIs
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
