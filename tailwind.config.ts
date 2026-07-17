import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mavlers.ai brand — dark base + yellow accent (from the design brief)
        ink: {
          DEFAULT: '#0A0E1A',
          900: '#070A12',
          800: '#080B14',
          700: '#0B0F1B',
          600: '#0E1320',
          500: '#0C111F',
        },
        brand: {
          DEFAULT: '#FFCB2E',
          400: '#FFD166',
          300: '#FFD75C',
          200: '#FFE08A',
        },
        body: {
          DEFAULT: '#E7ECF3',
          muted: '#AEB9CC',
          faint: '#9AA7BD',
          dim: '#7A8698',
          soft: '#C6D0E0',
        },
        line: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1280px',
        content: '1180px',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        fadeUp: 'fadeUp 0.6s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
