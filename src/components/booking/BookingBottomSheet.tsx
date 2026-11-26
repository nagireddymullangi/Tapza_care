import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockApiClient } from '@/api/mockClient';
import { formatIsoDate } from '@/api/mockData';
import { useAppState } from '@/state/AppContext';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import type { Booking, Doctor, ServiceGridItem, Slot } from '@/types/domain';
import { TapTarget } from '@/components/common/TapTarget';
import { SlotsSkeletonLoader } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { StateBanner } from '@/components/common/StateBanner';
import { SuccessCelebration } from './SuccessCelebration';
import { triggerSelectionHaptic } from '@/services/haptics';

type BookingTarget = {
  doctor: Doctor;
  service?: ServiceGridItem;
  initialDate?: string;
};

type BookingBottomSheetProps = {
  target: BookingTarget | null;
  onClose: () => void;
  onViewBookings: () => void;
};

function formatSlotTime(iso: string): string {
  const timePart = iso.split('T')[1] ?? '';
  const [hourStr = '0', minStr = '00'] = timePart.split(':');
  const hour24 = parseInt(hourStr, 10);
  if (Number.isNaN(hour24)) return iso;
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${minStr} ${suffix}`;
}

function formatDateChip(offset: number, todayLabel: string, tomorrowLabel: string): {
  iso: string;
  top: string;
  bottom: string;
} {
  const iso = formatIsoDate(offset);
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' });
  const dayNum = String(d.getDate());
  return {
    iso,
    top: offset === 0 ? todayLabel : offset === 1 ? tomorrowLabel : weekday,
    bottom:
      offset === 0 || offset === 1
        ? `${dayNum} ${d.toLocaleDateString('en-IN', { month: 'short' })}`
        : dayNum,
  };
}

export function BookingBottomSheet({
  target,
  onClose,
  onViewBookings,
}: BookingBottomSheetProps) {
  if (!target) return null;

  return (
    <BookingSheetModal
      key={`${target.doctor.id}-${target.service?.id ?? 'direct'}`}
      target={target}
      onClose={onClose}
      onViewBookings={onViewBookings}
    />
  );
}

function BookingSheetModal({
  target,
  onClose,
  onViewBookings,
}: {
  target: BookingTarget;
  onClose: () => void;
  onViewBookings: () => void;
}) {
  const theme = useAppTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { bookSlotOptimistic } = useAppState();
  const { colors, spacing, radii, typography } = theme;

  const dateOptions = useMemo(
    () => [0, 1, 2, 3, 4].map((offset) => formatDateChip(offset, t.today, t.tomorrow)),
    [t.today, t.tomorrow]
  );

  const [selectedDate, setSelectedDate] = useState<string>(() => formatIsoDate(0));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    booking: Booking;
    queued: boolean;
  } | null>(null);

  const translateY = useSharedValue(windowHeight);
  const backdropOpacity = useSharedValue(0);

  const sheetMaxHeight = Math.min(windowHeight * 0.86, 680);

  const fetchSlots = useCallback(
    async (doctorId: string, date: string) => {
      try {
        const list = await mockApiClient.getSlots(doctorId, date);
        setSlots(list);
        setSlotsError(null);
      } catch (err) {
        setSlots([]);
        setSlotsError(err instanceof Error ? err.message : t.slotsErrorTitle);
      } finally {
        setSlotsLoading(false);
      }
    },
    [t.slotsErrorTitle]
  );

  useEffect(() => {
    backdropOpacity.set(withTiming(1, { duration: 220 }));
    translateY.set(withSpring(0, { damping: 22, stiffness: 220 }));

    let active = true;
    mockApiClient
      .getSlots(target.doctor.id, target.initialDate ?? formatIsoDate(0))
      .then((list) => {
        if (!active) return;
        setSlots(list);
        setSlotsError(null);
      })
      .catch((err) => {
        if (!active) return;
        setSlots([]);
        setSlotsError(err instanceof Error ? err.message : t.slotsErrorTitle);
      })
      .finally(() => {
        if (!active) return;
        setSlotsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [backdropOpacity, t.slotsErrorTitle, target.doctor.id, target.initialDate, translateY]);

  const dismissWithAnimation = useCallback(() => {
    backdropOpacity.set(withTiming(0, { duration: 180 }));
    translateY.set(
      withTiming(windowHeight, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      })
    );
  }, [backdropOpacity, onClose, translateY, windowHeight]);

  const handleSelectDate = (dateIso: string) => {
    triggerSelectionHaptic().catch(() => {});
    setSelectedDate(dateIso);
    setSlotsLoading(true);
    setSlotsError(null);
    setSelectedSlotId(null);
    setBookingError(null);
    fetchSlots(target.doctor.id, dateIso).catch(() => {});
  };

  const handleRetrySlots = () => {
    setSlotsLoading(true);
    setSlotsError(null);
    fetchSlots(target.doctor.id, selectedDate).catch(() => {});
  };

  const handleConfirm = async () => {
    if (!selectedSlotId || submitting) return;
    const slot = slots.find((s) => s.id === selectedSlotId);
    if (!slot) return;

    setSubmitting(true);
    setBookingError(null);

    const result = await bookSlotOptimistic({
      doctor: target.doctor,
      slot,
      date: selectedDate,
    });

    setSubmitting(false);

    if (result.outcome === 'confirmed') {
      setConfirmedBooking({ booking: result.booking, queued: false });
      return;
    }
    if (result.outcome === 'queued') {
      setConfirmedBooking({ booking: result.booking, queued: true });
      return;
    }
    if (result.outcome === 'conflict') {
      setBookingError(t.slotConflictMessage);
      setSlots((prev) =>
        prev.map((s) => (s.id === selectedSlotId ? { ...s, available: false } : s))
      );
      setSelectedSlotId(null);
      return;
    }
    setBookingError(t.bookingFailedMessage);
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((event) => {
          if (event.translationY > 0) {
            translateY.set(event.translationY);
          }
        })
        .onEnd((event) => {
          if (event.translationY > 120 || event.velocityY > 900) {
            runOnJS(dismissWithAnimation)();
          } else {
            translateY.set(withSpring(0, { damping: 22, stiffness: 240 }));
          }
        }),
    [dismissWithAnimation, translateY]
  );

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const displayFee = target.service ? target.service.priceInr : target.doctor.feeInr;
  const displayTitle = target.service ? target.service.name : target.doctor.name;
  const displaySubtitle = target.service
    ? `${target.doctor.name} • ${target.doctor.clinicName ?? t.clinicLocation}`
    : `${target.doctor.specialty} • ${target.doctor.clinicName ?? t.clinicLocation}`;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={dismissWithAnimation}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: colors.backdrop },
            backdropAnimStyle,
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={dismissWithAnimation} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: sheetMaxHeight,
              backgroundColor: colors.surface,
              borderTopLeftRadius: radii.xl,
              borderTopRightRadius: radii.xl,
              paddingBottom: Math.max(insets.bottom, spacing.md),
            },
            sheetAnimStyle,
          ]}
        >
          <GestureDetector gesture={panGesture}>
            <View
              style={[
                styles.dragHeader,
                {
                  paddingTop: spacing.sm,
                  paddingHorizontal: spacing.screenHorizontal,
                  paddingBottom: spacing.xs,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.dragHandle,
                  {
                    backgroundColor: colors.borderStrong,
                    borderRadius: radii.pill,
                  },
                ]}
              />

              <View style={[styles.titleRow, { marginTop: spacing.sm, gap: spacing.sm }]}>
                <View style={styles.titleBlock}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: colors.textPrimary,
                      fontSize: typography.lg,
                      fontWeight: '800',
                    }}
                  >
                    {displayTitle}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: colors.textSecondary,
                      fontSize: typography.xs,
                      marginTop: 2,
                    }}
                  >
                    {displaySubtitle}
                  </Text>
                </View>

                <View
                  style={[
                    styles.feePill,
                    {
                      backgroundColor: colors.primarySoft,
                      borderRadius: radii.pill,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xxs + 2,
                    },
                  ]}
                >
                  <Text style={{ color: colors.primary, fontSize: typography.sm, fontWeight: '800' }}>
                    ₹{displayFee}
                  </Text>
                </View>

                <TapTarget
                  accessibilityLabel="Close booking sheet"
                  onPress={dismissWithAnimation}
                  style={[
                    styles.closeBtn,
                    {
                      backgroundColor: colors.surfaceMuted,
                      borderRadius: radii.pill,
                    },
                  ]}
                >
                  <Ionicons name="close" size={20} color={colors.textPrimary} />
                </TapTarget>
              </View>
            </View>
          </GestureDetector>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: spacing.screenHorizontal,
              paddingTop: spacing.md,
              paddingBottom: spacing.md,
              gap: spacing.md,
            }}
          >
            {confirmedBooking ? (
              <SuccessCelebration
                title={confirmedBooking.queued ? t.bookingQueuedTitle : t.bookingConfirmedTitle}
                subtitle={
                  confirmedBooking.queued ? t.bookingQueuedSubtitle : t.bookingConfirmedSubtitle
                }
                metaText={`${confirmedBooking.booking.date} • ${formatSlotTime(
                  confirmedBooking.booking.startsAt
                )} • ${target.doctor.name}`}
                isQueued={confirmedBooking.queued}
                primaryLabel={t.viewBookings}
                onPrimary={() => {
                  onClose();
                  onViewBookings();
                }}
                secondaryLabel={t.done}
                onSecondary={dismissWithAnimation}
              />
            ) : (
              <>
                {bookingError ? <StateBanner tone="error" message={bookingError} /> : null}

                <View style={{ gap: spacing.xs }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: typography.sm,
                      fontWeight: '700',
                    }}
                  >
                    {t.selectDate}
                  </Text>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: spacing.xs }}
                  >
                    {dateOptions.map((d) => {
                      const active = selectedDate === d.iso;
                      return (
                        <TapTarget
                          key={d.iso}
                          onPress={() => handleSelectDate(d.iso)}
                          accessibilityState={{ selected: active }}
                          style={[
                            styles.dateChip,
                            {
                              backgroundColor: active ? colors.primary : colors.surfaceMuted,
                              borderColor: active ? colors.primary : colors.border,
                              borderRadius: radii.md,
                              paddingHorizontal: spacing.md,
                              paddingVertical: spacing.xs,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color: active ? colors.onPrimary : colors.textSecondary,
                              fontSize: typography.xs,
                              fontWeight: '600',
                            }}
                          >
                            {d.top}
                          </Text>
                          <Text
                            style={{
                              color: active ? colors.onPrimary : colors.textPrimary,
                              fontSize: typography.sm,
                              fontWeight: '800',
                            }}
                          >
                            {d.bottom}
                          </Text>
                        </TapTarget>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={{ gap: spacing.xs }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: typography.sm,
                      fontWeight: '700',
                    }}
                  >
                    {t.selectSlot}
                  </Text>

                  {slotsLoading ? (
                    <SlotsSkeletonLoader />
                  ) : slotsError ? (
                    <EmptyState
                      icon="cloud-offline-outline"
                      tone="error"
                      title={t.slotsErrorTitle}
                      subtitle={slotsError}
                      actionLabel={t.retry}
                      onAction={handleRetrySlots}
                    />
                  ) : slots.length === 0 ? (
                    <EmptyState
                      icon="calendar-clear-outline"
                      title={t.noSlotsTitle}
                      subtitle={t.noSlotsSubtitle}
                      actionLabel={t.tomorrow}
                      onAction={() => handleSelectDate(formatIsoDate(1))}
                    />
                  ) : (
                    <View style={[styles.slotsGrid, { gap: spacing.xs }]}>
                      {slots.map((slot) => {
                        const selected = selectedSlotId === slot.id;
                        const disabled = !slot.available;
                        return (
                          <TapTarget
                            key={slot.id}
                            disabled={disabled}
                            onPress={() => {
                              triggerSelectionHaptic().catch(() => {});
                              setSelectedSlotId(slot.id);
                              setBookingError(null);
                            }}
                            accessibilityState={{ selected, disabled }}
                            style={[
                              styles.slotPill,
                              {
                                backgroundColor: disabled
                                  ? colors.surfaceMuted
                                  : selected
                                    ? colors.primary
                                    : colors.surface,
                                borderColor: disabled
                                  ? colors.border
                                  : selected
                                    ? colors.primary
                                    : colors.borderStrong,
                                borderRadius: radii.md,
                                paddingVertical: spacing.sm,
                                opacity: disabled ? 0.45 : 1,
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color: disabled
                                  ? colors.textSecondary
                                  : selected
                                    ? colors.onPrimary
                                    : colors.textPrimary,
                                fontSize: typography.sm,
                                fontWeight: '700',
                              }}
                            >
                              {formatSlotTime(slot.startsAt)}
                            </Text>
                          </TapTarget>
                        );
                      })}
                    </View>
                  )}
                </View>

                <TapTarget
                  disabled={!selectedSlotId || submitting}
                  onPress={handleConfirm}
                  style={[
                    styles.confirmBtn,
                    {
                      backgroundColor:
                        !selectedSlotId || submitting ? colors.skeletonBase : colors.primary,
                      borderRadius: radii.pill,
                      paddingVertical: spacing.md,
                      marginTop: spacing.xs,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        !selectedSlotId || submitting ? colors.textSecondary : colors.onPrimary,
                      fontSize: typography.md,
                      fontWeight: '800',
                    }}
                  >
                    {submitting ? t.confirming : `${t.confirmBooking} • ₹${displayFee}`}
                  </Text>
                </TapTarget>
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    width: '100%',
    overflow: 'hidden',
  },
  dragHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dragHandle: {
    width: 44,
    height: 5,
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleBlock: {
    flex: 1,
  },
  feePill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    alignItems: 'center',
  },
  dateChip: {
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 74,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotPill: {
    width: '48.2%',
    borderWidth: 1,
    alignItems: 'center',
  },
  confirmBtn: {
    alignItems: 'center',
  },
});
