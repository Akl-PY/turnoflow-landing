export const theme = {
  colors: {
    // Brand Core
    primary: '#0F172A',         // Slate 900
    primaryLight: '#1E293B',    // Slate 800
    primaryMuted: '#334155',    // Slate 700
    
    // Accents (Emerald / Growth / Booking)
    accent: '#10B981',          // Emerald 500
    accentHover: '#059669',     // Emerald 600
    accentDark: '#047857',      // Emerald 700
    accentLight: '#D1FAE5',     // Emerald 100
    accentSubtle: '#ECFDF5',    // Emerald 50
    accentGlow: 'rgba(16, 185, 129, 0.15)',

    // Secondary Accent (Linear Indigo / AI glow)
    brandPurple: '#6366F1',
    brandPurpleLight: '#EEF2FF',
    brandPurpleGlow: 'rgba(99, 102, 241, 0.15)',

    // Neutrals
    background: '#FFFFFF',
    surface: '#F8FAFC',        // Slate 50
    surfaceCard: '#FFFFFF',
    surfaceDark: '#090D16',     // Premium deep slate
    surfaceDarkElevated: '#111827',
    surfaceDarkBorder: 'rgba(255, 255, 255, 0.08)',

    border: '#E2E8F0',         // Slate 200
    borderLight: '#F1F5F9',    // Slate 100
    borderFocus: '#10B981',

    // Text
    textPrimary: '#0F172A',
    textSecondary: '#475569',  // Slate 600
    textMuted: '#64748B',      // Slate 500
    textLight: '#94A3B8',      // Slate 400
    textWhite: '#FFFFFF',

    // Feedback
    success: '#10B981',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#EFF6FF',
  },
  typography: {
    fontDisplay: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    size: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 38,
      '5xl': 48,
      '6xl': 58,
    },
    weight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    subtle: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 16,
      elevation: 4,
    },
    floating: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 28,
      elevation: 8,
    },
    glow: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 6,
    },
  },
};
