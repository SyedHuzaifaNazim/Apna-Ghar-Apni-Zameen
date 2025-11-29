import { Dimensions, Platform, StatusBar } from 'react-native';
const { width, height } = Dimensions.get('window');

// Device dimensions
export const Layout = {
  window: {
    width,
    height,
  },
  screen: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  isSmallDevice: width < 375,
  isLargeDevice: width >= 414,
  isTablet: width >= 768,
  isLandscape: width > height,
} as const;

// Status bar height
export const StatusBarHeight = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight || 24,
  default: 0,
});

// Safe area insets (approximate values - use react-native-safe-area-context for exact values)
export const SafeAreaInsets = {
  top: StatusBarHeight,
  bottom: Platform.select({
    ios: 34, // iPhone home indicator height
    android: 0,
    default: 0,
  }),
  left: 0,
  right: 0,
} as const;

// Spacing scale (8-point grid system)
export const Spacing = {
  // Micro spacing
  xxs: 2,
  xs: 4,
  sm: 8,
  
  // Base spacing
  md: 16,
  lg: 24,
  xl: 32,
  
  // Macro spacing
  xxl: 40,
  xxxl: 48,
  xxxxl: 64,
  
  // Special spacing
  section: 80,
  screen: 20,
} as const;

// Border radius scale
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  round: 9999, // For circular elements
  
  // Component specific
  card: 12,
  button: 8,
  input: 8,
  modal: 16,
  badge: 4,
} as const;

// Border width scale
export const BorderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 3,
} as const;

// Shadow system
export const Shadows = {
  // Elevation levels (following Material Design)
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  
  // Special shadows
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// Opacity scale
export const Opacity = {
  disabled: 0.5,
  inactive: 0.7,
  hover: 0.9,
  overlay: 0.6,
  subtle: 0.3,
  ghost: 0.1,
} as const;

// Z-index scale
export const ZIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Animation durations
export const Animation = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  deliberate: 700,
} as const;

// Component dimensions
export const ComponentSizes = {
  // Button sizes
  button: {
    sm: {
      height: 36,
      paddingHorizontal: Spacing.md,
      fontSize: 14,
    },
    md: {
      height: 48,
      paddingHorizontal: Spacing.lg,
      fontSize: 16,
    },
    lg: {
      height: 56,
      paddingHorizontal: Spacing.xl,
      fontSize: 18,
    },
  },
  
  // Input sizes
  input: {
    sm: {
      height: 40,
      paddingHorizontal: Spacing.md,
      fontSize: 14,
    },
    md: {
      height: 48,
      paddingHorizontal: Spacing.lg,
      fontSize: 16,
    },
    lg: {
      height: 56,
      paddingHorizontal: Spacing.xl,
      fontSize: 18,
    },
  },
  
  // Card sizes
  card: {
    sm: {
      padding: Spacing.md,
    },
    md: {
      padding: Spacing.lg,
    },
    lg: {
      padding: Spacing.xl,
    },
  },
  
  // Avatar sizes
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    xxl: 64,
  },
  
  // Icon sizes
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
  },
  
  // Badge sizes
  badge: {
    sm: {
      height: 20,
      paddingHorizontal: Spacing.xs,
      fontSize: 10,
    },
    md: {
      height: 24,
      paddingHorizontal: Spacing.sm,
      fontSize: 12,
    },
    lg: {
      height: 28,
      paddingHorizontal: Spacing.sm,
      fontSize: 14,
    },
  },
} as const;

// Grid system
export const Grid = {
  // Grid columns
  columns: 12,
  
  // Gutters
  gutter: Spacing.md,
  
  // Container max widths
  container: {
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1140,
    fluid: '100%',
  },
  
  // Breakpoints (in pixels)
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
} as const;

// Aspect ratios
export const AspectRatio = {
  square: 1,
  video: 16 / 9,
  photo: 4 / 3,
  banner: 3 / 1,
  portrait: 3 / 4,
  panorama: 21 / 9,
} as const;

// Layout utilities
export const LayoutUtils = {
  // Percentage calculations
  percentage: (percent: number): number => (width * percent) / 100,
  
  // Responsive value calculator
  responsiveValue: <T,>(values: { [key: string]: T }): T => {
    if (Layout.isTablet) return values.tablet || values.lg || values.md;
    if (Layout.isSmallDevice) return values.sm || values.md;
    return values.md;
  },
  
  // Safe area padding
  safeAreaPadding: {
    paddingTop: SafeAreaInsets.top,
    paddingBottom: SafeAreaInsets.bottom,
    paddingLeft: SafeAreaInsets.left,
    paddingRight: SafeAreaInsets.right,
  },
  
  // Safe area margin
  safeAreaMargin: {
    marginTop: SafeAreaInsets.top,
    marginBottom: SafeAreaInsets.bottom,
    marginLeft: SafeAreaInsets.left,
    marginRight: SafeAreaInsets.right,
  },
  
  // Center content
  center: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // Full width/height
  fullWidth: { width: '100%' as const },
  fullHeight: { height: '100%' as const },
  fullSize: { width: '100%' as const, height: '100%' as const },
  
  // Flex layouts
  flex: {
    row: { flexDirection: 'row' as const },
    column: { flexDirection: 'column' as const },
    center: { justifyContent: 'center' as const, alignItems: 'center' as const },
    between: { justifyContent: 'space-between' as const },
    around: { justifyContent: 'space-around' as const },
    evenly: { justifyContent: 'space-evenly' as const },
    start: { justifyContent: 'flex-start' as const },
    end: { justifyContent: 'flex-end' as const },
  },
} as const;

// Type exports
export type SpacingType = keyof typeof Spacing;
export type BorderRadiusType = keyof typeof BorderRadius;
export type BorderWidthType = keyof typeof BorderWidth;
export type ShadowType = keyof typeof Shadows;
export type ZIndexType = keyof typeof ZIndex;
export type ComponentSizeType = keyof typeof ComponentSizes.button;

// Helper functions
export const getSpacing = (size: SpacingType | number): number => {
  if (typeof size === 'number') return size;
  return Spacing[size];
};

export const getBorderRadius = (radius: BorderRadiusType | number): number => {
  if (typeof radius === 'number') return radius;
  return BorderRadius[radius];
};

export const getShadow = (shadow: ShadowType) => {
  return Shadows[shadow];
};

export const getComponentSize = (component: keyof typeof ComponentSizes, size: ComponentSizeType) => {
  return ComponentSizes[component][size];
};

// Responsive layout helpers
export const responsiveLayout = {
  // Responsive padding
  padding: (vertical: SpacingType, horizontal: SpacingType) => ({
    paddingVertical: getSpacing(vertical),
    paddingHorizontal: getSpacing(horizontal),
  }),
  
  // Responsive margin
  margin: (vertical: SpacingType, horizontal: SpacingType) => ({
    marginVertical: getSpacing(vertical),
    marginHorizontal: getSpacing(horizontal),
  }),
  
  // Responsive gap
  gap: (size: SpacingType) => ({
    gap: getSpacing(size),
  }),
  
  // Responsive border
  border: (width: BorderWidthType, color: string, radius: BorderRadiusType = 'md') => ({
    borderWidth: BorderWidth[width],
    borderColor: color,
    borderRadius: getBorderRadius(radius),
  }),
};

export default Layout;