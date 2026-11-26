import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme/ThemeContext';
import type {
  ConfigSection,
  Doctor,
  QuickActionItem,
  ServiceGridItem,
} from '@/types/domain';
import { HeroBannerSection } from './HeroBannerSection';
import { QuickActionsSection } from './QuickActionsSection';
import { CategoryChipsSection } from './CategoryChipsSection';
import { OfferStripSection } from './OfferStripSection';
import { DoctorCarouselSection } from './DoctorCarouselSection';
import { ServiceGridSection } from './ServiceGridSection';

export const KNOWN_SECTION_TYPES = new Set([
  'hero_banner',
  'category_chips',
  'quick_actions',
  'service_grid',
  'doctor_carousel',
  'offer_strip',
]);

export type SectionRendererProps = {
  section: ConfigSection;
  index: number;
  scrollY: SharedValue<number>;
  viewportHeight: number;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onQuickAction: (actionType: QuickActionItem['actionType']) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onBookService: (service: ServiceGridItem) => void;
  onOpenDoctorDetail: (doctorId: string) => void;
  onHeroCta: (doctorId?: string) => void;
};

function SectionBackground({
  section,
  children,
}: {
  section: ConfigSection;
  children: React.ReactNode;
}) {
  const theme = useAppTheme();
  const { background, type } = section;

  // In dark mode, keep hero banner vibrant (using primary/secondary) while adapting light pastel
  // section bands to dark-mode surfaces so text contrast remains high in both themes.
  if (background.kind === 'gradient') {
    const rawColors = background.value
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const colorsList: [string, string, ...string[]] =
      theme.isDark && type !== 'hero_banner'
        ? [theme.colors.surface, theme.colors.surfaceMuted]
        : rawColors.length >= 2
          ? (rawColors as [string, string, ...string[]])
          : [theme.colors.primary, theme.colors.secondary];

    return (
      <LinearGradient
        colors={colorsList}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sectionBand}
      >
        {children}
      </LinearGradient>
    );
  }

  if (background.kind === 'image') {
    return (
      <ImageBackground
        source={{ uri: background.value }}
        resizeMode="cover"
        style={[
          styles.sectionBand,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        {children}
      </ImageBackground>
    );
  }

  const solidColor = theme.isDark
    ? type === 'offer_strip'
      ? theme.colors.accentSoft
      : theme.colors.surface
    : background.value || theme.colors.surface;

  return (
    <View style={[styles.sectionBand, { backgroundColor: solidColor }]}>
      {children}
    </View>
  );
}

export function SectionRenderer({
  section,
  index,
  scrollY,
  viewportHeight,
  selectedCategory,
  onSelectCategory,
  onQuickAction,
  onBookDoctor,
  onBookService,
  onOpenDoctorDetail,
  onHeroCta,
}: SectionRendererProps) {
  const [sectionTop, setSectionTop] = useState<number>(index * 160);

  const animatedEntranceStyle = useAnimatedStyle(() => {
    const isVisible = index < 2 || scrollY.value + viewportHeight >= sectionTop + 20;
    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 320 }),
      transform: [
        {
          translateY: withTiming(isVisible ? 0 : 18, { duration: 320 }),
        },
      ],
    };
  }, [index, sectionTop, viewportHeight]);

  // Requirement: An unknown section type must render nothing and never crash.
  if (!KNOWN_SECTION_TYPES.has(section.type)) {
    return null;
  }

  let content: React.ReactNode = null;
  switch (section.type) {
    case 'hero_banner':
      content = (
        <HeroBannerSection
          items={section.items}
          scrollY={scrollY}
          onCtaPress={onHeroCta}
        />
      );
      break;
    case 'quick_actions':
      content = (
        <QuickActionsSection
          title={section.title}
          items={section.items}
          onAction={onQuickAction}
        />
      );
      break;
    case 'category_chips':
      content = (
        <CategoryChipsSection
          title={section.title}
          items={section.items}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      );
      break;
    case 'offer_strip':
      content = <OfferStripSection items={section.items} />;
      break;
    case 'doctor_carousel':
      content = (
        <DoctorCarouselSection
          title={section.title}
          items={section.items}
          onBookDoctor={onBookDoctor}
          onOpenDoctorDetail={onOpenDoctorDetail}
        />
      );
      break;
    case 'service_grid':
      content = (
        <ServiceGridSection
          title={section.title}
          items={section.items}
          selectedCategory={selectedCategory}
          onClearCategory={() => onSelectCategory(null)}
          onBookService={onBookService}
        />
      );
      break;
    default:
      return null;
  }

  if (!content) return null;

  return (
    <Animated.View
      testID={`section-${section.id}`}
      onLayout={(e) => setSectionTop(e.nativeEvent.layout.y)}
      style={animatedEntranceStyle}
    >
      <SectionBackground section={section}>{content}</SectionBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionBand: {
    width: '100%',
  },
});
