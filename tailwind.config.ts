import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
      },
      colors: {
        book: { DEFAULT: '#C2410C', 50: '#FAF7F2', 600: '#EA580C', 700: '#C2410C' },
        ocean: { 50: '#F0F9FF', 100: '#D9EEF5', 200: '#D9EEF5', 300: '#D9CDB6', 400: '#0F6F8F', 500: '#0F6F8F', 600: '#0F6F8F', 700: '#0F5C7A', 800: '#0B3C54', 900: '#0B3C54' },
        sand: { 50: '#FAF7F2', 100: '#F1EBDF', 200: '#F1EBDF', 300: '#D9CDB6', 400: '#D9CDB6', 500: '#475569', 600: '#475569', 700: '#475569', 800: '#475569', 900: '#10222B' },
        safari: { 50: '#FAF7F2', 100: '#F1EBDF', 200: '#F1EBDF', 300: '#D9CDB6', 400: '#EA580C', 500: '#EA580C', 600: '#EA580C', 700: '#C2410C', 800: '#C2410C', 900: '#C2410C' },
        ember: { 600: '#EA580C', 700: '#C2410C' },
        ink: { 900: '#10222B', 600: '#475569' },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: '4px',
        md: '4px',
        sm: '4px',
        card: '1rem',
        pill: '9999px',
        '2xl': '16px',
        '3xl': '24px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        tide: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        tide: 'tide 18s linear infinite',
      },
      boxShadow: {
        card: '0 1px 2px rgb(16 34 43 / .06), 0 8px 24px -12px rgb(16 34 43 / .18)',
        'card-hover': '0 8px 32px -12px rgb(16 34 43 / .18)',
        hero: '0 20px 60px rgb(16 34 43 / .24)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
