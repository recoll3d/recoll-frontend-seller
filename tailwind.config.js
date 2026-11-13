/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    fontFamily: {
      primary: "Rajdhani",
      secondary: "Inter",
    },
    extend: {
      colors: {
        body: "var(--color-body)",
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        edge: "var(--color-edge)",
        accent: {
          DEFAULT: "#05F283",
          hover: {
            DEFAULT: "#04C168",
            light: "rgb(5, 242, 131, .3)",
          },
        },
        outline: "var(--color-btn-outline-text)",
        text: {
          DEFAULT: "var(--color-text)",
          red: "#EB5757",
        },
        title: {
          DEFAULT: "var(--color-title)",
        },
        "seller-hero": "var(--color-seller-hero)",
      },
    },
  },
  plugins: [],
};
