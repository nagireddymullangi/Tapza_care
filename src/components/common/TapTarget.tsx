import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';
import { triggerLightHaptic } from '@/services/haptics';

type TapTargetProps = PressableProps & {
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function TapTarget({
  haptic = true,
  onPress,
  style,
  children,
  ...rest
}: TapTargetProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={(e) => {
        if (haptic) {
          triggerLightHaptic().catch(() => {});
        }
        onPress?.(e);
      }}
      style={({ pressed }) => [
        {
          minHeight: theme.minTapTarget,
          minWidth: theme.minTapTarget,
          justifyContent: 'center',
          opacity: pressed ? 0.82 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
