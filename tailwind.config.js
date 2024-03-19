/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffe900",
        secondary: "#2f2f2f",
      },
    },
  },
  plugins: [],
};
