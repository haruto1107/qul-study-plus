import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        qul: {
          DEFAULT: "#809CCF",
          50: "#F4F6FB",
          100: "#E9EDF7",
          200: "#CBD6EC",
          300: "#ADBFE1",
          400: "#8FA8D6",
          500: "#809CCF",
          600: "#5F7CB8",
          700: "#4A6296",
          800: "#374A70",
          900: "#24314A"
        }
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem"
      }
    }
  },
  plugins: []
};

export default config;
