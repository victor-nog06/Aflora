/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aflora: {
          bg: '#FAF7F2',        // off-white cream background
          card: '#FFFFFF',      // crisp clean card background
          cardWarm: '#FAF4EC',  // subtle warm card accent
          primary: '#C03967',   // signature deep magenta/wine hibiscus pink
          primaryDark: '#9C2147',// deeper magenta
          primaryLight: '#FBEBF1',// soft pink badge background
          yellow: '#F3C649',    // subtle accent yellow
          text: '#2C2220',      // soft dark espresso text
          muted: '#685B58',     // soft muted brown text
          border: '#EAE3D9',    // delicate border
          borderAccent: '#F3DCE4',
        }
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'], // condensed heavy typography for headers
        sans: ['Outfit', 'sans-serif'],   // clean secondary typography
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(44, 34, 32, 0.06)',
        'elevated': '0 12px 30px -4px rgba(192, 57, 103, 0.12)',
      }
    },
  },
  plugins: [],
}
