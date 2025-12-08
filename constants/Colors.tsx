// Real Estate Color Palette (Green + White Theme)
export const Colors = {
  // Primary Colors (Brand Green)
  primary: {
    50:  '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#43a047', // Main Brand Green (real estate tone)
    600: '#388e3c',
    700: '#2e7d32',
    800: '#1b5e20',
    900: '#0d3d14',
  },

  // Secondary Colors (Soft Natural Real Estate Accents)
  secondary: {
    50:  '#f1f8e9',
    100: '#dcedc8',
    200: '#c5e1a5',
    300: '#aed581',
    400: '#9ccc65',
    500: '#8bc34a',
    600: '#7cb342',
    700: '#689f38',
    800: '#558b2f',
    900: '#33691e',
  },

  // Success
  success: {
    50: '#e8f5e9',
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

  // Warning (Real estate yellow tones)
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
    50:  '#fafafa',
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

  // Backgrounds for real estate UI
  background: {
    primary: '#ffffff',   // white
    secondary: '#f8faf8', // very light green tint
    tertiary: '#eef3ee',  // soft neutral
    inverse: '#1a1a1a',
    card: '#ffffff',
  },

  // Text Colors
  text: {
    primary: '#222222',
    secondary: '#388e3c',
    disabled: '#9e9e9e',
    inverse: '#ffffff',
    link: '#2e7d32',
  },

  // Border Colors
  border: {
    light: '#e0e0e0',
    medium: '#bdbdbd',
    dark: '#757575',
    focus: '#43a047',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
    accent: 'rgba(76, 175, 80, 0.2)',
  },

  // Statuses used in real estate apps
  status: {
    forSale: '#43a047',      // green
    forRent: '#8bc34a',      // lighter green
    featured: '#689f38',     // premium green
    sold: '#f44336',         // red
    reserved: '#fdd835',     // gold
    available: '#4caf50',
  },
info: {
  50: '#e8f5e9',
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
  // Social Colors
  social: {
    facebook: '#1877f2',
    google: '#db4437',
    apple: '#000000',
    whatsapp: '#25d366',
    twitter: '#1da1f2',
    linkedin: '#0a66c2',
  },
rose: {
  50: '#fff3f4',
  100: '#ffebee',
  200: '#ffcdd2',
  300: '#ef9a9a',
  400: '#e57373',
  500: '#ef5350',
  600: '#e53935',
  700: '#d32f2f',
  800: '#c62828',
  900: '#b71c1c',
},
violet: {
  50: '#f3e5f5',
  100: '#e1bee7',
  200: '#ce93d8',
  300: '#ba68c8',
  400: '#ab47bc',
  500: '#9c27b0',
  600: '#8e24aa',
  700: '#7b1fa2',
  800: '#6a1b9a',
  900: '#4a148c',
},
amber: {
  50: '#fff8e1',
  100: '#fff5d6',
  200: '#fff2bd',
  300: '#ffef99',
  400: '#ffe975',
  500: '#ffe550',
  600: '#ffd12d',
  700: '#ffbd25',
  800: '#ff9f17',
  900: '#ff9f17',
},

  // Property Type Colors
  propertyType: {
    residential: '#4caf50',
    commercial: '#689f38',
    industrial: '#2e7d32',
    plot: '#8bc34a',
    villa: '#43a047',
    apartment: '#66bb6a',
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