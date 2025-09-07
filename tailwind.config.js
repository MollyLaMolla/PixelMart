/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "apple-blue": "#0071e3",
        "apple-blue-hover": "#027efc",
        "apple-dark": "#1d1d1f",
        "apple-light": "#f5f5f7",
      },
    },
  },
  plugins: [],
};
