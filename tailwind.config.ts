import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1a1a1a", // Dark gray for the main background
        foreground: "#FFFFFF", // White for primary text
        primary: "#1d70a0", // Blue accent color for buttons and highlights
        secondary: "#6B7280", // Gray for secondary text
        accent: "#5e5fce", // Purple accent for special elements (e.g., app name)
        border: "#374151", // Border gray for subtle UI separation
        muted: "#9CA3AF", // Muted gray for placeholder text
        success: "#22C55E", // Green for "Completed" tasks
        error: "#EF4444", // Red for errors or delete actions
      },
    },
  },
  plugins: [],
  safelist: [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
    "bg-amber-500",
  ],
};
