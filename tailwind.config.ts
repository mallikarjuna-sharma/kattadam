import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e8f5e9",
          100: "#c8e6c9",
          200: "#a5d6a7",
          300: "#81c784",
          400: "#66bb6a",
          500: "#4caf50",
          600: "#43a047",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
        },
        cement: {
          50: "#f7f7f7",
          100: "#e8e8e8",
          200: "#d4d4d4",
          300: "#b8b8b8",
          400: "#8a8a8a",
          500: "#6b6b6b",
          600: "#5c5c5c",
          700: "#4a4a4a",
          800: "#3d3d3d",
          900: "#2c2c2c",
        },
        earth: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Tamil", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "Noto Sans Tamil", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
