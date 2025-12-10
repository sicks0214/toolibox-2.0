const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 禁用静态优化，强制使用SSR
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./src/locales/**/*'],
    },
  },
};

module.exports = withNextIntl(nextConfig);
