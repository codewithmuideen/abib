/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2.5rem' }, screens: { '2xl': '1360px' } },
    extend: {
      // Palette extracted from the Abib logo (see src/styles/index.css).
      colors: {
        navy: { DEFAULT: token('navy'), deep: token('navy-deep'), soft: token('navy-soft') },
        royal: { DEFAULT: token('royal'), dark: token('royal-dark') },
        sky: { DEFAULT: token('sky'), light: token('sky-light') },
        ink: token('ink'),
        muted: token('muted'),
        steel: token('steel'),
        line: token('line'),
        mist: token('mist'),
        paper: token('paper'),
        danger: token('danger'),
        success: token('success'),
      },
      fontFamily: {
        display: ['Montserrat', 'Segoe UI', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.2em' }],
      },
      boxShadow: {
        lift: '0 30px 60px -20px rgb(14 38 70 / 0.25)',
        card: '0 1px 2px rgb(14 38 70 / 0.04), 0 12px 32px -12px rgb(14 38 70 / 0.12)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
