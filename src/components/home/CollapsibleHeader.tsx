import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  type SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme, useThemeControls } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import type { ConfigPreset, SupportedLocale } from '@/types/domain';
import { TapTarget } from '@/components/common/TapTarget';

type CollapsibleHeaderProps = {
  scrollY: SharedValue<number>;
  preset: ConfigPreset;
  onTogglePreset: () => void;
  onSearchPress: () => void;
};

const NEXT_LOCALE: Record<SupportedLocale, SupportedLocale> = {
  en: 'hi',
  hi: 'te',
  te: 'en',
};

const LOCALE_BADGE: Record<SupportedLocale, string> = {
  en: 'EN',
  hi: 'हिं',
  te: 'తె',
};

export function CollapsibleHeader({
  scrollY,
  preset,
  onTogglePreset,
  onSearchPress,
}: CollapsibleHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { isDark, toggleDark } = useThemeControls();
  const { locale, setLocale, t } = useI18n();
  const { colors, spacing, radii, typography } = theme;

  const searchCollapseStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, 72], [50, 0], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, 48], [1, 0], Extrapolation.CLAMP);
    const marginTop = interpolate(scrollY.value, [0, 72], [8, 0], Extrapolation.CLAMP);
    return {
      height,
      opacity,
      marginTop,
      overflow: 'hidden',
    };
  });

  const subtitleCollapseStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], Extrapolation.CLAMP);
    const height = interpolate(scrollY.value, [0, 50], [18, 0], Extrapolation.CLAMP);
    return { opacity, height, overflow: 'hidden' };
  });

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: insets.top + spacing.xs,
          paddingBottom: spacing.sm,
          paddingHorizontal: spacing.screenHorizontal,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={[styles.topRow, { gap: spacing.xs }]}>
        <View style={styles.brandBlock}>
          <View style={[styles.locationRow, { gap: spacing.xxs }]}>
            <View
              style={[
                styles.brandDot,
                { backgroundColor: colors.primary, borderRadius: radii.pill },
              ]}
            />
            <Text
              numberOfLines={1}
              style={{
                color: colors.textPrimary,
                fontSize: typography.lg,
                fontWeight: '800',
              }}
            >
              {t.appName}
            </Text>
            {theme.festival ? (
              <View
                style={[
                  styles.festivalBadge,
                  {
                    backgroundColor: colors.accentSoft,
                    borderRadius: radii.pill,
                    paddingHorizontal: spacing.xs,
                    paddingVertical: 2,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.accent,
                    fontSize: typography.xs,
                    fontWeight: '700',
                  }}
                >
                  {theme.festival.name}
                </Text>
              </View>
            ) : null}
          </View>

          <Animated.View style={subtitleCollapseStyle}>
            <View style={[styles.locationRow, { gap: spacing.xxs }]}>
              <Ionicons name="location-outline" size={13} color={colors.primary} />
              <Text
                numberOfLines={1}
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.xs,
                  fontWeight: '500',
                }}
              >
                {t.clinicLocation}
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={[styles.controlsRow, { gap: spacing.xxs }]}>
          <TapTarget
            accessibilityLabel={preset === 'normal' ? t.festivalTheme : t.normalTheme}
            onPress={onTogglePreset}
            style={[
              styles.pillControl,
              {
                backgroundColor: preset === 'festival' ? colors.accentSoft : colors.primarySoft,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.sm,
              },
            ]}
          >
            <Ionicons
              name={preset === 'festival' ? 'sparkles' : 'sunny-outline'}
              size={15}
              color={preset === 'festival' ? colors.accent : colors.primary}
            />
            <Text
              style={{
                color: preset === 'festival' ? colors.accent : colors.primary,
                fontSize: typography.xs,
                fontWeight: '700',
              }}
            >
              {preset === 'festival' ? t.festivalTheme : t.normalTheme}
            </Text>
          </TapTarget>

          <TapTarget
            accessibilityLabel={isDark ? t.lightMode : t.darkMode}
            onPress={toggleDark}
            style={[
              styles.iconControl,
              {
                backgroundColor: colors.surfaceMuted,
                borderRadius: radii.pill,
              },
            ]}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon-outline'}
              size={17}
              color={colors.textPrimary}
            />
          </TapTarget>

          <TapTarget
            accessibilityLabel={t.languageLabel}
            onPress={() => setLocale(NEXT_LOCALE[locale])}
            style={[
              styles.iconControl,
              {
                backgroundColor: colors.surfaceMuted,
                borderRadius: radii.pill,
              },
            ]}
          >
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: typography.xs,
                fontWeight: '800',
              }}
            >
              {LOCALE_BADGE[locale]}
            </Text>
          </TapTarget>
        </View>
      </View>

      <Animated.View style={searchCollapseStyle}>
        <TapTarget
          accessibilityLabel={t.searchPlaceholder}
          onPress={onSearchPress}
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderRadius: radii.md,
              paddingHorizontal: spacing.sm,
              gap: spacing.xs,
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
          <Text
            numberOfLines={1}
            style={{
              color: colors.textSecondary,
              fontSize: typography.sm,
              flex: 1,
            }}
          >
            {t.searchPlaceholder}
          </Text>
        </TapTarget>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandBlock: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandDot: {
    width: 10,
    height: 10,
  },
  festivalBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconControl: {
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 46,
  },
});
