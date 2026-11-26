import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '@/state/AppContext';
import { useAppTheme, useThemeControls } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import type { FailureMode, SupportedLocale } from '@/types/domain';
import { TapTarget } from '@/components/common/TapTarget';

const LOCALE_OPTIONS: { code: SupportedLocale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
];

const FAILURE_OPTIONS: { mode: FailureMode; label: string }[] = [
  { mode: 'none', label: 'Healthy' },
  { mode: 'config', label: 'Fail /config' },
  { mode: 'slots', label: 'Fail /slots' },
  { mode: 'conflict_409', label: '409 Slot Taken' },
  { mode: 'all', label: 'Fail All' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useAppTheme();
  const { isDark, toggleDark } = useThemeControls();
  const { locale, setLocale, t } = useI18n();
  const { mockSettings, updateMockSettings, switchPreset } = useAppState();
  const { colors, spacing, radii, typography } = theme;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.sm,
        paddingHorizontal: spacing.screenHorizontal,
        paddingBottom: spacing.xxl,
        gap: spacing.md,
      }}
    >
      <Text style={{ color: colors.textPrimary, fontSize: typography.xxl, fontWeight: '800' }}>
        {t.profileTitle}
      </Text>

      {/* Language Selector */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.cardPadding,
            gap: spacing.sm,
          },
        ]}
      >
        <Text style={{ color: colors.textPrimary, fontSize: typography.md, fontWeight: '700' }}>
          {t.languageLabel}
        </Text>
        <View style={[styles.chipRow, { gap: spacing.xs }]}>
          {LOCALE_OPTIONS.map((opt) => {
            const active = locale === opt.code;
            return (
              <TapTarget
                key={opt.code}
                onPress={() => setLocale(opt.code)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: active ? colors.primary : colors.surfaceMuted,
                    borderColor: active ? colors.primary : colors.border,
                    borderRadius: radii.pill,
                    paddingHorizontal: spacing.md,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? colors.onPrimary : colors.textPrimary,
                    fontSize: typography.xs,
                    fontWeight: '700',
                  }}
                >
                  {opt.label}
                </Text>
              </TapTarget>
            );
          })}
        </View>
      </View>

      {/* Remote Config & Theme Controls */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.cardPadding,
            gap: spacing.sm,
          },
        ]}
      >
        <Text style={{ color: colors.textPrimary, fontSize: typography.md, fontWeight: '700' }}>
          {t.appearanceSection}
        </Text>

        <View style={[styles.chipRow, { gap: spacing.xs }]}>
          <TapTarget
            onPress={() => switchPreset('normal')}
            style={[
              styles.pill,
              {
                backgroundColor:
                  mockSettings.preset === 'normal' ? colors.primary : colors.surfaceMuted,
                borderColor:
                  mockSettings.preset === 'normal' ? colors.primary : colors.border,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <Text
              style={{
                color: mockSettings.preset === 'normal' ? colors.onPrimary : colors.textPrimary,
                fontSize: typography.xs,
                fontWeight: '700',
              }}
            >
              {t.normalTheme}
            </Text>
          </TapTarget>

          <TapTarget
            onPress={() => switchPreset('festival')}
            style={[
              styles.pill,
              {
                backgroundColor:
                  mockSettings.preset === 'festival' ? colors.accent : colors.surfaceMuted,
                borderColor:
                  mockSettings.preset === 'festival' ? colors.accent : colors.border,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <Text
              style={{
                color:
                  mockSettings.preset === 'festival' ? colors.textOnAccent : colors.textPrimary,
                fontSize: typography.xs,
                fontWeight: '700',
              }}
            >
              {t.festivalTheme}
            </Text>
          </TapTarget>
        </View>

        <View style={styles.switchRow}>
          <Text style={{ color: colors.textPrimary, fontSize: typography.sm, fontWeight: '600' }}>
            {t.darkMode}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleDark}
            trackColor={{ false: colors.borderStrong, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>

        <TapTarget
          onPress={() => router.push('/admin')}
          style={[
            styles.adminBtn,
            {
              backgroundColor: colors.primarySoft,
              borderColor: colors.primary,
              borderRadius: radii.md,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <Ionicons name="code-slash-outline" size={18} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: typography.sm, fontWeight: '700', flex: 1 }}>
            {t.openAdminEditor}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </TapTarget>
      </View>

      {/* Mock Network & Resilience Switches */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.cardPadding,
            gap: spacing.sm,
          },
        ]}
      >
        <Text style={{ color: colors.textPrimary, fontSize: typography.md, fontWeight: '700' }}>
          {t.resilienceSection}
        </Text>

        <Text style={{ color: colors.textSecondary, fontSize: typography.xs, fontWeight: '600' }}>
          {t.latencyLabel}
        </Text>
        <View style={[styles.chipRow, { gap: spacing.xs }]}>
          <TapTarget
            onPress={() => updateMockSettings({ latencyMode: 'normal' })}
            style={[
              styles.pill,
              {
                backgroundColor:
                  mockSettings.latencyMode === 'normal' ? colors.primary : colors.surfaceMuted,
                borderColor:
                  mockSettings.latencyMode === 'normal' ? colors.primary : colors.border,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <Text
              style={{
                color:
                  mockSettings.latencyMode === 'normal' ? colors.onPrimary : colors.textPrimary,
                fontSize: typography.xs,
                fontWeight: '700',
              }}
            >
              {t.latencyNormal}
            </Text>
          </TapTarget>

          <TapTarget
            onPress={() => updateMockSettings({ latencyMode: 'slow' })}
            style={[
              styles.pill,
              {
                backgroundColor:
                  mockSettings.latencyMode === 'slow' ? colors.warning : colors.surfaceMuted,
                borderColor:
                  mockSettings.latencyMode === 'slow' ? colors.warning : colors.border,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <Text
              style={{
                color:
                  mockSettings.latencyMode === 'slow' ? colors.onPrimary : colors.textPrimary,
                fontSize: typography.xs,
                fontWeight: '700',
              }}
            >
              {t.latencySlow}
            </Text>
          </TapTarget>
        </View>

        <Text style={{ color: colors.textSecondary, fontSize: typography.xs, fontWeight: '600' }}>
          {t.failureLabel}
        </Text>
        <View style={[styles.chipRow, { gap: spacing.xs }]}>
          {FAILURE_OPTIONS.map((opt) => {
            const active = mockSettings.failureMode === opt.mode;
            return (
              <TapTarget
                key={opt.mode}
                onPress={() => updateMockSettings({ failureMode: opt.mode })}
                style={[
                  styles.pill,
                  {
                    backgroundColor: active
                      ? opt.mode === 'none'
                        ? colors.success
                        : colors.error
                      : colors.surfaceMuted,
                    borderColor: active
                      ? opt.mode === 'none'
                        ? colors.success
                        : colors.error
                      : colors.border,
                    borderRadius: radii.pill,
                    paddingHorizontal: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? colors.onPrimary : colors.textPrimary,
                    fontSize: typography.xs,
                    fontWeight: '700',
                  }}
                >
                  {opt.label}
                </Text>
              </TapTarget>
            );
          })}
        </View>

        <View style={styles.switchRow}>
          <Text style={{ color: colors.textPrimary, fontSize: typography.sm, fontWeight: '600', flex: 1 }}>
            {t.offlineQueueToggle}
          </Text>
          <Switch
            value={mockSettings.offlineMode}
            onValueChange={(val) => {
              updateMockSettings({ offlineMode: val }).catch(() => {});
            }}
            trackColor={{ false: colors.borderStrong, true: colors.warning }}
            thumbColor={colors.surface}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  sectionCard: {
    borderWidth: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    borderWidth: 1,
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 10,
  },
});
