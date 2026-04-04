export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nereid: {
          bg: '#e6ebf1',
          surface: '#cbd5e1',
          panel: '#dcdfe6',
          border: '#a2b1c4',
          text: '#1a2b3c',
          textMuted: '#47637f',
          red: '#d9534f',
          redMuted: '#f2dede',
          amber: '#f0ad4e',
          amberMuted: '#fcf8e3',
          green: '#5cb85c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
