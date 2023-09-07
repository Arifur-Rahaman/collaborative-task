import { colors } from "./src/theme/colors";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          primary:colors.primary,
          "primary-light": "#ffdbdc",
          dark: "#15161c",
          "grey-dark-1": "#333",
          "grey-dark-2": "#777",
          "grey-dark-3": "#999",
          "dark-light": "#212329",
          "bg-dark": "#e8e7e6",
          "bg-white": "#f2f2f2",
      },
      backgroundImage: {
          "login-gradient": "linear-gradient(140deg, #313131 0%, #111013 75%)",
      },
  },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
}