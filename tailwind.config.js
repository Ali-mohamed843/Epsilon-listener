module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6e226e',
        'primary-dark': '#4a1750',
        'primary-xlight': '#f3e6f3',
        surface: '#ffffff',
        surface2: '#faf5fa',
        muted: '#9e859e',
        muted2: '#c8b2c8',
        dark: '#1a0a1a',
        border: '#ede4ed',
        success: '#00a878',
      },
    },
  },
  plugins: [],
};