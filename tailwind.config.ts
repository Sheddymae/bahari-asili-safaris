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
        editorial: ['DM Serif Display', 'Georgia', 'serif'],
        grotesk: ['Manrope', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        // Compatibility aliases: existing components retain their class names
        // while the visual system moves away from Poppins/Inter.
        poppins: ['DM Serif Display', 'Georgia', 'serif'],
        inter: ['Manrope', 'sans-serif'],
        caveat: ['DM Serif Display', 'Georgia', 'serif'],
      },
      colors: {
        book: {
          DEFAULT: 'oklch(72% 0.155 67)',
          50: 'oklch(96% 0.018 82)',
          600: 'oklch(72% 0.155 67)',
          700: 'oklch(72% 0.155 67)',
        },
        ocean: {
          50: 'oklch(99% 0.008 88)',
          100: 'oklch(96% 0.018 82)',
          200: 'oklch(78% 0.018 82)',
          300: 'oklch(70% 0.025 75)',
          400: 'oklch(52% 0.075 190)',
          500: 'oklch(43% 0.095 190)',
          600: 'oklch(43% 0.095 190)',
          700: 'oklch(43% 0.095 190)',
          800: 'oklch(35% 0.07 190)',
          900: 'oklch(20% 0.025 175)',
        },
        sand: {
          50: 'oklch(99% 0.008 88)',
          100: 'oklch(96% 0.018 82)',
          200: 'oklch(96% 0.018 82)',
          300: 'oklch(78% 0.018 82)',
          400: 'oklch(70% 0.025 75)',
          500: 'oklch(48% 0.025 75)',
          600: 'oklch(48% 0.025 75)',
          700: 'oklch(48% 0.025 75)',
          800: 'oklch(35% 0.025 75)',
          900: 'oklch(20% 0.025 175)',
        },
        safari: {
          50: 'oklch(96% 0.018 82)',
          100: 'oklch(96% 0.018 82)',
          200: 'oklch(96% 0.018 82)',
          300: 'oklch(78% 0.018 82)',
          400: 'oklch(72% 0.155 67)',
          500: 'oklch(72% 0.155 67)',
          600: 'oklch(72% 0.155 67)',
          700: 'oklch(72% 0.155 67)',
          800: 'oklch(60% 0.12 67)',
          900: 'oklch(46% 0.075 65)',
        },
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          foreground: 'oklch(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',
        ink: 'oklch(20% 0.025 175)',
        paper: 'oklch(96% 0.018 82)',
        salt: 'oklch(99% 0.008 88)',
        earth: 'oklch(46% 0.075 65)',
        sun: 'oklch(72% 0.155 67)',
        stone: 'oklch(70% 0.025 75)',
      },
      borderRadius: {
        lg: '2px',
        md: '2px',
        sm: '2px',
        '2xl': '2px',
        '3xl': '4px',
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
        card: '0 14px 40px color-mix(in oklab, oklch(20% 0.025 175) 10%, transparent)',
        'card-hover': '0 20px 56px color-mix(in oklab, oklch(20% 0.025 175) 14%, transparent)',
        hero: '0 24px 80px color-mix(in oklab, oklch(20% 0.025 175) 24%, transparent)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
