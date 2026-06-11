/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        warmer: {
          50: '#FDFBF7',
          100: '#F7F4EC',
          200: '#EBE6D5',
          300: '#D9D2BC',
        },
        navy: {
          400: '#2A4A5A',
          500: '#1A303A',
          600: '#132530',
          700: '#0D1A22',
        },
        coral: {
          300: '#F0A590',
          400: '#E07A5F',
          500: '#D4694F',
          600: '#C05840',
        },
        sage: {
          300: '#A3C4A5',
          400: '#7EA180',
          500: '#6B8E6D',
          600: '#5A7A5C',
        },
        body: '#333F48',
        muted: '#7A8590',
        subtle: '#A8B2BA',
      },
      fontFamily: {
        heading: ['"Merriweather"', 'Georgia', '"Times New Roman"', 'serif'],
        body: ['"Inter"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        handwritten: ['"Ma Shan Zheng"', 'cursive'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '28px',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(26,48,58,0.04)',
        'card': '0 2px 16px rgba(26,48,58,0.03)',
        'lift': '0 8px 32px rgba(26,48,58,0.06)',
      },
    },
  },
  plugins: [],
};
