/**
 * Design Tokens - Colors
 * 
 * Based on BandaChao's dark-first design system
 * Source: apps/web/tailwind.config.ts
 */

export const colors = {
  // Neutrals - Foundation
  ink: {
    950: '#070A0F', // Deepest background
    900: '#0B1220', // Main background
    850: '#0F1A2D', // Deep surface
    800: '#141F33', // Surface
    700: '#1E2A44', // Borders/dividers
  },

  slate: {
    200: '#E6EAF2', // Very light text
    300: '#C9D2E3', // Secondary text
    400: '#9AA6BE', // Muted text
  },

  // Primary - Core identity
  panda: {
    400: '#8B5CF6',
    500: '#7C3AED', // Royal purple - Primary CTA
    600: '#6D28D9',
    700: '#5B21B6',
  },

  // Secondary - Chinese/Market feel
  silk: {
    400: '#FCD34D',
    500: '#F6C453', // Silk gold - Badges
    600: '#E9B63E',
  },

  // Tertiary / Links
  sky: {
    500: '#38BDF8', // Links/info
  },

  // Semantic colors
  success: {
    500: '#22C55E',
    600: '#16A34A',
  },

  warn: {
    500: '#F59E0B',
    600: '#D97706',
  },

  danger: {
    500: '#EF4444',
    600: '#DC2626',
  },

  // Special purpose
  ruby: {
    500: '#FF3D81', // Red packets / Rewards
  },

  jade: {
    500: '#10B981', // Deals / Discounts
  },
} as const;

export type ColorToken = keyof typeof colors;
export type ColorShade = keyof typeof colors.ink | keyof typeof colors.slate;
