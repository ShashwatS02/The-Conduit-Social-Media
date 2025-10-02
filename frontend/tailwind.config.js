/** @type {import('tailwindcss').Config} */
export default {
  // This line is the crucial addition
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
