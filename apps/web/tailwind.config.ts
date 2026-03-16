import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0d14',
          900: '#12161f',
          800: '#1e2432',
          700: '#333b4d',
          600: '#4a5468',
          500: '#636e83',
          400: '#8690a2',
          300: '#b0b8c7',
          200: '#d5dae3',
          100: '#ebeef3',
          50: '#f5f7f9',
        },
        brand: {
          700: '#C4432F',
          600: '#E85540',
          500: '#FF6B54',
          400: '#FF8C78',
          300: '#FFB0A1',
          200: '#FFD0C7',
          100: '#FFE8E3',
          50: '#FFF5F3',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
      },
      fontFamily: {
        display: ['"Cal Sans"', '"Cabinet Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0,0,0,0.03)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'elevated': '0 12px 40px -8px rgba(0,0,0,0.1)',
        'warm': '0 4px 20px rgba(255,107,84,0.12)',
        'warm-lg': '0 8px 32px rgba(255,107,84,0.18)',
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
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
