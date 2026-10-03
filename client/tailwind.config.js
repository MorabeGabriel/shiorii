/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6C8CFF",
        accent: "#FFB454",
        bg: "#0F1115",
        surface: "#1A1D23",
        surface2: "#23272F",
        text: "#E8E9ED",
        textDim: "#9AA0AC",
      },
      spacing: {
        1: "8px",
        2: "16px",
        4: "32px",
      },
      fontSize: {
        heading: ["28px", { fontWeight: "700" }],
        body: ["16px", { fontWeight: "400" }],
        small: ["13px", { fontWeight: "400" }],
      },
    },
  },
  plugins: [],
}
