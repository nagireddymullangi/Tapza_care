import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '@/state/AppContext';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import { scheduleMedicineReminders } from '@/services/notifications';
import { PrescriptionListSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { StateBanner } from '@/components/common/StateBanner';
import { TapTarget } from '@/components/common/TapTarget';

export default function PrescriptionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useAppTheme();
  const { t } = useI18n();
  const {
    prescriptions,
    prescriptionsLoading,
    prescriptionsError,
    refreshPrescriptions,
    isDoseTaken,
  } = useAppState();
  const { colors, spacing, radii, typography } = theme;
  const [reminderBanner, setReminderBanner] = useState<string | null>(null);

  const handleScheduleReminders = async () => {
    const res = await scheduleMedicineReminders();
    setReminderBanner(res.scheduled ? t.remindersScheduled : res.message);
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + spacing.sm,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.screenHorizontal,
            marginBottom: spacing.sm,
            gap: spacing.sm,
          },
        ]}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.xxl,
            fontWeight: '800',
            flex: 1,
          }}
        >
          {t.prescriptionsTitle}
        </Text>

        <TapTarget
          onPress={handleScheduleReminders}
          style={[
            styles.reminderBtn,
            {
              backgroundColor: colors.primarySoft,
              borderRadius: radii.pill,
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          <Ionicons name="notifications-outline" size={16} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: typography.xs, fontWeight: '700' }}>
            {t.scheduleReminders}
          </Text>
        </TapTarget>
      </View>

      {reminderBanner ? <StateBanner tone="success" message={reminderBanner} /> : null}

      {prescriptionsLoading && prescriptions.length === 0 ? (
        <PrescriptionListSkeleton />
      ) : prescriptionsError && prescriptions.length === 0 ? (
        <View style={{ padding: spacing.screenHorizontal }}>
          <EmptyState
            icon="document-text-outline"
            tone="error"
            title={t.prescriptionsTitle}
            subtitle={prescriptionsError}
            actionLabel={t.retry}
            onAction={() => {
              refreshPrescriptions().catch(() => {});
            }}
          />
        </View>
      ) : (
        <FlatList
          data={prescriptions}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={prescriptionsLoading}
              onRefresh={() => {
                refreshPrescriptions().catch(() => {});
              }}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: spacing.screenHorizontal,
            paddingBottom: spacing.xxl,
            gap: spacing.sm,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            <View style={{ marginTop: spacing.xl }}>
              <EmptyState
                icon="document-text-outline"
                title={t.prescriptionsEmptyTitle}
                subtitle={t.prescriptionsEmptySubtitle}
              />
            </View>
          }
          renderItem={({ item }) => {
            const totalDoses = item.medicines.reduce((sum, m) => sum + m.timing.length, 0);
            const takenDoses = item.medicines.reduce(
              (sum, m) =>
                sum +
                m.timing.filter((slot) => isDoseTaken(item.id, m.id, slot)).length,
              0
            );

            return (
              <TapTarget
                onPress={() => router.push(`/prescription/${item.id}`)}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radii.lg,
                    padding: spacing.cardPadding,
                    gap: spacing.xs,
                  },
                ]}
              >
                <View style={styles.topRow}>
                  <View style={styles.flex1}>
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontSize: typography.md,
                        fontWeight: '800',
                      }}
                    >
                      {item.doctorName}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: typography.xs }}>
                      {item.clinicName}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.datePill,
                      {
                        backgroundColor: colors.surfaceMuted,
                        borderRadius: radii.sm,
                        paddingHorizontal: spacing.xs,
                        paddingVertical: spacing.xxs,
                      },
                    ]}
                  >
                    <Text style={{ color: colors.textSecondary, fontSize: typography.xs, fontWeight: '600' }}>
                      {item.issuedAt}
                    </Text>
                  </View>
                </View>

                {item.diagnosis ? (
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: typography.sm,
                      fontWeight: '600',
                    }}
                  >
                    {item.diagnosis}
                  </Text>
                ) : null}

                <View style={[styles.footerRow, { marginTop: spacing.xxs }]}>
                  <Text style={{ color: colors.primary, fontSize: typography.xs, fontWeight: '700' }}>
                    {item.medicines.length} {t.medicinesCount} • {takenDoses}/{totalDoses} {t.doseProgress}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </View>
              </TapTarget>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  reminderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  card: {
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
  datePill: {
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
