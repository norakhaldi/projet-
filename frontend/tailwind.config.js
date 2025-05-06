module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/index.css",
  ],
  theme: {
    extend: {
      colors: {
        'maroon': '#800000',
        'primary': '#800000',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};