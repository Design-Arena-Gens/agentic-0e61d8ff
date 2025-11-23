import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sunrise: {
          50: "#fff6e5",
          100: "#ffebc2",
          200: "#ffd784",
          300: "#ffc148",
          400: "#ffa81a",
          500: "#f48e00",
          600: "#d37100",
          700: "#a95402",
          800: "#7d3c04",
          900: "#512504"
        }
      }
    }
  },
  plugins: []
};

export default config;
