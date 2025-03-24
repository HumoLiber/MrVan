/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4f46e5', // індиго-600
        'primary-light': '#6366f1',
        'secondary': '#8b5cf6',
        'accent': '#7c3aed',
        'bg-alt': '#F7F9FA',
      },
      fontFamily: {
        sans: ['Golos Text', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 