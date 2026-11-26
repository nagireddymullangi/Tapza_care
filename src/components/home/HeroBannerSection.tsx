import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  type SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeContext';
import { withAlpha } from '@/theme/tokens';
import type { HeroBannerItem } from '@/types/domain';
import { TapTarget } from '@/components/common/TapTarget';

type HeroBannerSectionProps = {
  items: unknown[];
  scrollY: SharedValue<number>;
  onCtaPress: (doctorId?: string) => void;
};

export function HeroBannerSection({ items, scrollY, onCtaPress }: HeroBannerSectionProps) {
  const theme = useAppTheme();
  const { colors, spacing, radii, typography } = theme;

  const first = items[0] as HeroBannerItem | undefined;
  if (!first || typeof first.headline !== 'string') {
    return null;
  }

  return (
    <HeroBannerCard
      item={first}
      scrollY={scrollY}
      onCtaPress={onCtaPress}
      colors={colors}
      spacing={spacing}
      radii={radii}
      typography={typography}
      isFestival={Boolean(theme.festival)}
    />
  );
}

type HeroBannerCardProps = {
  item: HeroBannerItem;
  scrollY: SharedValue<number>;
  onCtaPress: (doctorId?: string) => void;
  colors: ReturnType<typeof useAppTheme>['colors'];
  spacing: ReturnType<typeof useAppTheme>['spacing'];
  radii: ReturnType<typeof useAppTheme>['radii'];
  typography: ReturnType<typeof useAppTheme>['typography'];
  isFestival: boolean;
};

function HeroBannerCard({
  item,
  scrollY,
  onCtaPress,
  colors,
  spacing,
  radii,
  typography,
  isFestival,
}: HeroBannerCardProps) {
  const parallaxStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 220], [0, 42], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, [-80, 0, 220], [1.08, 1, 0.96], Extrapolation.CLAMP);
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const textForeground = colors.onPrimary;
  const motifColor = withAlpha(textForeground, 0.16);
  const accentMotif = withAlpha(colors.accent, 0.35);

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.screenHorizontal, paddingVertical: spacing.lg }]}>
      <Animated.View style={[styles.artworkWrap, parallaxStyle]} pointerEvents="none">
        <Svg width={170} height={170} viewBox="0 0 170 170">
          <Circle cx={120} cy={52} r={54} fill={motifColor} />
          <Circle cx={142} cy={112} r={34} fill={accentMotif} />
          {isFestival ? (
            <Path
              d="M92 108 C104 82, 132 82, 144 108 C132 126, 104 126, 92 108 Z"
              fill={withAlpha(textForeground, 0.24)}
            />
          ) : (
            <Path
              d="M110 42 H130 V62 H150 V82 H130 V102 H110 V82 H90 V62 H110 Z"
              fill={withAlpha(textForeground, 0.2)}
            />
          )}
        </Svg>
      </Animated.View>

      {item.badge ? (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: withAlpha(textForeground, 0.2),
              borderRadius: radii.pill,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xxs,
              marginBottom: spacing.xs,
            },
          ]}
        >
          <Ionicons
            name={isFestival ? 'sparkles' : 'shield-checkmark'}
            size={13}
            color={textForeground}
          />
          <Text style={{ color: textForeground, fontSize: typography.xs, fontWeight: '700' }}>
            {item.badge}
          </Text>
        </View>
      ) : null}

      <Text
        style={{
          color: withAlpha(textForeground, 0.9),
          fontSize: typography.sm,
          fontWeight: '600',
          marginBottom: spacing.xxs,
        }}
      >
        {item.greeting}
      </Text>

      <Text
        style={[
          styles.headline,
          {
            color: textForeground,
            fontSize: typography.hero,
            marginBottom: spacing.xs,
          },
        ]}
      >
        {item.headline}
      </Text>

      <Text
        style={{
          color: withAlpha(textForeground, 0.88),
          fontSize: typography.sm,
          lineHeight: 20,
          marginBottom: spacing.md,
        }}
      >
        {item.subtitle}
      </Text>

      <TapTarget
        onPress={() => onCtaPress(item.targetDoctorId)}
        style={[
          styles.ctaButton,
          {
            backgroundColor: colors.surface,
            borderRadius: radii.pill,
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <Text
          style={{
            color: colors.primary,
            fontSize: typography.sm,
            fontWeight: '800',
          }}
        >
          {item.ctaLabel}
        </Text>
        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
      </TapTarget>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  artworkWrap: {
    position: 'absolute',
    right: -12,
    top: 4,
  },
  badge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 6,
  },
  headline: {
    fontWeight: '800',
    lineHeight: 32,
    maxWidth: '92%',
  },
  ctaButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
});
