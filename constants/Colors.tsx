// Color palette for Apna Ghar Apni Zameen
export const Colors = {
  // Primary Colors
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    // 500: '#2196f3', // Main brand color
    500: '#4caf50',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },

  // Secondary Colors
  secondary: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800', // Accent color
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },

  // Success Colors
  success: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },

  // Warning Colors
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },

  // Error Colors
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

  // Background Colors
  background: {
    primary: '#4caf50',
    secondary: '#4caf50',
    tertiary: '#e9ecef',
    inverse: '#1a1a1a',
  },

  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#4caf50',
    disabled: '#9e9e9e',
    inverse: '#ffffff',
    link: '#2196f3',
  },

  // Border Colors
  border: {
    light: '#e0e0e0',
    medium: '#bdbdbd',
    dark: '#757575',
    focus: '#2196f3',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.2)',
    accent: 'rgba(33, 150, 243, 0.2)',
  },

  // Status Colors
  status: {
    forSale: '#4caf50',    // Green
    forRent: '#ff9800',    // Orange
    featured: '#e91e63',   // Pink
    sold: '#f44336',       // Red
    reserved: '#ffc107',   // Yellow
    available: '#4caf50',  // Green
  },

  // Social Media Colors
  social: {
    facebook: '#1877f2',
    google: '#db4437',
    apple: '#000000',
    whatsapp: '#25d366',
    twitter: '#1da1f2',
    linkedin: '#0a66c2',
  },

  // Property Type Colors
  propertyType: {
    residential: '#2196f3',
    commercial: '#ff9800',
    industrial: '#4caf50',
    plot: '#9c27b0',
    villa: '#e91e63',
    apartment: '#00bcd4',
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