import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Font families - Optimized for Pakistan (supports Urdu, English, and regional languages)
export const FontFamily = {
  regular: Platform.select({
    ios: 'System', // Supports Urdu on iOS
    android: 'Roboto', // Supports Urdu on Android
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  light: Platform.select({
    ios: 'System',
    android: 'Roboto-Light',
    default: 'System',
  }),
  // Urdu-specific font support (if custom fonts are added)
  urdu: Platform.select({
    ios: 'System', // iOS system font supports Urdu
    android: 'Noto Nastaliq Urdu', // Android Urdu font (if available)
    default: 'System',
  }),
} as const;

// Font sizes - using a scalable system optimized for Pakistan
const baseSize = 16;
const scale = (size: number): number => {
  const scaleFactor = Math.min(width / 375, 1.2); // Base on standard mobile device
  return Math.round(size * scaleFactor);
};

export const FontSize = {
  // Headings
  h1: scale(32),
  h2: scale(28),
  h3: scale(24),
  h4: scale(20),
  h5: scale(18),
  h6: scale(16),

  // Body text
  xl: scale(20),
  lg: scale(18),
  md: scale(16),
  sm: scale(14),
  xs: scale(12),
  xxs: scale(10),

  // Special sizes
  display: scale(40),
  title: scale(36),
  subtitle: scale(20),
  caption: scale(12),
  overline: scale(10),
} as const;

// Line heights
export const LineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

// Letter spacing
export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
} as const;

// Font weights
export const FontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '900',
} as const;

// Typography scale
export const Typography = {
  // Display styles
  display: {
    fontSize: FontSize.display,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.display * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },

  // Heading styles
  h1: {
    fontSize: FontSize.h1,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.h1 * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  h2: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.h2 * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  h3: {
    fontSize: FontSize.h3,
    fontFamily: FontFamily.semibold,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.h3 * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  },
  h4: {
    fontSize: FontSize.h4,
    fontFamily: FontFamily.semibold,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.h4 * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  },
  h5: {
    fontSize: FontSize.h5,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.h5 * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  h6: {
    fontSize: FontSize.h6,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.h6 * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

  // Body text styles
  bodyXL: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.xl * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  bodyLG: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.lg * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  bodyMD: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  bodySM: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  bodyXS: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.xs * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

  // Special text styles
  subtitle: {
    fontSize: FontSize.subtitle,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.subtitle * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },
  caption: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.normal,
    lineHeight: FontSize.caption * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },
  overline: {
    fontSize: FontSize.overline,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.overline * LineHeight.normal,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase' as const,
  },

  // Button text styles
  buttonLG: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.lg * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  buttonMD: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.md * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  buttonSM: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.sm * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
} as const;

// Text variant aliases for easier usage
export const TextVariants = {
  // Aliases for common usage
  display: Typography.display,
  h1: Typography.h1,
  h2: Typography.h2,
  h3: Typography.h3,
  h4: Typography.h4,
  h5: Typography.h5,
  h6: Typography.h6,
  body: Typography.bodyMD,
  bodyLarge: Typography.bodyLG,
  bodySmall: Typography.bodySM,
  small: Typography.bodySM,
  caption: Typography.caption,
  overline: Typography.overline,
  button: Typography.buttonMD,
  buttonLarge: Typography.buttonLG,
  buttonSmall: Typography.buttonSM,
} as const;

// Type exports
export type FontFamilyType = keyof typeof FontFamily;
export type FontSizeType = keyof typeof FontSize;
export type FontWeightType = keyof typeof FontWeight;
export type TypographyType = keyof typeof Typography;
export type TextVariantType = keyof typeof TextVariants;

// Helper functions
export const getFontFamily = (weight: FontWeightType = 'normal'): string => {
  const familyMap: Record<FontWeightType, string> = {
    light: FontFamily.light,
    normal: FontFamily.regular,
    medium: FontFamily.medium,
    semibold: FontFamily.semibold,
    bold: FontFamily.bold,
    black: FontFamily.bold,
  };
  return familyMap[weight];
};

export const getLineHeight = (fontSize: number, lineHeight: keyof typeof LineHeight = 'normal'): number => {
  return fontSize * LineHeight[lineHeight];
};

export const scaleFont = (size: number): number => {
  return scale(size);
};

// Responsive font size calculator - optimized for Pakistan market devices
export const responsiveFontSize = (minSize: number, maxSize: number): number => {
  const scaleFactor = width / 375; // Base on standard mobile device width
  const scaledSize = minSize * scaleFactor;
  return Math.min(Math.max(scaledSize, minSize), maxSize);
};

// Urdu text style helper - optimized for right-to-left and Urdu typography
export const getUrduTypography = (baseStyle: keyof typeof Typography) => {
  return {
    ...Typography[baseStyle],
    fontFamily: FontFamily.urdu,
    writingDirection: 'rtl' as const,
  };
};

export default Typography;