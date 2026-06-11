/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Impeccable Design System — Kinpaku
        lacquer: {
          DEFAULT: 'oklch(7% 0.006 95)',
          deep: 'oklch(4% 0.004 95)',
          raised: 'oklch(11% 0.006 95)',
        },
        graphite: {
          DEFAULT: 'oklch(15% 0.008 95)',
          2: 'oklch(19% 0.008 95)',
        },
        kinpaku: {
          pale: 'oklch(86% 0.07 84)',
          DEFAULT: 'oklch(84% 0.19 80.46)',
          rich: 'oklch(77% 0.13 82)',
          deep: 'oklch(61% 0.085 78)',
        },
        patina: {
          pale: 'oklch(82% 0.07 188)',
          DEFAULT: 'oklch(70% 0.12 188)',
          deep: 'oklch(49% 0.08 188)',
        },
        champagne: 'oklch(91% 0 0)',
        'text-warm': 'oklch(88% 0 0)',
        'text-muted': 'oklch(72% 0 0)',
        'text-faint': 'oklch(62% 0 0)',
        vermilion: 'oklch(58% 0.15 35)',
      },
      fontFamily: {
        display: ['"Alumni Sans Pinstripe"', '"Albert Sans"', 'Arial', 'sans-serif'],
        body: ['"Albert Sans"', '"Avenir Next"', '"Helvetica Neue"', 'Arial', 'system-ui', 'sans-serif'],
        mono: ['"SFMono-Regular"', '"Roboto Mono"', 'Consolas', 'monospace'],
      },
      borderColor: {
        hairline: 'oklch(78% 0 0 / 0.16)',
        'hairline-strong': 'oklch(74% 0.09 82 / 0.6)',
      },
    },
  },
  plugins: [],
};