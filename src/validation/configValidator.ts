import type {
  BackgroundSpec,
  ConfigSection,
  ConfigTab,
  ConfigTheme,
  LayoutConfig,
  TabScreenName,
} from '@/types/domain';

export type ConfigValidationResult =
  | { valid: true; config: LayoutConfig; warnings: string[] }
  | { valid: false; errors: string[] };

const VALID_SCREENS = new Set<TabScreenName>(['home', 'bookings', 'prescriptions', 'profile']);
const HEX_OR_RGB_RE =
  /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\))$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateColor(value: unknown, fallback: string, field: string, warnings: string[]): string {
  if (typeof value === 'string' && HEX_OR_RGB_RE.test(value.trim())) {
    return value.trim();
  }
  warnings.push(`Invalid color for ${field}; using fallback`);
  return fallback;
}

const DEFAULT_FALLBACK_THEME: ConfigTheme = {
  primary: '#0F766E',
  secondary: '#134E4A',
  background: '#F4FBF9',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  accent: '#D97706',
};

function parseTheme(raw: unknown, warnings: string[], errors: string[]): ConfigTheme | null {
  if (!isRecord(raw)) {
    errors.push('theme must be an object');
    return null;
  }

  const requiredColorKeys = [
    'primary',
    'secondary',
    'background',
    'surface',
    'textPrimary',
    'textSecondary',
    'accent',
  ] as const;

  for (const key of requiredColorKeys) {
    if (!isNonEmptyString(raw[key])) {
      errors.push(`theme.${key} is required`);
    }
  }
  if (errors.length > 0) {
    return null;
  }

  const theme: ConfigTheme = {
    primary: validateColor(raw.primary, DEFAULT_FALLBACK_THEME.primary, 'theme.primary', warnings),
    secondary: validateColor(raw.secondary, DEFAULT_FALLBACK_THEME.secondary, 'theme.secondary', warnings),
    background: validateColor(raw.background, DEFAULT_FALLBACK_THEME.background, 'theme.background', warnings),
    surface: validateColor(raw.surface, DEFAULT_FALLBACK_THEME.surface, 'theme.surface', warnings),
    textPrimary: validateColor(raw.textPrimary, DEFAULT_FALLBACK_THEME.textPrimary, 'theme.textPrimary', warnings),
    textSecondary: validateColor(raw.textSecondary, DEFAULT_FALLBACK_THEME.textSecondary, 'theme.textSecondary', warnings),
    accent: validateColor(raw.accent, DEFAULT_FALLBACK_THEME.accent, 'theme.accent', warnings),
  };

  if (isRecord(raw.festival)) {
    const f = raw.festival;
    if (isNonEmptyString(f.name) && isNonEmptyString(f.greeting)) {
      theme.festival = {
        name: f.name.trim(),
        greeting: f.greeting.trim(),
        bannerImageUrl: typeof f.bannerImageUrl === 'string' ? f.bannerImageUrl.trim() : '',
      };
    } else {
      warnings.push('theme.festival was incomplete and skipped');
    }
  }

  if (isRecord(raw.dark)) {
    const d = raw.dark;
    theme.dark = {
      primary: validateColor(d.primary, '#2DD4BF', 'theme.dark.primary', warnings),
      secondary: validateColor(d.secondary, '#14B8A6', 'theme.dark.secondary', warnings),
      background: validateColor(d.background, '#0B1416', 'theme.dark.background', warnings),
      surface: validateColor(d.surface, '#132226', 'theme.dark.surface', warnings),
      textPrimary: validateColor(d.textPrimary, '#F1F5F9', 'theme.dark.textPrimary', warnings),
      textSecondary: validateColor(d.textSecondary, '#94A3B8', 'theme.dark.textSecondary', warnings),
      accent: validateColor(d.accent, '#FBBF24', 'theme.dark.accent', warnings),
    };
  }

  if (typeof raw.spacingScale === 'number' && raw.spacingScale >= 0.75 && raw.spacingScale <= 1.5) {
    theme.spacingScale = raw.spacingScale;
  }

  if (typeof raw.fontScale === 'number' && raw.fontScale >= 0.85 && raw.fontScale <= 1.35) {
    theme.fontScale = raw.fontScale;
  }

  return theme;
}

function parseTabs(raw: unknown, warnings: string[]): ConfigTab[] {
  if (!Array.isArray(raw)) {
    warnings.push('tabs missing or not an array; using default tabs');
    return [];
  }

  const tabs: ConfigTab[] = [];
  for (const item of raw) {
    if (!isRecord(item)) {
      warnings.push('Skipped malformed tab entry');
      continue;
    }
    const screen = item.screen;
    if (
      isNonEmptyString(item.id) &&
      isNonEmptyString(item.label) &&
      isNonEmptyString(item.icon) &&
      typeof screen === 'string' &&
      VALID_SCREENS.has(screen as TabScreenName)
    ) {
      tabs.push({
        id: item.id.trim(),
        label: item.label.trim(),
        icon: item.icon.trim(),
        screen: screen as TabScreenName,
      });
    } else {
      warnings.push(`Skipped invalid tab: ${String(item.id ?? 'unknown')}`);
    }
  }
  return tabs;
}

function parseBackground(raw: unknown, fallbackColor: string, warnings: string[]): BackgroundSpec {
  if (!isRecord(raw)) {
    warnings.push('Missing section background; falling back to solid surface');
    return { kind: 'color', value: fallbackColor };
  }
  const kind = raw.kind;
  const value = raw.value;
  if ((kind === 'color' || kind === 'gradient' || kind === 'image') && isNonEmptyString(value)) {
    return { kind, value: value.trim() };
  }
  warnings.push('Invalid section background; falling back to solid surface');
  return { kind: 'color', value: fallbackColor };
}

function parseSections(raw: unknown, fallbackBg: string, warnings: string[]): ConfigSection[] {
  if (!Array.isArray(raw)) {
    warnings.push('sections missing or not an array');
    return [];
  }

  const sections: ConfigSection[] = [];
  for (const item of raw) {
    if (!isRecord(item)) {
      warnings.push('Skipped non-object section');
      continue;
    }
    if (!isNonEmptyString(item.id) || !isNonEmptyString(item.type)) {
      warnings.push('Skipped section missing id or type');
      continue;
    }
    const items = Array.isArray(item.items) ? item.items : [];
    if (!Array.isArray(item.items)) {
      warnings.push(`Section "${item.id}" items was not an array; defaulted to []`);
    }

    sections.push({
      id: item.id.trim(),
      type: item.type.trim(),
      background: parseBackground(item.background, fallbackBg, warnings),
      title: isNonEmptyString(item.title) ? item.title.trim() : undefined,
      items,
    });
  }
  return sections;
}

export function validateLayoutConfig(input: unknown): ConfigValidationResult {
  if (!isRecord(input)) {
    return { valid: false, errors: ['Config payload must be a JSON object'] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof input.version !== 'number' || !Number.isFinite(input.version) || input.version < 1) {
    errors.push('version must be a positive number');
  }

  const theme = parseTheme(input.theme, warnings, errors);
  if (!theme || errors.length > 0) {
    return { valid: false, errors };
  }

  const tabs = parseTabs(input.tabs, warnings);
  if (tabs.length === 0) {
    return { valid: false, errors: ['At least one valid tab is required'] };
  }

  const sections = parseSections(input.sections, theme.surface, warnings);

  return {
    valid: true,
    config: {
      version: input.version as number,
      theme,
      tabs,
      sections,
    },
    warnings,
  };
}
