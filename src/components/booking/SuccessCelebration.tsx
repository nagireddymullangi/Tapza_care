import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { useAppTheme } from '@/theme/ThemeContext';
import { withAlpha } from '@/theme/tokens';
import { TapTarget } from '@/components/common/TapTarget';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

type SuccessCelebrationProps = {
  title: string;
  subtitle: string;
  metaText?: string;
  isQueued?: boolean;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
};

const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 36;
const CHECK_LENGTH = 60;

export function SuccessCelebration({
  title,
  subtitle,
  metaText,
  isQueued = false,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: SuccessCelebrationProps) {
  const theme = useAppTheme();
  const { colors, spacing, radii, typography } = theme;
  const accentColor = isQueued ? colors.warning : colors.success;

  const circleProgress = useSharedValue(0);
  const checkProgress = useSharedValue(0);
  const pulseScale = useSharedValue(0.85);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    circleProgress.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    checkProgress.value = withDelay(
      280,
      withTiming(1, {
        duration: 380,
        easing: Easing.out(Easing.cubic),
      })
    );
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.22, { duration: 1100 }),
        withTiming(0.95, { duration: 1100 })
      ),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.14, { duration: 1100 }),
        withTiming(0.45, { duration: 1100 })
      ),
      -1,
      true
    );
  }, [checkProgress, circleProgress, pulseOpacity, pulseScale]);

  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_CIRCUMFERENCE * (1 - circleProgress.value),
  }));

  const checkProps = useAnimatedProps(() => ({
    strokeDashoffset: CHECK_LENGTH * (1 - checkProgress.value),
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={[styles.container, { paddingVertical: spacing.lg, gap: spacing.md }]}>
      <View style={styles.badgeWrap}>
        <Animated.View
          style={[
            styles.pulseRing,
            {
              backgroundColor: withAlpha(accentColor, 0.28),
              borderRadius: radii.pill,
            },
            pulseStyle,
          ]}
        />
        <Svg width={92} height={92} viewBox="0 0 92 92">
          <Circle
            cx={46}
            cy={46}
            r={36}
            fill={withAlpha(accentColor, 0.14)}
            stroke={withAlpha(accentColor, 0.25)}
            strokeWidth={4}
          />
          <AnimatedCircle
            cx={46}
            cy={46}
            r={36}
            fill="none"
            stroke={accentColor}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            animatedProps={circleProps}
            transform="rotate(-90 46 46)"
          />
          <AnimatedPath
            d="M31 47 L42 58 L62 36"
            fill="none"
            stroke={accentColor}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={CHECK_LENGTH}
            animatedProps={checkProps}
          />
        </Svg>
      </View>

      <Text
        style={{
          color: colors.textPrimary,
          fontSize: typography.xl,
          fontWeight: '800',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: colors.textSecondary,
          fontSize: typography.sm,
          textAlign: 'center',
          lineHeight: 20,
          paddingHorizontal: spacing.md,
        }}
      >
        {subtitle}
      </Text>

      {metaText ? (
        <View
          style={[
            styles.metaBox,
            {
              backgroundColor: colors.surfaceMuted,
              borderColor: colors.border,
              borderRadius: radii.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            },
          ]}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.sm,
              fontWeight: '700',
              textAlign: 'center',
            }}
          >
            {metaText}
          </Text>
        </View>
      ) : null}

      <View style={[styles.actions, { gap: spacing.sm, marginTop: spacing.xs }]}>
        <TapTarget
          onPress={onPrimary}
          style={[
            styles.btn,
            {
              backgroundColor: colors.primary,
              borderRadius: radii.pill,
              paddingHorizontal: spacing.xl,
            },
          ]}
        >
          <Text style={{ color: colors.onPrimary, fontSize: typography.sm, fontWeight: '800' }}>
            {primaryLabel}
          </Text>
        </TapTarget>

        <TapTarget
          onPress={onSecondary}
          style={[
            styles.btn,
            {
              borderColor: colors.borderStrong,
              borderWidth: 1,
              borderRadius: radii.pill,
              paddingHorizontal: spacing.xl,
            },
          ]}
        >
          <Text style={{ color: colors.textPrimary, fontSize: typography.sm, fontWeight: '700' }}>
            {secondaryLabel}
          </Text>
        </TapTarget>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badgeWrap: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 96,
    height: 96,
  },
  metaBox: {
    borderWidth: 1,
    alignSelf: 'stretch',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btn: {
    alignItems: 'center',
  },
});
