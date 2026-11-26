import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeContext';
import type { CategoryChipItem } from '@/types/domain';
import { TapTarget } from '@/components/common/TapTarget';

type CategoryChipsSectionProps = {
  title?: string;
  items: unknown[];
  selectedCategory: string | null;
  onSelectCategory: (categoryKey: string | null) => void;
};

const CHIP_ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  stethoscope: 'medkit-outline',
  'flask-outline': 'flask-outline',
  'medkit-outline': 'bandage-outline',
  'shield-checkmark-outline': 'shield-checkmark-outline',
  'heart-outline': 'heart-outline',
};

export function CategoryChipsSection({
  title,
  items,
  selectedCategory,
  onSelectCategory,
}: CategoryChipsSectionProps) {
  const theme = useAppTheme();
  const { colors, spacing, radii, typography } = theme;

  const chips = items.filter(
    (x): x is CategoryChipItem =>
      typeof x === 'object' && x !== null && 'label' in x && 'categoryKey' in x
  );

  if (chips.length === 0) return null;

  return (
    <View style={{ paddingVertical: spacing.md, gap: spacing.sm }}>
      {title ? (
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.lg,
            fontWeight: '700',
            paddingHorizontal: spacing.screenHorizontal,
          }}
        >
          {title}
        </Text>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.screenHorizontal,
          gap: spacing.xs,
        }}
      >
        {chips.map((chip) => {
          const active = selectedCategory === chip.categoryKey;
          const iconName = CHIP_ICON_MAP[chip.icon] ?? 'ellipse-outline';
          return (
            <TapTarget
              key={chip.id}
              onPress={() => onSelectCategory(active ? null : chip.categoryKey)}
              accessibilityState={{ selected: active }}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.surfaceMuted,
                  borderColor: active ? colors.primary : colors.border,
                  borderRadius: radii.pill,
                  paddingHorizontal: spacing.md,
                  gap: spacing.xs,
                },
              ]}
            >
              <Ionicons
                name={iconName}
                size={16}
                color={active ? colors.onPrimary : colors.primary}
              />
              <Text
                style={{
                  color: active ? colors.onPrimary : colors.textPrimary,
                  fontSize: typography.sm,
                  fontWeight: '700',
                }}
              >
                {chip.label}
              </Text>
            </TapTarget>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
