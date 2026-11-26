import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import type { ServiceGridItem } from '@/types/domain';
import { TapTarget } from '@/components/common/TapTarget';

type ServiceGridSectionProps = {
  title?: string;
  items: unknown[];
  selectedCategory: string | null;
  onClearCategory: () => void;
  onBookService: (service: ServiceGridItem) => void;
};

const SERVICE_ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  'pulse-outline': 'pulse-outline',
  'water-outline': 'water-outline',
  'thermometer-outline': 'thermometer-outline',
  'heart-outline': 'heart-outline',
  'shield-checkmark-outline': 'shield-checkmark-outline',
  'medkit-outline': 'medkit-outline',
  'fitness-outline': 'fitness-outline',
  'sunny-outline': 'sunny-outline',
};

export function ServiceGridSection({
  title,
  items,
  selectedCategory,
  onClearCategory,
  onBookService,
}: ServiceGridSectionProps) {
  const theme = useAppTheme();
  const { t } = useI18n();
  const { colors, spacing, radii, typography } = theme;

  const allServices = items.filter(
    (x): x is ServiceGridItem =>
      typeof x === 'object' && x !== null && 'id' in x && 'name' in x && 'priceInr' in x
  );

  const services = selectedCategory
    ? allServices.filter((s) => !s.category || s.category === selectedCategory)
    : allServices;

  if (allServices.length === 0) return null;

  return (
    <View
      style={{
        paddingHorizontal: spacing.screenHorizontal,
        paddingVertical: spacing.md,
        gap: spacing.sm,
      }}
    >
      <View style={styles.headerRow}>
        {title ? (
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.lg,
              fontWeight: '700',
              flex: 1,
            }}
          >
            {title}
          </Text>
        ) : null}

        {selectedCategory ? (
          <TapTarget
            onPress={onClearCategory}
            style={[
              styles.clearChip,
              {
                backgroundColor: colors.primarySoft,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.sm,
              },
            ]}
          >
            <Text style={{ color: colors.primary, fontSize: typography.xs, fontWeight: '700' }}>
              {selectedCategory} ✕
            </Text>
          </TapTarget>
        ) : null}
      </View>

      <View style={[styles.grid, { gap: spacing.sm }]}>
        {services.map((srv) => {
          const iconName = SERVICE_ICON_MAP[srv.icon ?? ''] ?? 'medkit-outline';
          return (
            <TapTarget
              key={srv.id}
              onPress={() => onBookService(srv)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radii.lg,
                  padding: spacing.cardPadding,
                  gap: spacing.xs,
                },
              ]}
            >
              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: colors.primarySoft,
                      borderRadius: radii.md,
                    },
                  ]}
                >
                  <Ionicons name={iconName} size={24} color={colors.primary} />
                </View>

                {srv.badge ? (
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: colors.accentSoft,
                        borderRadius: radii.xs,
                        paddingHorizontal: spacing.xs,
                        paddingVertical: 2,
                      },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        color: colors.accent,
                        fontSize: typography.xs - 1,
                        fontWeight: '800',
                      }}
                    >
                      {srv.badge}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text
                numberOfLines={2}
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.sm,
                  fontWeight: '700',
                  lineHeight: 20,
                }}
              >
                {srv.name}
              </Text>

              {srv.durationLabel ? (
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.xs,
                  }}
                >
                  {srv.durationLabel}
                </Text>
              ) : null}

              <View style={[styles.priceRow, { marginTop: spacing.xxs }]}>
                <View style={styles.priceStack}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: typography.md,
                      fontWeight: '800',
                    }}
                  >
                    ₹{srv.priceInr}
                  </Text>
                  {srv.originalPriceInr ? (
                    <Text
                      style={[
                        styles.strikePrice,
                        {
                          color: colors.textSecondary,
                          fontSize: typography.xs,
                        },
                      ]}
                    >
                      ₹{srv.originalPriceInr}
                    </Text>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.addPill,
                    {
                      backgroundColor: colors.primarySoft,
                      borderColor: colors.primary,
                      borderRadius: radii.sm,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xxs + 2,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: typography.xs,
                      fontWeight: '800',
                    }}
                  >
                    {t.bookNow}
                  </Text>
                </View>
              </View>
            </TapTarget>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearChip: {
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48.2%',
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    maxWidth: '64%',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceStack: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  strikePrice: {
    textDecorationLine: 'line-through',
  },
  addPill: {
    borderWidth: 1,
  },
});
