import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeContext';
import type { QuickActionItem } from '@/types/domain';
import { TapTarget } from '@/components/common/TapTarget';

type QuickActionsSectionProps = {
  title?: string;
  items: unknown[];
  onAction: (actionType: QuickActionItem['actionType']) => void;
};

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  'calendar-outline': 'calendar-outline',
  'document-text-outline': 'document-text-outline',
  'alarm-outline': 'alarm-outline',
  'people-outline': 'people-outline',
};

export function QuickActionsSection({ title, items, onAction }: QuickActionsSectionProps) {
  const theme = useAppTheme();
  const { colors, spacing, radii, typography } = theme;

  const actions = items.filter(
    (x): x is QuickActionItem =>
      typeof x === 'object' && x !== null && 'label' in x && 'actionType' in x
  );

  if (actions.length === 0) return null;

  return (
    <View
      style={{
        paddingHorizontal: spacing.screenHorizontal,
        paddingVertical: spacing.md,
        gap: spacing.sm,
      }}
    >
      {title ? (
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.lg,
            fontWeight: '700',
          }}
        >
          {title}
        </Text>
      ) : null}

      <View style={[styles.row, { gap: spacing.xs }]}>
        {actions.map((item) => {
          const iconName = ICON_MAP[item.icon] ?? 'apps-outline';
          return (
            <TapTarget
              key={item.id}
              onPress={() => onAction(item.actionType)}
              style={[
                styles.tile,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radii.md,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.xs,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBadge,
                  {
                    backgroundColor: colors.primarySoft,
                    borderRadius: radii.sm,
                  },
                ]}
              >
                <Ionicons name={iconName} size={22} color={colors.primary} />
              </View>
              <Text
                numberOfLines={1}
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.xs,
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                {item.label}
              </Text>
              {item.subtitle ? (
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.xs - 1,
                    textAlign: 'center',
                  }}
                >
                  {item.subtitle}
                </Text>
              ) : null}
            </TapTarget>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    gap: 6,
  },
  iconBadge: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
