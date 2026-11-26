import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import type { Doctor } from '@/types/domain';
import { TapTarget } from '@/components/common/TapTarget';

type DoctorCarouselSectionProps = {
  title?: string;
  items: unknown[];
  onBookDoctor: (doctor: Doctor) => void;
  onOpenDoctorDetail: (doctorId: string) => void;
};

function getDoctorInitials(name: string): string {
  const parts = name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

export function DoctorCarouselSection({
  title,
  items,
  onBookDoctor,
  onOpenDoctorDetail,
}: DoctorCarouselSectionProps) {
  const theme = useAppTheme();
  const { t } = useI18n();
  const { colors, spacing, radii, typography } = theme;

  const doctors = items.filter(
    (x): x is Doctor =>
      typeof x === 'object' && x !== null && 'id' in x && 'name' in x && 'specialty' in x
  );

  if (doctors.length === 0) return null;

  return (
    <View style={{ paddingVertical: spacing.md, gap: spacing.sm }}>
      {title ? (
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.lg,
            fontWeight: '700',
            paddingHorizontal: spacing.screenHorizontal,
          }}
        >
          {title}
        </Text>
      ) : null}

      <FlatList
        data={doctors}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(doc) => doc.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.screenHorizontal,
          gap: spacing.sm,
        }}
        renderItem={({ item: doc }) => (
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
            <TapTarget
              onPress={() => onOpenDoctorDetail(doc.id)}
              style={[styles.headerRow, { gap: spacing.sm }]}
            >
              {doc.photoUrl ? (
                <Image source={{ uri: doc.photoUrl }} style={[styles.avatar, { borderRadius: radii.pill }]} />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: colors.primarySoft,
                      borderRadius: radii.pill,
                    },
                  ]}
                >
                  <Text style={{ color: colors.primary, fontSize: typography.md, fontWeight: '800' }}>
                    {getDoctorInitials(doc.name)}
                  </Text>
                </View>
              )}

              <View style={styles.docInfo}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.textPrimary,
                    fontSize: typography.md,
                    fontWeight: '700',
                  }}
                >
                  {doc.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.xs,
                    fontWeight: '500',
                  }}
                >
                  {doc.specialty}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.xs,
                  }}
                >
                  {doc.languages.join(' • ')}
                </Text>
              </View>
            </TapTarget>

            <View
              style={[
                styles.slotRow,
                {
                  backgroundColor: colors.surfaceMuted,
                  borderRadius: radii.sm,
                  paddingHorizontal: spacing.xs,
                  paddingVertical: spacing.xxs + 2,
                  gap: spacing.xxs,
                },
              ]}
            >
              <Ionicons name="time-outline" size={14} color={colors.success} />
              <Text
                numberOfLines={1}
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.xs,
                  fontWeight: '600',
                  flex: 1,
                }}
              >
                {t.nextSlot}: {doc.nextAvailableSlot ?? t.today}
              </Text>
            </View>

            <View style={styles.footerRow}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.md,
                  fontWeight: '800',
                }}
              >
                ₹{doc.feeInr}
              </Text>
              <TapTarget
                onPress={() => onBookDoctor(doc)}
                style={[
                  styles.bookBtn,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: radii.pill,
                    paddingHorizontal: spacing.md,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.onPrimary,
                    fontSize: typography.xs,
                    fontWeight: '700',
                  }}
                >
                  {t.bookNow}
                </Text>
              </TapTarget>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 244,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
    gap: 2,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookBtn: {
    alignItems: 'center',
  },
});
