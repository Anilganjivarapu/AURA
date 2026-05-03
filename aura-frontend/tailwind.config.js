/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aura: {
          night: "#08111f",
          ink: "#101b2d",
          gold: "#d6a44c",
          sand: "#f3e5c7",
          mist: "#dae5f5",
          coral: "#f27f63",
          teal: "#48b8b2",
        },
      },
      boxShadow: {
        aura: "0 24px 80px rgba(6, 14, 31, 0.28)",
      },
      backgroundImage: {
        "aura-grid":
          "radial-gradient(circle at top, rgba(214,164,76,0.18), transparent 35%), linear-gradient(135deg, rgba(8,17,31,0.96), rgba(16,27,45,0.92))",
      },
      fontFamily: {
        display: ['"Fraunces"', '"Times New Roman"', "serif"],
        body: ['"Manrope"', '"Segoe UI"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
