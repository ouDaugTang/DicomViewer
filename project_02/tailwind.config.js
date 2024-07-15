/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['CustomFont', 'Roboto'],
      },
      colors: {
        main: '#0F62FE' // 커스텀 파란색 정의
      }
    },
  },
  plugins: [],
}