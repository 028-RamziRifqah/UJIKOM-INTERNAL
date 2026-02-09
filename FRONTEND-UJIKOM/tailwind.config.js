export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0b1120", // Deepest background
          800: "#1e293b", // Card background
          700: "#334155", // Border/Lighter bg
          600: "#475569", // Lighter hover
        },
        accent: {
          DEFAULT: "#0ea5e9", // Sky blue neon
          hover: "#0284c7",
          glow: "rgba(14, 165, 233, 0.5)",
        },
        purple: {
          DEFAULT: "#8b5cf6",
          glow: "rgba(139, 92, 246, 0.5)",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(14, 165, 233, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
