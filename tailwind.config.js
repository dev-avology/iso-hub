/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tracer: {
          blue: '#00304F',
          green: '#69932F',
          themebg:'#fff',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
