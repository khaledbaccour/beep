import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#141418',
          900: '#1C1C22',
          800: '#27272F',
          700: '#35353F',
          600: '#4A4A56',
          500: '#6B6B76',
          400: '#8A8A96',
          300: '#ADADB8',
          200: '#D1D1D8',
          100: '#E8E4DF',
          50: '#F5F2ED',
        },
        brand: {
          700: '#7C3AED',
          600: '#8B5CF6',
          500: '#9F7AEA',
          400: '#B497FF',
          300: '#C9B8FF',
          200: '#DDD0FF',
          100: '#EDE5FF',
          50: '#F5F0FF',
        },
        peach: {
          700: '#E07A3A',
          600: '#FF9F6C',
          500: '#FFB088',
          400: '#FFCDB2',
          300: '#FFDECE',
          200: '#FFEBE0',
          100: '#FFF3ED',
          50: '#FFF9F5',
        },
        cream: {
          700: '#E0D8CE',
          600: '#EAE3DA',
          500: '#F0EBE4',
          400: '#F5F0EB',
          300: '#FAF5F0',
          200: '#FDFAF6',
          100: '#FFFBF7',
          50: '#FFFDFB',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', '"Cabinet Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        accent: ['"General Sans"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(20,20,24,0.04)',
        'card': '0 0 0 2px #141418',
        'card-hover': '0 0 0 2px #141418, 0 4px 12px rgba(20,20,24,0.08)',
        'elevated': '0 0 0 2px #141418, 0 12px 40px -8px rgba(20,20,24,0.12)',
        'brand': '0 4px 20px rgba(180,151,255,0.2)',
        'brand-lg': '0 8px 32px rgba(180,151,255,0.3)',
        'peach': '0 4px 20px rgba(255,176,136,0.2)',
        'peach-lg': '0 8px 32px rgba(255,176,136,0.3)',
        'retro-sm': '3px 3px 0px 0px #141418',
        'retro': '4px 4px 0px 0px #141418',
        'retro-md': '5px 5px 0px 0px #141418',
        'retro-lg': '6px 6px 0px 0px #141418',
        'retro-xl': '8px 8px 0px 0px #141418',
        'retro-hover': '6px 6px 0px 0px #141418',
        'retro-peach': '4px 4px 0px 0px #E07A3A',
        'retro-purple': '4px 4px 0px 0px #7C3AED',
        'retro-white': '4px 4px 0px 0px rgba(255,255,255,0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'wave': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'bee-bob': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-6deg)' },
          '33%': { transform: 'translateY(-8px) rotate(-2deg)' },
          '66%': { transform: 'translateY(-4px) rotate(-8deg)' },
        },
        'blink': {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
        'shadow-pulse': {
          '0%, 100%': { boxShadow: '4px 4px 0px 0px #141418' },
          '50%': { boxShadow: '6px 6px 0px 0px #141418' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'wave': 'wave 12s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bee-bob': 'bee-bob 3s ease-in-out infinite',
        'blink': 'blink 4s ease-in-out infinite',
        'shadow-pulse': 'shadow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
