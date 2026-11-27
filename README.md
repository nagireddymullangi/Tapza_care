# Tapza Care — Config-Driven Patient Mobile App

Tapza Care is a React Native (Expo SDK 58, strict TypeScript) patient companion app for Indian clinic patients and families in Hyderabad & Vijayawada. It delivers a Zepto-style remote-config-driven Home screen, a gesture-driven booking flow with optimistic updates and conflict rollback, a morning/afternoon/night prescription & dose tracker, and resilience under slow/failing networks.

## How to Run

### Prerequisites
- Node.js 20+ (tested on Node v24.16.0)
- Expo Go app on Android/iOS or an Android emulator / web browser

### Install & Start
```bash
npm install
npx expo start
```
Then press `a` for Android, `w` for Web, or scan the QR code in Expo Go.

### Verification Commands
```bash
npm run typecheck   # tsc --noEmit (strict TypeScript)
npm run lint        # eslint .
npm test            # jest (config validator, section renderer, booking state)
```

### Android APK / EAS Build
An Android SDK / `eas-cli` build was not generated in this local environment. To produce an installable APK and attach it to a GitHub Release:
```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```
Download the `.apk` from the Expo EAS build link, install via `adb install tapza-care.apk` (or open directly on an Android phone), and attach it to the repository's GitHub Release.

---

## Folder Structure & Why

```text
src/
├── app/                      # Expo Router screens ONLY (no business logic)
│   ├── _layout.tsx           # Root providers (GestureHandler, SafeArea, I18n, AppState, Theme)
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Config-driven bottom tab navigator
│   │   ├── index.tsx         # Zepto-style config-driven Home screen
│   │   ├── bookings.tsx      # Appointments list + offline sync queue banner
│   │   ├── prescriptions.tsx # Prescriptions list + daily notification scheduler
│   │   └── profile.tsx       # Language (EN/HI/TE), theme/preset switches, mock failure switches
│   ├── doctor/[id].tsx       # Deep-linkable doctor profile (tapzacare://doctor/doc-1)
│   ├── prescription/[id].tsx # Prescription Morning/Afternoon/Night dose schedule (tapzacare://prescription/rx-1)
│   └── admin.tsx             # Live in-app remote config JSON editor & section flipper
├── api/
│   ├── mockData.ts           # Normal & Diwali Festival configs + Indian clinic doctors, slots, prescriptions
│   └── mockClient.ts         # Simulated REST client (GET /config, /doctors, /slots, /prescriptions; POST /bookings)
├── components/
│   ├── common/               # Reusable accessible >=44pt TapTarget, Skeletons, StateBanner, EmptyState
│   ├── home/                 # CollapsibleHeader, SectionRenderer, and all 6 home section types
│   ├── booking/              # Gesture-driven BookingBottomSheet + custom SVG SuccessCelebration
│   └── prescriptions/        # DoseScheduleCard (Morning / Afternoon / Night tracker)
├── i18n/                     # English, Hindi (हिन्दी), and Telugu (తెలుగు) localization layer
├── services/                 # Safe wrappers for expo-haptics and expo-notifications
├── state/                    # AppContext (cached config, optimistic bookings, offline queue, dose persistence)
├── theme/                    # Config-derived theme tokens & ThemeContext (zero hard-coded component colors)
├── types/                    # Strict TypeScript domain models
├── validation/               # Runtime LayoutConfig validator & sanitizer
└── __tests__/                # Jest unit & component tests
```

Keeping `src/app/` strictly for routing/screens and placing theme derivation, runtime validation, mock networking, and state outside `src/app/` keeps every layer independently testable and easy for another engineer to navigate.

---

## Architecture Decisions

1. **Zero Hard-Coded Design Tokens in Components**
   `deriveThemeFromConfig()` in `src/theme/tokens.ts` computes semantic colors (including luminance-checked `onPrimary`/`textOnAccent` contrast and optional config-driven dark mode), spacing scale, border radii, and typography sizes from `LayoutConfig.theme`. Every component reads tokens from `useAppTheme()`.

2. **Safe Runtime Config Validation & Unknown-Section Skipping**
   `validateLayoutConfig()` in `src/validation/configValidator.ts` validates required fields, sanitizes invalid color hexes with warnings, and preserves unknown section types so `SectionRenderer` returns `null` cleanly without crashing.

3. **UI-Thread Scroll & Gesture Animations**
   - `CollapsibleHeader` and `HeroBannerSection` interpolate against a Reanimated `SharedValue<number>` (`scrollY`) driven by `useAnimatedScrollHandler`.
   - `SectionRenderer` animates each section band into view as it crosses the viewport threshold.
   - `BookingBottomSheet` uses `react-native-gesture-handler` (`Gesture.Pan()`) + Reanimated spring physics for drag-to-dismiss and velocity flinging without third-party bottom-sheet version conflicts.

4. **Resilience: Cache-First Fallback, Optimistic Reconciliation & Offline Queue**
   - Last valid `LayoutConfig` is cached in `AsyncStorage` (`tapza_cached_config_v1`). If `/config` fails, the app falls back to the cached config with a non-blocking retry banner (or a designed error/offline layout option if no cache exists).
   - `bookSlotOptimistic()` inserts an optimistic booking immediately, reconciles with `POST /bookings`, rolls back cleanly on `409 Conflict`, or stores the booking as `pending_sync` when offline and syncs automatically upon reconnect.

5. **Accessibility & Multilingual Audience**
   - OS font scaling is left enabled across all `Text` nodes.
   - All interactive controls use `TapTarget` (`minHeight: 44, minWidth: 44`).
   - Full English, Hindi (`हिन्दी`), and Telugu (`తెలుగు`) copy is built into `I18nContext`.

---

## What Was Cut / Deferred & Why

- **Real Remote CDN & Auth / WhatsApp OTP**: Mocked locally via `MockApiClient` with runtime latency, failure, and offline switches so every edge state is deterministically reproducible without backend setup.
- **Native Android APK Binary & Video Capture**: This workspace does not have an Android SDK/emulator (`ANDROID_HOME` unset) or EAS account configured, so binary compilation and device screen recording are left for the EAS build step.
- **Clinic Photo Assets**: Doctor avatars use styled initials and vector iconography (`@expo/vector-icons`, `react-native-svg`) instead of external stock URLs so cards never break offline.

---

## Honest Time Spent

- Project setup, strict TypeScript, Expo Router, ESLint, and Jest setup: ~25 mins
- Domain types, config validator, derived theme system, EN/HI/TE i18n, and mock API + state resilience: ~35 mins
- Config-driven Home sections, collapsible header, skeletons, gesture-driven booking sheet, SVG success animation, prescriptions/dose tracker, and Admin editor: ~50 mins
- Testing, lint fixes (React Compiler + Reanimated 4 `.set()` APIs), and documentation: ~30 mins
- **Total**: ~2 hours 20 minutes
# Tapza_care
