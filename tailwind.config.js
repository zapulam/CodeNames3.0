/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#64748b',
        dark: {
          900: "#121212",
          800: "#1a1a1a",
          700: "#222222",
          600: "#2a2a2a",
          500: "#333333",
          400: "#3d3d3d",
          300: "#525252",
          200: "#a1a1a1",
          100: "#cfcfcf",
        },
      },
    },
  },
} 