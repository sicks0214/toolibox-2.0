import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import '../globals.css';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // 验证语言参数
  const locales = ['en', 'zh'];
  if (!locales.includes(locale)) {
    notFound();
  }

  // 加载翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <title>TooliBox - Free Online Tools for Everyone</title>
        <meta name="description" content="30+ free online tools for text processing, file conversion, image editing, and more. No sign-up required." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
