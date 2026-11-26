# AI Engineering Log (`AI_LOG.md`)

This log documents the key architectural prompts, generated decisions, and what was explicitly rejected or corrected during the build of **Tapza Care**.

---

## 1. Project Foundation & Navigation
- **Decision**: Used Expo SDK 58 (`expo-router` v58) with strict TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`).
- **What was rejected**:
  - Rejected bare React Navigation boilerplate in favor of Expo Router file-based routing under `src/app/`, which gives deep linking (`tapzacare://doctor/[id]`, `tapzacare://prescription/[id]`) out of the box.
  - Rejected ESLint v10 after `eslint-plugin-react` (bundled with `eslint-config-expo`) threw `contextOrFilename.getFilename is not a function`; pinned `eslint@^9.39.0` cleanly.

## 2. Config-Driven Theme & Zero Hard-Coded Styles
- **Decision**: Built `deriveThemeFromConfig()` in `src/theme/tokens.ts` to compute light and dark palettes, contrast-checked foreground colors (`pickReadableTextOn`), spacing, radii, and typography scales directly from `LayoutConfig.theme`.
- **What was rejected**:
  - Rejected putting raw hex codes or static `StyleSheet` font sizes/paddings inside UI components. During review of `BookingBottomSheet.tsx`, replaced initial numeric `paddingVertical: 12` / `14` constants with `theme.spacing.sm` and `theme.spacing.md`.
  - Rejected naive color inversion for dark mode in `SectionRenderer`; instead, light pastel section backgrounds adapt to `theme.colors.surface` / `theme.colors.surfaceMuted` in dark mode while keeping `hero_banner` vibrant.

## 3. Gesture-Driven Bottom Sheet & Reanimated 4 Compatibility
- **Decision**: Implemented `BookingBottomSheet` directly with `react-native-gesture-handler` (`Gesture.Pan()`) + `react-native-reanimated` v4 + `Modal`, paired with a custom `react-native-svg` animated checkmark celebration (`SuccessCelebration`).
- **What was rejected**:
  - Rejected `@gorhom/bottom-sheet` and external `lottie-react-native` JSON files to avoid native runtime mismatches across Expo Go / Web and eliminate external asset failure modes.
  - Rejected mutating `SharedValue.value` inside `useCallback`/`useMemo` and resetting sheet state inside `useEffect`, which `eslint-plugin-react-hooks` v7 (React Compiler rules) flagged (`react-hooks/immutability` and `react-hooks/set-state-in-effect`). Refactored to key `BookingSheetModal` by booking target and use Reanimated 4's `.set()` API.

## 4. Resilience, Booking State & Testing
- **Decision**: Built `AppContext` with `AsyncStorage` caching for the last valid `LayoutConfig`, optimistic booking insertion with `409 Conflict` rollback, and an offline `pending_sync` queue that auto-flushes when network returns.
- **What was rejected**:
  - Rejected shallow happy-path-only mock calls; added runtime switches in `Profile` (`Fast/Slow` latency, `Healthy / Fail /config / Fail /slots / 409 Conflict / Fail All`, and `Offline Mode`) plus an intentionally empty slot day (`Today + 3`) to make every edge state immediately demonstrable.
  - Corrected initial Jest test expectations for `@testing-library/react-native` v14 (`render` and `renderHook` are async in React 19) and added a `react-native-reanimated` mock in `jest.setup.js` so native worklet unpackers do not run in Node Jest.
