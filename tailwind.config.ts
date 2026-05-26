import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Gentium Book Plus'", "sans-serif"],
        body: ["'Cabin'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
