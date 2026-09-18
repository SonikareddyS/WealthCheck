/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007aff',
        bg: '#f9fafb',
        text: '#212529',
        muted: '#6c757d',
      },
    },
  },
  plugins: [],
}
