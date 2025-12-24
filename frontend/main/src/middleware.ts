import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 支持的语言列表
  locales: ['en', 'zh', 'es'],

  // 默认语言
  defaultLocale: 'en',

  // 语言路径策略
  localePrefix: 'as-needed'
});

export const config = {
  // 匹配所有路径，除了API、静态文件和图片
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
