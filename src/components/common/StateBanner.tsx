import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeContext';
import { TapTarget } from './TapTarget';

type StateBannerProps = {
  tone: 'warning' | 'error' | 'info' | 'success';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StateBanner({ tone, message, actionLabel, onAction }: StateBannerProps) {
  const theme = useAppTheme();
  const { colors, spacing, radii, typography } = theme;

  const palette = {
    warning: { bg: colors.warningSoft, fg: colors.warning, icon: 'cloud-offline-outline' as const },
    error: { bg: colors.errorSoft, fg: colors.error, icon: 'alert-circle-outline' as const },
    info: { bg: colors.primarySoft, fg: colors.primary, icon: 'information-circle-outline' as const },
    success: { bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle-outline' as const },
  }[tone];

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.banner,
        {
          backgroundColor: palette.bg,
          borderColor: palette.fg,
          borderRadius: radii.md,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          marginHorizontal: spacing.screenHorizontal,
          marginBottom: spacing.sm,
          gap: spacing.xs,
        },
      ]}
    >
      <Ionicons name={palette.icon} size={20} color={palette.fg} />
      <Text
        style={[
          styles.message,
          {
            color: colors.textPrimary,
            fontSize: typography.sm,
          },
        ]}
      >
        {message}
      </Text>
      {actionLabel && onAction ? (
        <TapTarget
          onPress={onAction}
          style={[
            styles.actionBtn,
            {
              backgroundColor: palette.fg,
              borderRadius: radii.pill,
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          <Text
            style={{
              color: colors.onPrimary,
              fontSize: typography.xs,
              fontWeight: '700',
            }}
          >
            {actionLabel}
          </Text>
        </TapTarget>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  message: {
    flex: 1,
    fontWeight: '500',
  },
  actionBtn: {
    alignItems: 'center',
  },
});
