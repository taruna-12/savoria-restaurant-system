/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dining: {
          50: '#fdfbf7',
          100: '#f9f3e9',
          200: '#f2e5d1',
          300: '#e5cdab',
          400: '#d7ae7f',
          500: '#c88c54',
          600: '#c85a32', // Rich terracotta dining accent
          700: '#a34224',
          800: '#833722',
          900: '#6b2f1f',
        },
        charcoal: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#080d19'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}
