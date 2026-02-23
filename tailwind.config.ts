import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fff8f0",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FF9933",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        india: {
          green: "#138808",
          white: "#FFFFFF",
          saffron: "#FF9933",
          navy: "#000080",
          chakra: "#000080",
        },
      },
      fontFamily: {
        heading: ["Georgia", "serif"],
        body: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;