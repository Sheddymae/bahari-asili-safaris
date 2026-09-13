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
        // ---------------------------------------------------------------
        // PALETTE LOCKDOWN: every custom scale below is collapsed onto the
        // 9 approved brand colors only (see app/globals.css :root). Shades
        // are kept as separate keys (50/100/.../900) purely so existing
        // className references (e.g. `bg-ocean-700`) keep working, but each
        // key now resolves to one of the 9 approved hex values — no
        // off-palette hex exists anywhere in this scale.
        //   Ocean #0e7490 · Sand #f5f1e8 · Orange #f97316 · Dark #1f2937
        //   White #FFFFFF · Muted #f1f5f9 · Border #e2e8f0 · MutedText #64748b
        //   Destructive #ef4444
        // ---------------------------------------------------------------
        book: {
          DEFAULT: '#f97316',
          50: '#f5f1e8',
          600: '#f97316',
          700: '#f97316',
        },
        ocean: {
          50: '#f1f5f9',
          100: '#e2e8f0',
          200: '#e2e8f0',
          300: '#e2e8f0',
          400: '#0e7490',
          500: '#0e7490',
          600: '#0e7490',
          700: '#0e7490',
          800: '#0e7490',
          900: '#1f2937',
        },
        sand: {
          50: '#ffffff',
          100: '#f5f1e8',
          200: '#f5f1e8',
          300: '#e2e8f0',
          400: '#e2e8f0',
          500: '#64748b',
          600: '#64748b',
          700: '#64748b',
          800: '#64748b',
          900: '#1f2937',
        },
        safari: {
          50: '#f5f1e8',
          100: '#f5f1e8',
          200: '#f5f1e8',
          300: '#f5f1e8',
          400: '#f97316',
          500: '#f97316',
          600: '#f97316',
          700: '#f97316',
          800: '#f97316',
          900: '#f97316',
        },
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
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        card: '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.14)',
        hero: '0 20px 60px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
