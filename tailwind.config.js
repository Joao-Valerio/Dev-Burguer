/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{html,js}"],
    safelist: [
      'bg-home',
    ],
    theme: {
      extend: {
        backgroundImage: {
          'home': "url('/assets/bg.png')",
        },
      },
    },
    plugins: [],
  }