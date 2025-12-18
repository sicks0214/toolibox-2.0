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
  // 跳过构建时的静态页面生成错误
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
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
