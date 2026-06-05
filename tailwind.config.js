/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        avocado: {
          light: '#8DB600',
          DEFAULT: '#9ACD32',
          dark: '#6B8E23',
        },
        cream: {
          light: '#FFFEF0',
          DEFAULT: '#F5F5DC',
          dark: '#EDE8D0',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
