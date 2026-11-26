import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '@/state/AppContext';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import { TapTarget } from '@/components/common/TapTarget';
import { EmptyState } from '@/components/common/EmptyState';
import { DoseScheduleCard } from '@/components/prescriptions/DoseScheduleCard';

export default function PrescriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useAppTheme();
  const { t } = useI18n();
  const { prescriptions, isDoseTaken, toggleDoseTaken } = useAppState();
  const { colors, spacing, radii, typography } = theme;

  const rx = prescriptions.find((p) => p.id === id);

  if (!rx) {
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
          icon="document-text-outline"
          title={t.prescriptionNotFound}
          subtitle={String(id ?? '')}
          actionLabel={t.back}
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const totalDoses = rx.medicines.reduce((sum, m) => sum + m.timing.length, 0);
  const takenDoses = rx.medicines.reduce(
    (sum, m) => sum + m.timing.filter((slot) => isDoseTaken(rx.id, m.id, slot)).length,
    0
  );
  const progressPct = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

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
          style={[
            styles.backBtn,
            { backgroundColor: colors.surfaceMuted, borderRadius: radii.pill },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TapTarget>

        <View style={styles.flex1}>
          <Text
            numberOfLines={1}
            style={{ color: colors.textPrimary, fontSize: typography.lg, fontWeight: '800' }}
          >
            {rx.doctorName}
          </Text>
          <Text numberOfLines={1} style={{ color: colors.textSecondary, fontSize: typography.xs }}>
            {rx.clinicName} • {rx.issuedAt}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: spacing.screenHorizontal,
          paddingBottom: spacing.xxl,
          gap: spacing.md,
        }}
      >
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.lg,
              padding: spacing.cardPadding,
              gap: spacing.xs,
            },
          ]}
        >
          {rx.diagnosis ? (
            <Text style={{ color: colors.textPrimary, fontSize: typography.md, fontWeight: '700' }}>
              {rx.diagnosis}
            </Text>
          ) : null}

          <Text style={{ color: colors.textSecondary, fontSize: typography.sm }}>
            {takenDoses}/{totalDoses} {t.doseProgress} ({progressPct}%)
          </Text>

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: colors.surfaceMuted,
                borderRadius: radii.pill,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPct}%`,
                  backgroundColor: colors.success,
                  borderRadius: radii.pill,
                },
              ]}
            />
          </View>
        </View>

        <DoseScheduleCard
          prescriptionId={rx.id}
          timing="morning"
          medicines={rx.medicines}
          isDoseTaken={isDoseTaken}
          onToggleDose={toggleDoseTaken}
        />
        <DoseScheduleCard
          prescriptionId={rx.id}
          timing="afternoon"
          medicines={rx.medicines}
          isDoseTaken={isDoseTaken}
          onToggleDose={toggleDoseTaken}
        />
        <DoseScheduleCard
          prescriptionId={rx.id}
          timing="night"
          medicines={rx.medicines}
          isDoseTaken={isDoseTaken}
          onToggleDose={toggleDoseTaken}
        />
      </ScrollView>
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
  flex1: {
    flex: 1,
  },
  summaryCard: {
    borderWidth: 1,
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
