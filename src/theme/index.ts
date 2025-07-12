import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive utilities
export const Responsive = {
  // Screen dimensions
  width: width,
  height: height,

  // Responsive sizing
  getWidth: (percentage: number) => (width * percentage) / 100,
  getHeight: (percentage: number) => (height * percentage) / 100,

  // Font scaling
  getFontSize: (size: number) => {
    const scale = width / 375; // Base width of iPhone X
    return Math.round(size * scale);
  },

  // Device detection
  isTablet: width >= 768,
  isSmallDevice: width < 375,

  // Platform specific
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

// Color palette
export const COLORS = {
  // 🌟 Primary colors (Elegant Deep Blue)
  primary: '#254E70',           // Premium Deep Blue
  primaryLight: '#5C7EA4',      // Muted Sky Blue
  primaryDark: '#1A3A57',       // Deep Navy Blue

  // 🌿 Secondary colors (Luxury Deep Green)
  secondary: '#2E4F4F',         // Deep Desaturated Teal
  secondaryLight: '#587F7F',    // Misty Green
  secondaryDark: '#1E3535',     // Very Dark Teal

  // 🧱 Background colors
  background: '#F4F6F8',        // Soft Light Gray
  surface: '#FFFFFF',           // Pure White for cards
  surfaceSecondary: '#EDF1F5',  // Pale Gray-Blue for subtle contrast

  // 📝 Text colors
  text: '#1A1D1F',              // Elegant near-black
  textSecondary: '#5B5B5B',     // Cool Gray
  textTertiary: '#9BA3AF',      // Soft Neutral Gray
  textInverse: '#FFFFFF',       // On dark backgrounds

  // ✅ Status colors
  success: '#4CAF50',           // Green for confirmation
  warning: '#FFB74D',           // Warm amber warning
  error: '#F44336',             // Bright red for errors
  info: '#42A5F5',              // Soft info blue

  // 🪟 Border colors
  border: '#D8DADC',            // Light steel gray
  borderLight: '#EAEDEF',       // Subtle border for light backgrounds

  // ☁️ Overlay colors
  overlay: 'rgba(0, 0, 0, 0.55)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',

  // 🕶️ Shadow colors
  shadow: 'rgba(33, 33, 33, 0.15)',

  // Legacy support (mapped to new equivalents)
  accent1: '#254E70',          // Same as primary
  accent2: '#5C7EA4',          // Primary light
  accent3: '#2E4F4F',          // Secondary
  dark: '#1A1D1F',             // Text/Dark backgrounds
  subtext: '#5B5B5B',          // Secondary text
  subtext2: '#9BA3AF',         // Tertiary text
  white: '#FFFFFF',            // Base white
};

// Spacing system
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Responsive spacing
  getResponsiveSpacing: (base: number) => {
    if (Responsive.isTablet) return base * 1.5;
    if (Responsive.isSmallDevice) return base * 0.8;
    return base;
  },
};

// Typography
export const Typography = {
  // Font sizes
  xs: Responsive.getFontSize(12),
  sm: Responsive.getFontSize(14),
  base: Responsive.getFontSize(16),
  lg: Responsive.getFontSize(18),
  xl: Responsive.getFontSize(20),
  '2xl': Responsive.getFontSize(24),
  '3xl': Responsive.getFontSize(28),
  '4xl': Responsive.getFontSize(32),

  // Font weights
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Border radius
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,

  // Legacy support
  CARD_RADIUS: 18,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },

  // Legacy support
  CARD_SHADOW: {
    shadowColor: COLORS.accent2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};

// Layout constants
export const Layout = {
  // Screen padding
  screenPadding: Spacing.getResponsiveSpacing(Spacing.md),

  // Header height
  headerHeight: Responsive.isIOS ? 44 : 56,

  // Tab bar height
  tabBarHeight: Responsive.isIOS ? 83 : 60,

  // Status bar height
  statusBarHeight: StatusBar.currentHeight || 0,

  // Safe area
  safeAreaTop: Responsive.isIOS ? 44 : 20,
  safeAreaBottom: Responsive.isIOS ? 34 : 0,
};

// Animation durations
export const Animation = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Z-index values
export const ZIndex = {
  base: 0,
  dropdown: 100,
  modal: 1000,
  overlay: 2000,
  tooltip: 3000,
};

// Theme object for easy import
export const Theme = {
  COLORS,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
  Layout,
  Animation,
  ZIndex,
  Responsive,
};

export default Theme; 