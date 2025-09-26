/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      colors: {
        // Semantic colors mapped to CSS variables
        surface: {
          0: 'var(--surface-0)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          elevated: 'var(--surface-elevated)',
        },
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
        accent: {
          50: 'var(--accent-50)',
          100: 'var(--accent-100)',
          200: 'var(--accent-200)',
          300: 'var(--accent-300)',
          400: 'var(--accent-400)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          700: 'var(--accent-700)',
          800: 'var(--accent-800)',
          900: 'var(--accent-900)',
        },
        success: {
          50: 'var(--success-50)',
          500: 'var(--success-500)',
          600: 'var(--success-600)',
          700: 'var(--success-700)',
        },
        warning: {
          50: 'var(--warning-50)',
          500: 'var(--warning-500)',
          600: 'var(--warning-600)',
          700: 'var(--warning-700)',
        },
        danger: {
          50: 'var(--danger-50)',
          500: 'var(--danger-500)',
          600: 'var(--danger-600)',
          700: 'var(--danger-700)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
      },
      fontSize: {
        'fluid-xs': 'var(--fs-300)',
        'fluid-sm': 'var(--fs-400)',
        'fluid-base': 'var(--fs-500)',
        'fluid-lg': 'var(--fs-600)',
        'fluid-xl': 'var(--fs-700)',
        'fluid-2xl': 'var(--fs-800)',
        'fluid-3xl': 'var(--fs-900)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
        9: 'var(--space-9)',
        10: 'var(--space-10)',
      },
      borderRadius: {
        'xs': 'var(--radius-xs)',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
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
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      utilities: {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
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
    // Custom animation classes
    'aurora-backdrop',
    'rain-heavy-layer', 'rain-medium-layer', 'rain-light-layer',
    'lightning-flash-overlay',
    'rain-heavy-fast', 'rain-medium-fast', 'rain-light-fast',
    // Container query responsive classes
    'sm:opacity-50', 'md:opacity-75', 'lg:opacity-100',
    // Bulletproof Dragon System safelist - prevents JIT purging
    'inset-0','-z-10','-inset-[2%]','[filter:blur(70px)]','mix-blend-screen',
    'opacity-[0.12]','opacity-[0.10]','opacity-[0.08]',
    'animate-[aurora_14s_ease-in-out_infinite]',
    'animate-[rainA_3.6s_linear_infinite]','animate-[rainB_4.6s_linear_infinite]','animate-[rainC_5.2s_linear_infinite]',
    'animate-[rainA_2.8s_linear_infinite]','animate-[rainB_3.6s_linear_infinite]','animate-[rainC_4.2s_linear_infinite]',
    'animate-[flash_22s_ease-in-out_infinite]',
  ],
}