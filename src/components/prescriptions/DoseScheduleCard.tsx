import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import type { DoseTiming, Medicine } from '@/types/domain';
import { TapTarget } from '@/components/common/TapTarget';

type DoseScheduleCardProps = {
  prescriptionId: string;
  timing: DoseTiming;
  medicines: Medicine[];
  isDoseTaken: (prescriptionId: string, medicineId: string, timing: DoseTiming) => boolean;
  onToggleDose: (prescriptionId: string, medicineId: string, timing: DoseTiming) => void;
};

const TIMING_META: Record<
  DoseTiming,
  { icon: keyof typeof Ionicons.glyphMap; timeHint: string }
> = {
  morning: { icon: 'sunny-outline', timeHint: '8:00 AM' },
  afternoon: { icon: 'partly-sunny-outline', timeHint: '2:00 PM' },
  night: { icon: 'moon-outline', timeHint: '9:00 PM' },
};

export function DoseScheduleCard({
  prescriptionId,
  timing,
  medicines,
  isDoseTaken,
  onToggleDose,
}: DoseScheduleCardProps) {
  const theme = useAppTheme();
  const { t } = useI18n();
  const { colors, spacing, radii, typography } = theme;

  const filtered = medicines.filter((m) => m.timing.includes(timing));
  if (filtered.length === 0) return null;

  const titleLabel =
    timing === 'morning' ? t.morning : timing === 'afternoon' ? t.afternoon : t.night;
  const meta = TIMING_META[timing];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.cardPadding,
          gap: spacing.sm,
        },
      ]}
    >
      <View style={[styles.header, { gap: spacing.xs }]}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: colors.primarySoft,
              borderRadius: radii.pill,
            },
          ]}
        >
          <Ionicons name={meta.icon} size={18} color={colors.primary} />
        </View>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.md,
            fontWeight: '800',
            flex: 1,
          }}
        >
          {titleLabel}
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: typography.xs,
            fontWeight: '600',
          }}
        >
          {meta.timeHint}
        </Text>
      </View>

      {filtered.map((med) => {
        const taken = isDoseTaken(prescriptionId, med.id, timing);
        return (
          <View
            key={`${timing}-${med.id}`}
            style={[
              styles.medRow,
              {
                backgroundColor: taken ? colors.successSoft : colors.surfaceMuted,
                borderColor: taken ? colors.success : colors.border,
                borderRadius: radii.md,
                padding: spacing.sm,
                gap: spacing.sm,
              },
            ]}
          >
            <View style={styles.medInfo}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.sm,
                  fontWeight: '700',
                }}
              >
                {med.name}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.xs,
                }}
              >
                {med.dose} • {med.days} {t.daysLeft}
              </Text>
              {med.instructions ? (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.xs,
                    fontStyle: 'italic',
                    marginTop: 2,
                  }}
                >
                  {med.instructions}
                </Text>
              ) : null}
            </View>

            <TapTarget
              onPress={() => onToggleDose(prescriptionId, med.id, timing)}
              accessibilityState={{ checked: taken }}
              style={[
                styles.takeBtn,
                {
                  backgroundColor: taken ? colors.success : colors.primary,
                  borderRadius: radii.pill,
                  paddingHorizontal: spacing.sm,
                },
              ]}
            >
              <Ionicons
                name={taken ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={colors.onPrimary}
              />
              <Text
                style={{
                  color: colors.onPrimary,
                  fontSize: typography.xs,
                  fontWeight: '700',
                }}
              >
                {taken ? t.takenLabel : t.markTaken}
              </Text>
            </TapTarget>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  medInfo: {
    flex: 1,
    gap: 2,
  },
  takeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
