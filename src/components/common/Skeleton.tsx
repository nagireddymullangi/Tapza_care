import React, { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '@/theme/ThemeContext';

type SkeletonBlockProps = {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function SkeletonBlock({ width, height, borderRadius, style }: SkeletonBlockProps) {
  const theme = useAppTheme();
  const pulse = useSharedValue(0.45);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 850 }), -1, true);
  }, [pulse]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: borderRadius ?? theme.radii.sm,
          backgroundColor: theme.colors.skeletonBase,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function HomeSkeletonLoader() {
  const theme = useAppTheme();
  const s = theme.spacing;

  return (
    <View style={[styles.container, { paddingHorizontal: s.screenHorizontal, gap: s.md }]}>
      {/* Hero Banner Skeleton */}
      <SkeletonBlock width="100%" height={172} borderRadius={theme.radii.xl} />

      {/* Quick Actions 4-tile Skeleton */}
      <View style={[styles.row, { gap: s.sm }]}>
        {[0, 1, 2, 3].map((idx) => (
          <View key={idx} style={[styles.flex1, { gap: s.xs, alignItems: 'center' }]}>
            <SkeletonBlock width="100%" height={72} borderRadius={theme.radii.md} />
          </View>
        ))}
      </View>

      {/* Category Chips Skeleton */}
      <View style={[styles.row, { gap: s.xs }]}>
        {[92, 108, 96, 88].map((w, idx) => (
          <SkeletonBlock key={idx} width={w} height={44} borderRadius={theme.radii.pill} />
        ))}
      </View>

      {/* Offer Strip Skeleton */}
      <SkeletonBlock width="100%" height={48} borderRadius={theme.radii.md} />

      {/* Doctor Carousel Skeleton */}
      <View style={[styles.row, { gap: s.sm }]}>
        <SkeletonBlock width={220} height={148} borderRadius={theme.radii.lg} />
        <SkeletonBlock width={220} height={148} borderRadius={theme.radii.lg} />
      </View>

      {/* Service Grid Skeleton */}
      <View style={[styles.row, { gap: s.sm }]}>
        <SkeletonBlock width="48%" height={136} borderRadius={theme.radii.lg} />
        <SkeletonBlock width="48%" height={136} borderRadius={theme.radii.lg} />
      </View>
    </View>
  );
}

export function SlotsSkeletonLoader() {
  const theme = useAppTheme();
  const s = theme.spacing;

  return (
    <View style={[styles.gridWrap, { gap: s.sm }]}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <SkeletonBlock
          key={i}
          width="48%"
          height={48}
          borderRadius={theme.radii.md}
        />
      ))}
    </View>
  );
}

export function PrescriptionListSkeleton() {
  const theme = useAppTheme();
  const s = theme.spacing;

  return (
    <View style={{ gap: s.md, padding: s.screenHorizontal }}>
      {[0, 1, 2].map((i) => (
        <SkeletonBlock key={i} width="100%" height={132} borderRadius={theme.radii.lg} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
