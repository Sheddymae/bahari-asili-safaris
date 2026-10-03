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
        editorial: ['DM Serif Display', 'serif'],
        grotesk: ['Manrope', 'sans-serif'],
        monoEditorial: ['IBM Plex Mono', 'monospace'],
        // Compatibility aliases retained for existing components during migration.
        poppins: ['Manrope', 'sans-serif'],
        inter: ['Manrope', 'sans-serif'],
        caveat: ['DM Serif Display', 'serif'],
      },
      colors: {
        ink: 'oklch(22% 0.025 185)',
        'ink-soft': 'oklch(38% 0.025 185)',
        ocean: {
          50: 'oklch(97% 0.012 190)', 100: 'oklch(91% 0.025 190)', 200: 'oklch(82% 0.045 190)',
          400: 'oklch(54% 0.075 190)', 500: 'oklch(48% 0.08 190)', 600: 'oklch(42% 0.085 190)',
          700: 'oklch(36% 0.07 190)', 800: 'oklch(31% 0.06 195)', 900: 'oklch(28% 0.055 195)'
        },
        sand: {
          50: 'oklch(98.5% 0.012 82)', 100: 'oklch(97% 0.02 82)', 200: 'oklch(95% 0.028 82)',
          300: 'oklch(90% 0.025 82)', 400: 'oklch(84% 0.018 82)', 500: 'oklch(70% 0.02 82)',
          600: 'oklch(58% 0.02 82)', 700: 'oklch(46% 0.02 82)', 800: 'oklch(34% 0.02 82)', 900: 'oklch(24% 0.02 82)'
        },
        safari: {
          50: 'oklch(98.5% 0.012 82)', 100: 'oklch(95% 0.028 82)', 200: 'oklch(90% 0.025 82)',
          300: 'oklch(82% 0.03 48)', 400: 'oklch(74% 0.15 48)', 500: 'oklch(67% 0.17 48)',
          600: 'oklch(61% 0.16 48)', 700: 'oklch(55% 0.14 48)', 800: 'oklch(48% 0.12 48)', 900: 'oklch(40% 0.10 48)'
        },
        orange: 'oklch(67% 0.17 48)',
        line: 'oklch(84% 0.018 82)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))', input: 'hsl(var(--input))', ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 1px)',
        sm: '0px',
        '2xl': '8px',
        '3xl': '12px',
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
        card: '0 6px 24px rgba(20,42,42,0.07)',
        'card-hover': '0 12px 32px rgba(20,42,42,0.11)',
        hero: '0 20px 60px rgba(20,42,42,0.22)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
