/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        minecraft: {
          grass: '#7CBD3B',
          dirt: '#8B5A3C',
          stone: '#7D7D7D',
          sky: '#7FC8F8',
        },
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155',
        }
      },
      fontFamily: {
        'minecraft': ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
}
