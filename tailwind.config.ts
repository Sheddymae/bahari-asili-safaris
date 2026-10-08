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
        book: { DEFAULT: '#FF7418', 50: '#FF7418', 600: '#FF7418', 700: '#FF7418' },
        ocean: { 50: '#167D95', 100: '#167D95', 200: '#167D95', 300: '#167D95', 400: '#167D95', 500: '#167D95', 600: '#167D95', 700: '#167D95', 800: '#167D95', 900: '#167D95' },
        sand: { 50: '#F5F1E8', 100: '#F5F1E8', 200: '#F5F1E8', 300: '#F5F1E8', 400: '#F5F1E8', 500: '#475569', 600: '#475569', 700: '#475569', 800: '#475569', 900: '#1F2937' },
        safari: { 50: '#FF7418', 100: '#FF7418', 200: '#FF7418', 300: '#FF7418', 400: '#FF7418', 500: '#FF7418', 600: '#FF7418', 700: '#FF7418', 800: '#FF7418', 900: '#FF7418' },
        ember: { 600: '#FF7418', 700: '#FF7418' },
        ink: { 900: '#1F2937', 600: '#475569' },
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
