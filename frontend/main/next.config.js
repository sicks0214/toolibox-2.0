const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // 禁用静态生成，使用动态渲染
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./src/locales/**/*'],
    },
  },
  // 强制动态渲染
  dynamicParams: true,
  // API 代理配置 - 将 /api/* 请求代理到后端
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL || 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
