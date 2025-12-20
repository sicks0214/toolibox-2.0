const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // 关键：设置 basePath 使应用运行在 /pdf-tools 子路径下
  basePath: '/pdf-tools',
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./src/locales/**/*'],
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // 根路径重定向到默认语言
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
