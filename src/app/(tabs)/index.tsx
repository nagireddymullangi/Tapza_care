import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAppState } from '@/state/AppContext';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import type { Doctor, QuickActionItem, ServiceGridItem } from '@/types/domain';
import { CollapsibleHeader } from '@/components/home/CollapsibleHeader';
import { SectionRenderer } from '@/components/home/SectionRenderer';
import { HomeSkeletonLoader } from '@/components/common/Skeleton';
import { StateBanner } from '@/components/common/StateBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { BookingBottomSheet } from '@/components/booking/BookingBottomSheet';

export default function HomeScreen() {
  const router = useRouter();
  const { height: viewportHeight } = useWindowDimensions();
  const theme = useAppTheme();
  const { t } = useI18n();
  const {
    config,
    configLoading,
    configError,
    isUsingCachedConfig,
    mockSettings,
    switchPreset,
    refreshConfig,
    loadBundledFallbackConfig,
    doctors,
    selectedCategory,
    setSelectedCategory,
  } = useAppState();

  const [bookingTarget, setBookingTarget] = useState<{
    doctor: Doctor;
    service?: ServiceGridItem;
  } | null>(null);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleTogglePreset = useCallback(() => {
    const next = mockSettings.preset === 'normal' ? 'festival' : 'normal';
    switchPreset(next).catch(() => {});
  }, [mockSettings.preset, switchPreset]);

  const handleBookDoctor = useCallback((doctor: Doctor) => {
    setBookingTarget({ doctor });
  }, []);

  const handleBookService = useCallback(
    (service: ServiceGridItem) => {
      const matchedDoctor =
        doctors.find((d) => d.id === service.doctorId) ??
        doctors[0] ?? {
          id: service.doctorId,
          name: 'Tapza Clinic Specialist',
          specialty: 'General Medicine',
          photoUrl: '',
          feeInr: service.priceInr,
          languages: ['Telugu', 'Hindi', 'English'],
        };
      setBookingTarget({ doctor: matchedDoctor, service });
    },
    [doctors]
  );

  const handleHeroCta = useCallback(
    (doctorId?: string) => {
      const targetDoc =
        doctors.find((d) => d.id === doctorId) ?? doctors[0];
      if (targetDoc) {
        setBookingTarget({ doctor: targetDoc });
      }
    },
    [doctors]
  );

  const handleQuickAction = useCallback(
    (actionType: QuickActionItem['actionType']) => {
      switch (actionType) {
        case 'book': {
          const doc = doctors[0];
          if (doc) setBookingTarget({ doctor: doc });
          break;
        }
        case 'prescriptions':
        case 'reminders':
          router.push('/(tabs)/prescriptions');
          break;
        case 'family':
          Alert.alert(t.familyAlertTitle, t.familyAlertBody);
          break;
      }
    },
    [doctors, router, t.familyAlertBody, t.familyAlertTitle]
  );

  const handleOpenDoctorDetail = useCallback(
    (doctorId: string) => {
      router.push(`/doctor/${doctorId}`);
    },
    [router]
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <CollapsibleHeader
        scrollY={scrollY}
        preset={mockSettings.preset}
        onTogglePreset={handleTogglePreset}
        onSearchPress={() => {
          const doc = doctors[0];
          if (doc) setBookingTarget({ doctor: doc });
        }}
      />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={configLoading && Boolean(config)}
            onRefresh={() => {
              refreshConfig().catch(() => {});
            }}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}
      >
        {mockSettings.offlineMode ? (
          <View style={{ marginTop: theme.spacing.xs }}>
            <StateBanner tone="warning" message={t.offlineBanner} />
          </View>
        ) : null}

        {isUsingCachedConfig && configError ? (
          <View style={{ marginTop: theme.spacing.xs }}>
            <StateBanner
              tone="warning"
              message={t.staleConfigBanner}
              actionLabel={t.retry}
              onAction={() => {
                refreshConfig().catch(() => {});
              }}
            />
          </View>
        ) : null}

        {configLoading && !config ? (
          <HomeSkeletonLoader />
        ) : configError && !config ? (
          <View style={{ padding: theme.spacing.screenHorizontal, marginTop: theme.spacing.lg }}>
            <EmptyState
              icon="cloud-offline-outline"
              tone="error"
              title={t.configErrorTitle}
              subtitle={t.configErrorSubtitle}
              actionLabel={t.retry}
              onAction={() => {
                refreshConfig().catch(() => {});
              }}
              secondaryLabel={t.loadFallbackConfig}
              onSecondary={loadBundledFallbackConfig}
            />
          </View>
        ) : config ? (
          <View style={{ gap: theme.spacing.xs }}>
            {config.sections.map((section, index) => (
              <SectionRenderer
                key={section.id}
                section={section}
                index={index}
                scrollY={scrollY}
                viewportHeight={viewportHeight}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onQuickAction={handleQuickAction}
                onBookDoctor={handleBookDoctor}
                onBookService={handleBookService}
                onOpenDoctorDetail={handleOpenDoctorDetail}
                onHeroCta={handleHeroCta}
              />
            ))}
          </View>
        ) : null}
      </Animated.ScrollView>

      <BookingBottomSheet
        target={bookingTarget}
        onClose={() => setBookingTarget(null)}
        onViewBookings={() => router.push('/(tabs)/bookings')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
