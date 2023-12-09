const plugin = require('tailwindcss')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'my-gradient': 'linear-gradient(153deg, #1986EC 0%, #A35BFF 100%)',
      },
    },
    screens: {
      'xs': '380px',

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.bg-my-gradient': {
          'background-image': 'linear-gradient(153deg, #1986EC 0%, #A35BFF 100%)',
        },
      })
    }),
  ],
}