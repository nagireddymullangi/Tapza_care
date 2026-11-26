import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '@/state/AppContext';
import { useAppTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import { validateLayoutConfig } from '@/validation/configValidator';
import { TapTarget } from '@/components/common/TapTarget';
import { StateBanner } from '@/components/common/StateBanner';

export default function AdminConfigScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useAppTheme();
  const { t } = useI18n();
  const { config, applyLiveAdminConfig, resetLiveAdminConfig } = useAppState();
  const { colors, spacing, radii, typography } = theme;

  const [jsonText, setJsonText] = useState<string>(() =>
    JSON.stringify(config ?? {}, null, 2)
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleApply = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const parsed: unknown = JSON.parse(jsonText);
      const res = validateLayoutConfig(parsed);
      if (!res.valid) {
        setErrorMsg(`${t.adminInvalidJson}: ${res.errors.join(', ')}`);
        return;
      }
      applyLiveAdminConfig(res.config);
      setSuccessMsg('Live config applied! Switch to Home tab to inspect.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.adminInvalidJson);
    }
  };

  const handleReverseSections = () => {
    if (!config) return;
    const reversed = {
      ...config,
      sections: [...config.sections].reverse(),
    };
    setJsonText(JSON.stringify(reversed, null, 2));
    applyLiveAdminConfig(reversed);
    setSuccessMsg('Reversed section order live!');
  };

  const handleReset = async () => {
    setErrorMsg(null);
    await resetLiveAdminConfig();
    setSuccessMsg('Reset to active preset');
    router.back();
  };

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
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </TapTarget>
        <Text style={{ color: colors.textPrimary, fontSize: typography.lg, fontWeight: '800', flex: 1 }}>
          {t.adminTitle}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: spacing.screenHorizontal,
          gap: spacing.sm,
          paddingBottom: spacing.xxl,
        }}
      >
        {errorMsg ? <StateBanner tone="error" message={errorMsg} /> : null}
        {successMsg ? <StateBanner tone="success" message={successMsg} /> : null}

        <View style={[styles.actionsRow, { gap: spacing.xs }]}>
          <TapTarget
            onPress={handleReverseSections}
            style={[
              styles.quickBtn,
              {
                backgroundColor: colors.primarySoft,
                borderColor: colors.primary,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <Text style={{ color: colors.primary, fontSize: typography.xs, fontWeight: '700' }}>
              Flip Section Order
            </Text>
          </TapTarget>

          <TapTarget
            onPress={handleReset}
            style={[
              styles.quickBtn,
              {
                backgroundColor: colors.surfaceMuted,
                borderColor: colors.borderStrong,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <Text style={{ color: colors.textPrimary, fontSize: typography.xs, fontWeight: '700' }}>
              {t.adminReset}
            </Text>
          </TapTarget>
        </View>

        <TextInput
          multiline
          value={jsonText}
          onChangeText={setJsonText}
          autoCapitalize="none"
          autoCorrect={false}
          textAlignVertical="top"
          style={[
            styles.editor,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              borderColor: colors.borderStrong,
              borderRadius: radii.md,
              padding: spacing.sm,
              fontSize: typography.xs,
            },
          ]}
        />

        <TapTarget
          onPress={handleApply}
          style={[
            styles.applyBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: radii.pill,
              paddingVertical: spacing.md,
            },
          ]}
        >
          <Text style={{ color: colors.onPrimary, fontSize: typography.md, fontWeight: '800' }}>
            {t.adminApply}
          </Text>
        </TapTarget>
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
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickBtn: {
    borderWidth: 1,
    alignItems: 'center',
  },
  editor: {
    minHeight: 360,
    borderWidth: 1,
    fontFamily: 'monospace',
  },
  applyBtn: {
    alignItems: 'center',
  },
});
