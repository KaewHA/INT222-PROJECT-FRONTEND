/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#4D9DE0',
        'custom-black': '#2B2B2B',
        'red-to-bot': 'linear-gradient(to top, red, white) 1 100%'
      },
      boxShadow: {
        'equal-shadow': '0 0 8px rgba(0, 0, 0, 0.1)'
      }
    },
    fontFamily: {
      'noto': ['Noto Sans Thai', 'sans-serif'],
      'poppins': ['Poppins', 'sans-serif'],
      'roboto': ['Roboto', 'sans-serif']
    }
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwindcss-animated')
  ],
}

