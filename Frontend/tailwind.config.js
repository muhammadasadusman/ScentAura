/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    "bg-yellow-100",
    "text-yellow-700",
    "bg-green-100",
    "text-green-700",
    "bg-blue-100",
    "text-blue-700",
    "bg-red-100",
    "text-red-700",
  ],


  theme: {
    extend: {},
  },
  plugins: [],
}