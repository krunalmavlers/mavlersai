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
        // Mavlers.ai brand — light base, black + yellow accents (per brand guide).
        brand: {
          DEFAULT: '#FFDB2D', // C-1 M-11 Y-91 K-0
          300: '#FFE24D', // lighter hover
          200: '#FFEC85',
          ink: '#B98D1E', // darker yellow for text on light
        },
        // Neutral scale used for backgrounds and text on the light theme.
        ink: {
          DEFAULT: '#000000',
          900: '#0A0A0A',
          800: '#0D0D0D',
          700: '#0F0F0F',
          600: '#121212',
          card: '#141414',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          tint: '#FAFAF8',
          tint2: '#F6F6F4',
          line: '#EDEDED',
          line2: '#ECECE8',
        },
        body: {
          DEFAULT: '#111111',
          muted: '#4A4A4A',
          faint: '#565656',
          dim: '#8A8A8A',
          soft: '#333333',
          onDark: '#A6A6A6',
        },
        line: '#EDEDED',
      },
      fontFamily: {
        display: ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
        sans: ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1220px',
        content: '1120px',
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
        botFloat: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(-1.2deg)' },
        },
        botBlink: {
          '0%,92%,100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.1)' },
        },
        botAntenna: {
          '0%,100%': { opacity: '.5', transform: 'scale(.8)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
        botShadow: {
          '0%,100%': { transform: 'translateX(-50%) scaleX(1)', opacity: '.18' },
          '50%': { transform: 'translateX(-50%) scaleX(.82)', opacity: '.1' },
        },
        heroFloat: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        implWork: {
          '0%,100%': { transform: 'scaleX(0.32)' },
          '50%': { transform: 'scaleX(1)' },
        },
        implDot: {
          '0%,100%': { opacity: '.3' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        fadeUp: 'fadeUp 0.6s ease both',
        botFloat: 'botFloat 3.6s ease-in-out infinite',
        botBlink: 'botBlink 4s ease-in-out infinite',
        botAntenna: 'botAntenna 1.6s ease-in-out infinite',
        botShadow: 'botShadow 3.6s ease-in-out infinite',
        implDot: 'implDot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
