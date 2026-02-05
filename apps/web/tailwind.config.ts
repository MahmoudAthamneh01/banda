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
            fontFamily: {
                sans: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
                arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
                chinese: ['var(--font-noto-sc)', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
            },
            colors: {
                // Neutrals - أساس الواجهة
                ink: {
                    950: "#070A0F", // خلفية عميقة جداً
                    900: "#0B1220", // خلفية رئيسية
                    850: "#0F1A2D", // سطح عميق
                    800: "#141F33", // سطح
                    700: "#1E2A44", // حدود/فواصل
                },
                slate: {
                    200: "#E6EAF2", // نص فاتح جداً
                    300: "#C9D2E3", // نص ثانوي
                    400: "#9AA6BE", // نص خافت
                },
                // Primary - هوية أساسية
                panda: {
                    400: "#8B5CF6",
                    500: "#7C3AED", // بنفسجي ملكي - CTA أساسي
                    600: "#6D28D9",
                    700: "#5B21B6",
                },
                // Secondary - إحساس صيني/سوق
                silk: {
                    400: "#FCD34D",
                    500: "#F6C453", // ذهبي حريري - Badges
                    600: "#E9B63E",
                },
                // Tertiary / Link
                sky: {
                    500: "#38BDF8", // روابط/info
                },
                // Semantic
                success: {
                    500: "#22C55E",
                    600: "#16A34A",
                },
                warn: {
                    500: "#F59E0B",
                    600: "#D97706",
                },
                danger: {
                    500: "#EF4444",
                    600: "#DC2626",
                },
                // Special
                ruby: {
                    500: "#FF3D81", // Red Packet / Rewards
                },
                jade: {
                    500: "#10B981", // عروض/خصومات
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                // Primary glow: للـ hero والـ highlights
                "glow-primary": "linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #38BDF8 100%)",
                // Silk highlight: للـ VIP والـ rewards
                "silk-highlight": "linear-gradient(135deg, #E9B63E 0%, #F6C453 50%, #7C3AED 100%)",
                // Ambient background
                "ambient-purple": "radial-gradient(ellipse at top, rgba(124, 58, 237, 0.15) 0%, transparent 50%)",
                "ambient-blue": "radial-gradient(ellipse at bottom, rgba(56, 189, 248, 0.10) 0%, transparent 50%)",
            },
            boxShadow: {
                // Soft shadows للبطاقات
                soft: "0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3)",
                "soft-lg": "0 4px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.4)",
                // Glow effects
                "glow-primary": "0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)",
                "glow-primary-sm": "0 0 10px rgba(124, 58, 237, 0.3)",
                "glow-gold": "0 0 20px rgba(246, 196, 83, 0.4), 0 0 40px rgba(246, 196, 83, 0.2)",
                "glow-gold-sm": "0 0 10px rgba(246, 196, 83, 0.3)",
            },
            backgroundColor: {
                // Design Tokens
                bg: "var(--bg)",
                "bg-elev-1": "var(--bg-elev-1)",
                "bg-elev-2": "var(--bg-elev-2)",
                surface: "var(--surface)",
                "surface-strong": "var(--surface-strong)",
            },
            borderColor: {
                border: "var(--border)",
                "border-strong": "var(--border-strong)",
            },
            textColor: {
                text: "var(--text)",
                "text-muted": "var(--text-muted)",
                "text-dim": "var(--text-dim)",
            },
            animation: {
                shimmer: "shimmer 2s ease-in-out infinite",
                glow: "glow 3s ease-in-out infinite",
            },
            keyframes: {
                shimmer: {
                    "0%, 100%": { opacity: "0.5" },
                    "50%": { opacity: "1" },
                },
                glow: {
                    "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
                    "50%": { opacity: "1", transform: "scale(1.05)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
