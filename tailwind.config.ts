import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import {nextui} from "@nextui-org/react";


const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-space-grotesk)", ...defaultTheme.fontFamily.serif],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        "up-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(2px)" },
        },
        "left-right": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(2px)" },
        },
        "rotate-slight": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-45deg)" },
        },
        "rotate-slight-reset": {
          "0%": { transform: "rotate(-45deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        "up-down": "up-down 1s ease-in-out infinite",
        "left-right": "left-right 1s ease-in-out infinite",
        "rotate-slight": "rotate-slight 0.3s ease-out",
        "rotate-slight-reset": "rotate-slight-reset 0.3s ease-out",
      },
    },
  },
  plugins: [nextui({
    themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "black",
            },
          },
        },
      //   dark: {
      //     colors: {
      //       primary: "black",
      //       background: "black",
      //     },
      //   },
      },
  })],
};
export default config;
