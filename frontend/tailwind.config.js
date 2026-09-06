/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
    extend: {
        colors: {
        primary: { DEFAULT: "#b673fa", dark: "#7c3fc4", light: "#ece0fc" },
        beige: { DEFAULT: "#f6efe0", dark: "#ead9b8" },
        ink: { DEFAULT: "#241b35", soft: "#7a6f92" },
        peach: { DEFAULT: "#ffb37a", dark: "#e8935a" }
        },
        fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Manrope", "Segoe UI", "sans-serif"]
        }
    },
},
plugins: [],
}