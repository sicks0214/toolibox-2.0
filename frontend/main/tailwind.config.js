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
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(135deg, #4A9C82 0%, #2C3E3A 100%)',
        'gradient-file': 'linear-gradient(135deg, #A8D5BA 0%, #4A9C82 100%)',
        'gradient-image': 'linear-gradient(135deg, #FF9F66 0%, #4A9C82 100%)',
        'gradient-generate': 'linear-gradient(135deg, #4A9C82 0%, #A8D5BA 100%)',
        'gradient-developer': 'linear-gradient(135deg, #2C3E3A 0%, #4A9C82 100%)',
      },
    },
  },
  plugins: [],
}
