import type { ConfigTheme, FestivalThemeMeta } from '@/types/domain';

export type AppColors = {
  primary: string;
  primarySoft: string;
  onPrimary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textOnAccent: string;
  accent: string;
  accentSoft: string;
  border: string;
  borderStrong: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  skeletonBase: string;
  skeletonHighlight: string;
  backdrop: string;
  tabBarBg: string;
  shadow: string;
};

export type AppSpacing = {
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  sectionGap: number;
  cardPadding: number;
  screenHorizontal: number;
};

export type AppRadii = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
};

export type AppTypography = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  hero: number;
};

export type AppTheme = {
  isDark: boolean;
  colors: AppColors;
  spacing: AppSpacing;
  radii: AppRadii;
  typography: AppTypography;
  minTapTarget: number;
  festival?: FestivalThemeMeta;
};

function parseHexRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned.charAt(0) + cleaned.charAt(0), 16);
    const g = parseInt(cleaned.charAt(1) + cleaned.charAt(1), 16);
    const b = parseInt(cleaned.charAt(2) + cleaned.charAt(2), 16);
    return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : { r, g, b };
  }
  if (cleaned.length === 6 || cleaned.length === 8) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : { r, g, b };
  }
  return null;
}

export function withAlpha(hexOrColor: string, alpha: number): string {
  const rgb = parseHexRgb(hexOrColor);
  if (!rgb) {
    return hexOrColor;
  }
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function getRelativeLuminance(hex: string): number {
  const rgb = parseHexRgb(hex);
  if (!rgb) return 0.5;
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
}

export function pickReadableTextOn(bgHex: string, lightText: string, darkText: string): string {
  return getRelativeLuminance(bgHex) > 0.42 ? darkText : lightText;
}

function mixHex(hexA: string, hexB: string, ratioB: number): string {
  const a = parseHexRgb(hexA);
  const b = parseHexRgb(hexB);
  if (!a || !b) return hexA;
  const mix = (x: number, y: number) => Math.round(x * (1 - ratioB) + y * ratioB);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix(a.r, b.r))}${toHex(mix(a.g, b.g))}${toHex(mix(a.b, b.b))}`;
}

export function deriveThemeFromConfig(configTheme: ConfigTheme, isDark: boolean): AppTheme {
  const palette = isDark
    ? configTheme.dark ?? {
        primary: mixHex(configTheme.primary, '#FFFFFF', 0.28),
        secondary: mixHex(configTheme.secondary, '#FFFFFF', 0.2),
        background: '#0B1315',
        surface: '#132024',
        textPrimary: '#F1F5F9',
        textSecondary: '#94A3B8',
        accent: mixHex(configTheme.accent, '#FFFFFF', 0.18),
      }
    : configTheme;

  const spacingScale = configTheme.spacingScale ?? 1;
  const fontScale = configTheme.fontScale ?? 1;

  const lightOnDark = '#FFFFFF';
  const darkOnLight = '#0F172A';

  const success = isDark ? '#34D399' : '#059669';
  const warning = isDark ? '#FBBF24' : '#D97706';
  const error = isDark ? '#F87171' : '#DC2626';

  return {
    isDark,
    colors: {
      primary: palette.primary,
      primarySoft: withAlpha(palette.primary, isDark ? 0.2 : 0.12),
      onPrimary: pickReadableTextOn(palette.primary, lightOnDark, darkOnLight),
      secondary: palette.secondary,
      background: palette.background,
      surface: palette.surface,
      surfaceElevated: isDark
        ? mixHex(palette.surface, '#FFFFFF', 0.06)
        : mixHex(palette.surface, '#FFFFFF', 0.5),
      surfaceMuted: isDark
        ? mixHex(palette.surface, '#FFFFFF', 0.08)
        : mixHex(palette.background, palette.primary, 0.05),
      textPrimary: palette.textPrimary,
      textSecondary: palette.textSecondary,
      textOnAccent: pickReadableTextOn(palette.accent, lightOnDark, darkOnLight),
      accent: palette.accent,
      accentSoft: withAlpha(palette.accent, isDark ? 0.22 : 0.14),
      border: withAlpha(palette.textSecondary, isDark ? 0.24 : 0.18),
      borderStrong: withAlpha(palette.textSecondary, isDark ? 0.42 : 0.34),
      success,
      successSoft: withAlpha(success, isDark ? 0.22 : 0.12),
      warning,
      warningSoft: withAlpha(warning, isDark ? 0.22 : 0.13),
      error,
      errorSoft: withAlpha(error, isDark ? 0.22 : 0.11),
      skeletonBase: isDark
        ? mixHex(palette.surface, '#FFFFFF', 0.08)
        : mixHex(palette.background, palette.textSecondary, 0.12),
      skeletonHighlight: isDark
        ? mixHex(palette.surface, '#FFFFFF', 0.16)
        : mixHex(palette.surface, palette.background, 0.35),
      backdrop: withAlpha('#000000', isDark ? 0.72 : 0.48),
      tabBarBg: palette.surface,
      shadow: '#000000',
    },
    spacing: {
      xxs: Math.round(4 * spacingScale),
      xs: Math.round(8 * spacingScale),
      sm: Math.round(12 * spacingScale),
      md: Math.round(16 * spacingScale),
      lg: Math.round(20 * spacingScale),
      xl: Math.round(24 * spacingScale),
      xxl: Math.round(32 * spacingScale),
      sectionGap: Math.round(14 * spacingScale),
      cardPadding: Math.round(14 * spacingScale),
      screenHorizontal: Math.round(16 * spacingScale),
    },
    radii: {
      xs: 6,
      sm: 10,
      md: 14,
      lg: 18,
      xl: 24,
      pill: 999,
    },
    typography: {
      xs: Math.round(11 * fontScale),
      sm: Math.round(13 * fontScale),
      md: Math.round(15 * fontScale),
      lg: Math.round(17 * fontScale),
      xl: Math.round(20 * fontScale),
      xxl: Math.round(24 * fontScale),
      hero: Math.round(26 * fontScale),
    },
    minTapTarget: 44,
    festival: configTheme.festival,
  };
}
