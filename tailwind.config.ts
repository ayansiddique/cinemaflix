import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        netflix: {
          red: "#E50914",
          darkRed: "#B81D24",
          black: "#141414",
          darkGray: "#181818",
          lightGray: "#2F2F2F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
