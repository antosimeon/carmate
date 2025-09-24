import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        racing: {
          red: '#8A0000',      // header
          accent: '#C81E1E',   // buttons, highlights
        },
        carbon: {
          900: '#0F0F0F',      // canvas
          800: '#1E1E1E',      // sidebar
          700: '#282828',      // cards
          600: '#3A3A3A',      // borders/lines
        },
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
}
export default config

