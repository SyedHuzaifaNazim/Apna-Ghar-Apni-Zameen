// Real Estate Color Palette — deep forest green (brand) + warm gold (accent)
export const Colors = {
  // Primary Colors (Brand Green) — deepened for a more premium, editorial feel
  primary: {
    50: '#E9F3EA',
    100: '#C7E2CA',
    200: '#A1CFA7',
    300: '#7ABB82',
    400: '#5AA863',
    500: '#2F7A34', // Main Brand Green
    600: '#276A2C',
    700: '#1F5924',
    800: '#17471C',
    900: '#0F3413',
  },

  // Secondary/Accent Colors (Warm Gold) — used for CTAs, "Featured" badges, price highlights
  secondary: {
    50: '#FDF7E7',
    100: '#FAECC0',
    200: '#F5DD93',
    300: '#EFCC63',
    400: '#E5BB3D',
    500: '#D4A017', // Main accent gold
    600: '#B8890F',
    700: '#96700C',
    800: '#755709',
    900: '#523D06',
  },

  // Success (classic, brighter green — distinct from the deeper brand primary)
  success: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#43a047',
    600: '#388e3c',
    700: '#2e7d32',
    800: '#1b5e20',
    900: '#0d3d14',
  },

  // Warning
  warning: {
    50: '#fffde7',
    100: '#fff9c4',
    200: '#fff59d',
    300: '#fff176',
    400: '#ffee58',
    500: '#fdd835',
    600: '#fbc02d',
    700: '#f9a825',
    800: '#f57f17',
    900: '#f57f17',
  },

  // Error (Soft red)
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },

  // Neutral Colors
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Backgrounds — warm off-white instead of stark white
  background: {
    primary: '#FAF9F6',
    secondary: '#F5F2EA',
    tertiary: '#EDEAE1',
    inverse: '#1A1A1A',
    card: '#FFFFFF',
  },

  // Text Colors
  text: {
    primary: '#211D18',
    // Was Colors.primary[500] (green) — every "secondary" (muted/caption) text
    // in the app was rendering brand-green instead of a neutral gray.
    secondary: '#6B6558',
    disabled: '#9e9e9e',
    inverse: '#ffffff',
    link: '#1F5924',
  },

  // Border Colors
  border: {
    light: '#e0e0e0',
    medium: '#bdbdbd',
    dark: '#757575',
    focus: '#2F7A34',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
    accent: 'rgba(47, 122, 52, 0.2)',
  },

  // Statuses used in real estate apps
  status: {
    forSale: '#2F7A34', // brand green
    forRent: '#5AA863', // lighter green
    featured: '#D4A017', // gold — was a near-identical green, indistinguishable from "for sale"
    sold: '#f44336',
    reserved: '#D4A017',
    available: '#43a047',
  },

  info: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },

  // Social Colors
  social: {
    facebook: '#1877f2',
    google: '#db4437',
    apple: '#000000',
    whatsapp: '#25d366',
    twitter: '#1da1f2',
    linkedin: '#0a66c2',
  },

  // Property Type Colors — differentiated shades of the new primary scale
  propertyType: {
    residential: '#2F7A34',
    commercial: '#1F5924',
    industrial: '#17471C',
    plot: '#5AA863',
    villa: '#276A2C',
    apartment: '#7ABB82',
  },
} as const;

// Type exports
export type ColorPalette = typeof Colors;
export type ColorShades = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type PrimaryColor = keyof typeof Colors.primary;
export type StatusColor = keyof typeof Colors.status;

// Helper functions
export const getColor = (color: string, shade: ColorShades = 500): string => {
  const colorGroup = Colors[color as keyof typeof Colors];
  if (colorGroup && typeof colorGroup === 'object' && !Array.isArray(colorGroup)) {
    // Check if it's a color group with shade keys (like primary, secondary, etc.)
    if (shade in colorGroup) {
      return (colorGroup as Record<ColorShades, string>)[shade];
    }
    // Fallback to shade 500 if available
    if (500 in colorGroup) {
      return (colorGroup as Record<ColorShades, string>)[500];
    }
  }
  return color;
};

export const getStatusColor = (status: string): string => {
  return Colors.status[status as keyof typeof Colors.status] || Colors.gray[500];
};

export const getPropertyTypeColor = (type: string): string => {
  const typeMap: Record<string, string> = {
    'Residential Flat': Colors.propertyType.residential,
    'Residential House': Colors.propertyType.residential,
    'Commercial Shop': Colors.propertyType.commercial,
    'Commercial Office': Colors.propertyType.commercial,
    'Industrial Plot': Colors.propertyType.industrial,
    'Plot': Colors.propertyType.plot,
    'Villa': Colors.propertyType.villa,
    'Penthouse': Colors.propertyType.apartment,
  };
  return typeMap[type] || Colors.propertyType.residential;
};

// Accessibility contrast colors
export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation - in production, use a proper contrast ratio calculator
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? Colors.text.primary : Colors.text.inverse;
};

export default Colors;
