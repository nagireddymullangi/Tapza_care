import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '@/state/AppContext';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import { TapTarget } from '@/components/common/TapTarget';
import { EmptyState } from '@/components/common/EmptyState';
import { BookingBottomSheet } from '@/components/booking/BookingBottomSheet';

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useAppTheme();
  const { t } = useI18n();
  const { doctors } = useAppState();
  const { colors, spacing, radii, typography } = theme;
  const [sheetOpen, setSheetOpen] = useState(false);

  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) {
    return (
      <View
        style={[
          styles.screen,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + spacing.md,
            paddingHorizontal: spacing.screenHorizontal,
          },
        ]}
      >
        <EmptyState
          icon="person-outline"
          title={t.doctorNotFound}
          subtitle={String(id ?? '')}
          actionLabel={t.back}
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + spacing.xs,
            paddingBottom: spacing.sm,
            paddingHorizontal: spacing.screenHorizontal,
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            gap: spacing.sm,
          },
        ]}
      >
        <TapTarget
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceMuted, borderRadius: radii.pill }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TapTarget>
        <Text style={{ color: colors.textPrimary, fontSize: typography.lg, fontWeight: '800' }}>
          {doctor.name}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: spacing.screenHorizontal,
          gap: spacing.md,
        }}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.xl,
              padding: spacing.lg,
              gap: spacing.sm,
            },
          ]}
        >
          <Text style={{ color: colors.primary, fontSize: typography.sm, fontWeight: '700' }}>
            {doctor.specialty}
          </Text>
          <Text style={{ color: colors.textPrimary, fontSize: typography.xxl, fontWeight: '800' }}>
            {doctor.name}
          </Text>
          {doctor.clinicName ? (
            <View style={[styles.row, { gap: spacing.xs }]}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: typography.sm }}>
                {doctor.clinicName}
              </Text>
            </View>
          ) : null}

          <View style={[styles.row, { gap: spacing.md, marginTop: spacing.xs }]}>
            <View
              style={[
                styles.statPill,
                {
                  backgroundColor: colors.primarySoft,
                  borderRadius: radii.md,
                  padding: spacing.sm,
                },
              ]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: typography.xs }}>
                {t.consultationFee}
              </Text>
              <Text style={{ color: colors.primary, fontSize: typography.lg, fontWeight: '800' }}>
                ₹{doctor.feeInr}
              </Text>
            </View>

            <View
              style={[
                styles.statPill,
                {
                  backgroundColor: colors.surfaceMuted,
                  borderRadius: radii.md,
                  padding: spacing.sm,
                },
              ]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: typography.xs }}>
                {t.speaks}
              </Text>
              <Text style={{ color: colors.textPrimary, fontSize: typography.sm, fontWeight: '700' }}>
                {doctor.languages.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        <TapTarget
          onPress={() => setSheetOpen(true)}
          style={[
            styles.cta,
            {
              backgroundColor: colors.primary,
              borderRadius: radii.pill,
              paddingVertical: spacing.md,
            },
          ]}
        >
          <Text style={{ color: colors.onPrimary, fontSize: typography.md, fontWeight: '800' }}>
            {t.bookNow} • ₹{doctor.feeInr}
          </Text>
        </TapTarget>
      </ScrollView>

      <BookingBottomSheet
        target={sheetOpen ? { doctor } : null}
        onClose={() => setSheetOpen(false)}
        onViewBookings={() => router.push('/(tabs)/bookings')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statPill: {
    flex: 1,
    gap: 4,
  },
  cta: {
    alignItems: 'center',
  },
});
