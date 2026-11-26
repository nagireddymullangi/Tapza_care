import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeContext';
import type { OfferStripItem } from '@/types/domain';

type OfferStripSectionProps = {
  items: unknown[];
};

export function OfferStripSection({ items }: OfferStripSectionProps) {
  const theme = useAppTheme();
  const { colors, spacing, radii, typography } = theme;

  const offer = items[0] as OfferStripItem | undefined;
  if (!offer || typeof offer.message !== 'string') return null;

  // On bright warm offer gradient strips in light mode, dark text ensures readability;
  // in dark mode SectionRenderer adapts background to dark surface so textPrimary is crisp.
  const textColor = colors.textPrimary;

  return (
    <View
      style={[
        styles.strip,
        {
          paddingHorizontal: spacing.screenHorizontal,
          paddingVertical: spacing.sm,
          gap: spacing.xs,
        },
      ]}
    >
      <Ionicons name="pricetag" size={18} color={colors.accent} />
      <Text
        style={[
          styles.message,
          {
            color: textColor,
            fontSize: typography.sm,
          },
        ]}
      >
        {offer.message}
      </Text>
      {offer.code ? (
        <View
          style={[
            styles.codePill,
            {
              backgroundColor: colors.surface,
              borderColor: colors.accent,
              borderRadius: radii.xs,
              paddingHorizontal: spacing.xs,
              paddingVertical: spacing.xxs,
            },
          ]}
        >
          <Text
            style={{
              color: colors.accent,
              fontSize: typography.xs,
              fontWeight: '800',
            }}
          >
            {offer.code}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontWeight: '600',
  },
  codePill: {
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
