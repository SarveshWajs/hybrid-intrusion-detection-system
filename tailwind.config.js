/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html","./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {colors: {
        theme: "#fff",
      textTheme: "#000",
        textGray:'#606060',
        fallRed: "#F00",
        riseGreen: "#29b76a",
        softGreen: "#29b7731a",
        lightGray: "#FAFAFA",
      mediumGray: "#606266",
        backgroundGray:"#fcfcfc",
        gray: "#999",
        bgGray: "#f5f7fa",
        borderGray: "#f5f5f5",
      },
      backgroundImage: {
        "rise-gradient": "linear-gradient(90deg, #fff, #e9f8f1ba)",
        "fall-gradient": "linear-gradient(90deg, #fff,#fde8eb57)",
      },},
  },
  plugins: [],
}

