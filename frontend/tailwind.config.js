/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          primary: '#2E4F6B',
          'primary-hover': '#233E55',
          'primary-light': '#EBF2F7',
          'primary-subtle': '#F0F5FA',
          bg: '#F7F8FA',
          surface: '#FFFFFF',
          'surface-subtle': '#FAFBFC',
          text: '#17202A',
          'text-secondary': '#667085',
          'text-muted': '#98A2B3',
          border: '#E4E7EC',
          'border-dark': '#D0D5DD',
          accent: '#2563EB',
          'accent-light': '#EFF6FF',
          success: '#16803D',
          'success-light': '#DCFCE7',
          warning: '#B7791F',
          'warning-light': '#FEF3C7',
          danger: '#C0392B',
          'danger-light': '#FEE2E2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        'card': '0 1px 3px 0 rgba(16, 24, 40, 0.08), 0 1px 2px -1px rgba(16, 24, 40, 0.08)',
        'dropdown': '0 4px 6px -1px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'modal': '0 20px 25px -5px rgba(16, 24, 40, 0.1), 0 8px 10px -6px rgba(16, 24, 40, 0.06)',
      }
    },
  },
  plugins: [],
}
