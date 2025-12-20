/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A9C82',
          dark: '#3A7D68',
        },
        background: '#F5F7F2',
        neutral: '#2C3E3A',
        secondary: '#A8D5BA',
        accent: '#FF9F66',
        surface: '#E8F0EB',
        // PDF Tools 特有颜色
        pdf: {
          DEFAULT: '#FF6B6B',
          dark: '#C92A2A',
        },
      },
      backgroundImage: {
        'gradient-pdf': 'linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)',
      },
    },
  },
  plugins: [],
}
