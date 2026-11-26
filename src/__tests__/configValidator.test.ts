/// <reference types="jest" />
import { FESTIVAL_LAYOUT_CONFIG, NORMAL_LAYOUT_CONFIG } from '@/api/mockData';
import { validateLayoutConfig } from '@/validation/configValidator';

describe('validateLayoutConfig', () => {
  it('accepts both shipped normal and festival configs cleanly', () => {
    const normalRes = validateLayoutConfig(NORMAL_LAYOUT_CONFIG);
    expect(normalRes.valid).toBe(true);
    if (normalRes.valid) {
      expect(normalRes.config.version).toBe(NORMAL_LAYOUT_CONFIG.version);
      expect(normalRes.config.sections.length).toBeGreaterThan(0);
    }

    const festivalRes = validateLayoutConfig(FESTIVAL_LAYOUT_CONFIG);
    expect(festivalRes.valid).toBe(true);
    if (festivalRes.valid) {
      expect(festivalRes.config.theme.festival?.name).toBe('Diwali');
      expect(festivalRes.warnings).toHaveLength(0);
    }
  });

  it('rejects non-object payloads and missing required theme fields', () => {
    expect(validateLayoutConfig(null).valid).toBe(false);
    expect(validateLayoutConfig('not-an-object').valid).toBe(false);

    const missingTheme = validateLayoutConfig({
      version: 1,
      theme: { primary: '#0F766E' },
      tabs: NORMAL_LAYOUT_CONFIG.tabs,
      sections: [],
    });
    expect(missingTheme.valid).toBe(false);
    if (!missingTheme.valid) {
      expect(missingTheme.errors.length).toBeGreaterThan(0);
    }
  });

  it('falls back gracefully on malformed colors while keeping unknown sections for skip', () => {
    const raw = {
      ...NORMAL_LAYOUT_CONFIG,
      theme: {
        ...NORMAL_LAYOUT_CONFIG.theme,
        primary: 'not-a-hex-color',
      },
      sections: [
        ...NORMAL_LAYOUT_CONFIG.sections,
        {
          id: 'sec-experimental',
          type: 'brand_new_server_widget',
          background: { kind: 'color', value: '#FFFFFF' },
          items: [{ foo: 'bar' }],
        },
      ],
    };

    const res = validateLayoutConfig(raw);
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.warnings.some((w) => w.includes('theme.primary'))).toBe(true);
      expect(res.config.sections.some((s) => s.type === 'brand_new_server_widget')).toBe(true);
    }
  });
});
