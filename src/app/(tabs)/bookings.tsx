import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '@/state/AppContext';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import { EmptyState } from '@/components/common/EmptyState';
import { StateBanner } from '@/components/common/StateBanner';

function formatBookingTime(iso: string): string {
  const part = iso.split('T')[1] ?? '';
  const [hStr = '0', mStr = '00'] = part.split(':');
  const h = parseInt(hStr, 10);
  if (Number.isNaN(h)) return iso;
  return `${h % 12 || 12}:${mStr} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useAppTheme();
  const { t } = useI18n();
  const { bookings, pendingSyncCount, syncOfflineQueue } = useAppState();
  const { colors, spacing, radii, typography } = theme;
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSync = async () => {
    const res = await syncOfflineQueue();
    if (res.synced > 0) {
      setSyncMessage(`${res.synced} appointment(s) synced`);
    }
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
      <View style={[styles.header, { paddingHorizontal: spacing.screenHorizontal, marginBottom: spacing.sm }]}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.xxl,
            fontWeight: '800',
          }}
        >
          {t.bookingsTitle}
        </Text>
      </View>

      {pendingSyncCount > 0 ? (
        <StateBanner
          tone="warning"
          message={`${pendingSyncCount} ${t.pendingSyncBadge}`}
          actionLabel={t.syncNow}
          onAction={handleSync}
        />
      ) : syncMessage ? (
        <StateBanner tone="success" message={syncMessage} />
      ) : null}

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.screenHorizontal,
          paddingBottom: spacing.xxl,
          gap: spacing.sm,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View style={{ marginTop: spacing.xl }}>
            <EmptyState
              icon="calendar-outline"
              title={t.bookingsEmptyTitle}
              subtitle={t.bookingsEmptySubtitle}
              actionLabel={t.bookNow}
              onAction={() => router.push('/(tabs)')}
            />
          </View>
        }
        renderItem={({ item }) => {
          const isPending = item.status === 'pending_sync';
          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: isPending ? colors.warning : colors.border,
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
                    {item.doctorName ?? item.doctorId}
                  </Text>
                  {item.specialty ? (
                    <Text style={{ color: colors.textSecondary, fontSize: typography.xs }}>
                      {item.specialty}
                    </Text>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: isPending ? colors.warningSoft : colors.successSoft,
                      borderRadius: radii.pill,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xxs,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isPending ? colors.warning : colors.success,
                      fontSize: typography.xs,
                      fontWeight: '800',
                    }}
                  >
                    {isPending ? t.pendingSyncBadge : t.confirmedBadge}
                  </Text>
                </View>
              </View>

              <View style={[styles.metaRow, { gap: spacing.xs }]}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <Text style={{ color: colors.textPrimary, fontSize: typography.sm, fontWeight: '600' }}>
                  {item.date} • {formatBookingTime(item.startsAt)}
                </Text>
                {item.feeInr ? (
                  <Text style={{ color: colors.textSecondary, fontSize: typography.sm, marginLeft: 'auto' }}>
                    ₹{item.feeInr}
                  </Text>
                ) : null}
              </View>

              {item.clinicName ? (
                <View style={[styles.metaRow, { gap: spacing.xs }]}>
                  <Ionicons name="location-outline" size={15} color={colors.textSecondary} />
                  <Text style={{ color: colors.textSecondary, fontSize: typography.xs }}>
                    {item.clinicName}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }}
      />
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
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  statusPill: {
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
