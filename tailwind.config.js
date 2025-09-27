/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './index.html',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          900: 'oklch(20% 0.08 180)', // Deep Teal
          800: 'oklch(25% 0.08 180)', // Jade Shadow
          600: 'oklch(45% 0.12 180)', // Jade
          400: 'oklch(65% 0.08 180)', // Light Jade
        },
        accent: {
          500: 'oklch(60% 0.20 15)', // Cherry Red
          400: 'oklch(70% 0.15 15)', // Light Cherry
        },
        muted: {
          400: 'oklch(60% 0.04 160)', // Sage Desat
          300: 'oklch(70% 0.02 160)', // Light Sage
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.06)',
          200: 'rgba(255, 255, 255, 0.12)',
        },
        // Legacy brand colors for compatibility
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
          950: 'var(--brand-950)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': 'var(--font-size-xs)',
        'fluid-sm': 'var(--font-size-sm)',
        'fluid-base': 'var(--font-size-base)',
        'fluid-lg': 'var(--font-size-lg)',
        'fluid-xl': 'var(--font-size-xl)',
        'fluid-2xl': 'var(--font-size-2xl)',
        'fluid-3xl': 'var(--font-size-3xl)',
        'fluid-4xl': 'var(--font-size-4xl)',
        'fluid-5xl': 'var(--font-size-5xl)',
        'fluid-6xl': 'var(--font-size-6xl)',
      },
      spacing: {
        'fluid-xs': 'var(--space-xs)',
        'fluid-sm': 'var(--space-sm)',
        'fluid-md': 'var(--space-md)',
        'fluid-lg': 'var(--space-lg)',
        'fluid-xl': 'var(--space-xl)',
        'fluid-2xl': 'var(--space-2xl)',
        'fluid-3xl': 'var(--space-3xl)',
        // Legacy spacing
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backgroundImage: {
        'hero-metal': 'linear-gradient(90deg, #BFC8D4 0%, rgba(255,255,255,0.3) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'rotate': 'rotate 2s linear infinite',
        // Legacy animations
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Legacy keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(147, 51, 234, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.6)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
        'slower': '500ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      zIndex: {
        'dropdown': '1000',
        'modal': '2000',
        'toast': '3000',
        'tooltip': '4000',
      },
      backdropBlur: {
        'xs': '2px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          'xs': '475px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1400px',
          '3xl': '1920px',
        },
      },
    },
  },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/container-queries'),
  ],
  safelist: [
    // Dragon Storm System Classes - Prevent purging of dynamic/arbitrary values
    'fixed', 'inset-0', 'absolute', 'isolate', 'overflow-hidden', 'pointer-events-none',
    'z-[-1]', 'z-10',
    'opacity-0', 'opacity-75',
    '-inset-[3%]', '-inset-[2%]', 'inset-[3%]',
    'motion-reduce:animate-none', 'motion-reduce:hidden',
    'w-[34vmin]', 'h-[34vmin]', 'w-[26vmin]', 'h-[26vmin]', 'w-[20vmin]', 'h-[20vmin]',
    'left-[10%]', 'top-[6%]', 'right-[6%]', 'top-[12%]', 'left-[28%]', 'top-[3%]',
    'left-[12%]', 'top-[8%]', 'right-[8%]', 'top-[15%]', 'left-[25%]', 'top-[5%]',
    'bg-black/90', 'bg-black/80',
    'text-white', 'text-xs', 'font-mono', 'rounded',
    'p-3', 'p-2',
    'will-change-transform',
    'bottom-0', 'left-0', 'right-0', 'h-40', 'h-32',
    'top-4', 'left-4', 'right-4',
    // Glass morphism classes
    'glass', 'glass-strong',
    // Metallic classes
    'metallic-bg', 'metallic-text',
    // Focus ring
    'focus-ring',
  ],
};