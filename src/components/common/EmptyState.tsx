import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeContext';
import { TapTarget } from './TapTarget';

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  tone?: 'neutral' | 'error';
};

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  tone = 'neutral',
}: EmptyStateProps) {
  const theme = useAppTheme();
  const { colors, spacing, radii, typography } = theme;
  const iconBg = tone === 'error' ? colors.errorSoft : colors.primarySoft;
  const iconColor = tone === 'error' ? colors.error : colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.xl,
          padding: spacing.xl,
          gap: spacing.sm,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: iconBg,
            borderRadius: radii.pill,
          },
        ]}
      >
        <Ionicons name={icon} size={32} color={iconColor} />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontSize: typography.lg,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: colors.textSecondary,
            fontSize: typography.sm,
          },
        ]}
      >
        {subtitle}
      </Text>

      <View style={[styles.actions, { gap: spacing.xs, marginTop: spacing.xs }]}>
        {actionLabel && onAction ? (
          <TapTarget
            onPress={onAction}
            style={[
              styles.primaryBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.lg,
              },
            ]}
          >
            <Text style={{ color: colors.onPrimary, fontSize: typography.sm, fontWeight: '700' }}>
              {actionLabel}
            </Text>
          </TapTarget>
        ) : null}

        {secondaryLabel && onSecondary ? (
          <TapTarget
            onPress={onSecondary}
            style={[
              styles.secondaryBtn,
              {
                borderColor: colors.borderStrong,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <Text style={{ color: colors.textPrimary, fontSize: typography.sm, fontWeight: '600' }}>
              {secondaryLabel}
            </Text>
          </TapTarget>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 1,
  },
  iconCircle: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    alignItems: 'center',
  },
  secondaryBtn: {
    borderWidth: 1,
    alignItems: 'center',
  },
});
