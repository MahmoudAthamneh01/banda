/**
 * Design Tokens - Index
 * 
 * Central export for all design tokens
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './radii';
export * from './shadows';

// Re-export all tokens as a single object for convenience
import { colors } from './colors';
import { spacing } from './spacing';
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from './typography';
import { radii } from './radii';
import { shadows } from './shadows';

export const tokens = {
  colors,
  spacing,
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
  },
  radii,
  shadows,
} as const;
