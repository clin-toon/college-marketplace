tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        primaryHover: "#4338CA",
        accentLight: "#818CF8",
        bg: "#F8FAFC",
        surface: "#FFFFFF",
        ink: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
        success: "#16A34A",
        danger: "#DC2626",
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": {
            transform: "translateY(0) rotate(var(--tilt, -3deg))",
          },
          "50%": {
            transform: "translateY(-10px) rotate(var(--tilt, -3deg))",
          },
        },
        fadeSlideIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floatSlow: "floatSlow 6s ease-in-out infinite",
        fadeSlideIn: "0.2s ease-out fadeSlideIn",
      },
    },
  },
};
