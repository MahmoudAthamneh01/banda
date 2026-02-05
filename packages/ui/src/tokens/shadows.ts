/**
 * Design Tokens - Shadows
 * 
 * Box shadows and glow effects
 */

export const shadows = {
  // Soft shadows for cards
  soft: '0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3)',
  'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.4)',

  // Glow effects
  'glow-primary': '0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
  'glow-primary-sm': '0 0 10px rgba(124, 58, 237, 0.3)',
  'glow-gold': '0 0 20px rgba(246, 196, 83, 0.4), 0 0 40px rgba(246, 196, 83, 0.2)',
  'glow-gold-sm': '0 0 10px rgba(246, 196, 83, 0.3)',
} as const;

export type ShadowToken = keyof typeof shadows;
