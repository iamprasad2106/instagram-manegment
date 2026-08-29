import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        instagram: {
          purple: "#833ab4",
          red: "#fd1d1d",
          orange: "#fcb045",
          pink: "#e1306c",
          dark: "#121212",
          darker: "#000000",
          card: "#18181b",
          cardBorder: "#27272a",
          muted: "#71717a",
          highlight: "#38bdf8",
        },
      },
      backgroundImage: {
        "instagram-gradient": "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        "instagram-gradient-radial": "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
