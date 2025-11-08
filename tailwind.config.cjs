module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'greenleaf-50': '#f7fbf8',
        'greenleaf-500': '#0E9F6E',
        'greenleaf-700': '#0B754F'
      },
      borderRadius: {
        xl: '12px',
        '2xl': '20px'
      },
      boxShadow: {
        soft: '0 6px 18px rgba(14,159,110,0.08)',
        card: '0 8px 30px rgba(2,6,23,0.06)'
      }
    }
  },
  plugins: []
};
