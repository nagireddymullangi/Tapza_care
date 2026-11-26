import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError, mockApiClient } from '@/api/mockClient';
import { NORMAL_LAYOUT_CONFIG, formatIsoDate } from '@/api/mockData';
import type {
  Booking,
  ConfigPreset,
  Doctor,
  DoseTakenMap,
  DoseTiming,
  LayoutConfig,
  MockControlSettings,
  Prescription,
  Slot,
} from '@/types/domain';
import { validateLayoutConfig } from '@/validation/configValidator';
import { triggerErrorHaptic, triggerSuccessHaptic } from '@/services/haptics';

const CACHE_CONFIG_KEY = 'tapza_cached_config_v1';
const BOOKINGS_STORAGE_KEY = 'tapza_bookings_v1';
const DOSE_LOG_STORAGE_KEY = 'tapza_dose_log_v1';
const DARK_MODE_STORAGE_KEY = 'tapza_dark_mode_v1';

export type BookingAttemptResult =
  | { outcome: 'confirmed'; booking: Booking }
  | { outcome: 'queued'; booking: Booking }
  | { outcome: 'conflict'; message: string }
  | { outcome: 'error'; message: string };

type AppContextValue = {
  config: LayoutConfig | null;
  configLoading: boolean;
  configError: string | null;
  isUsingCachedConfig: boolean;
  isDark: boolean;
  toggleDark: () => void;
  mockSettings: MockControlSettings;
  updateMockSettings: (patch: Partial<MockControlSettings>) => Promise<void>;
  switchPreset: (preset: ConfigPreset) => Promise<void>;
  refreshConfig: () => Promise<void>;
  loadBundledFallbackConfig: () => void;
  applyLiveAdminConfig: (nextConfig: LayoutConfig) => void;
  resetLiveAdminConfig: () => Promise<void>;

  doctors: Doctor[];
  doctorsLoading: boolean;

  bookings: Booking[];
  pendingSyncCount: number;
  bookSlotOptimistic: (params: {
    doctor: Doctor;
    slot: Slot;
    date: string;
  }) => Promise<BookingAttemptResult>;
  syncOfflineQueue: () => Promise<{ synced: number; failed: number }>;

  prescriptions: Prescription[];
  prescriptionsLoading: boolean;
  prescriptionsError: string | null;
  refreshPrescriptions: () => Promise<void>;
  doseTakenMap: DoseTakenMap;
  isDoseTaken: (prescriptionId: string, medicineId: string, timing: DoseTiming) => boolean;
  toggleDoseTaken: (prescriptionId: string, medicineId: string, timing: DoseTiming) => void;

  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function makeDoseKey(
  prescriptionId: string,
  medicineId: string,
  date: string,
  timing: DoseTiming
): string {
  return `${prescriptionId}:${medicineId}:${date}:${timing}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<LayoutConfig | null>(null);
  const [configLoading, setConfigLoading] = useState<boolean>(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isUsingCachedConfig, setIsUsingCachedConfig] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  const [mockSettings, setMockSettings] = useState<MockControlSettings>(() =>
    mockApiClient.getSettings()
  );

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState<boolean>(true);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState<boolean>(true);
  const [prescriptionsError, setPrescriptionsError] = useState<string | null>(null);

  const [doseTakenMap, setDoseTakenMap] = useState<DoseTakenMap>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const persistBookings = useCallback((nextBookings: Booking[]) => {
    AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(nextBookings)).catch(() => {});
  }, []);

  const refreshConfig = useCallback(async () => {
    setConfigLoading(true);
    setConfigError(null);
    try {
      const raw = await mockApiClient.getConfig();
      const validated = validateLayoutConfig(raw);
      if (!validated.valid) {
        throw new Error(`Invalid config from server: ${validated.errors.join(', ')}`);
      }
      setConfig(validated.config);
      setIsUsingCachedConfig(false);
      await AsyncStorage.setItem(CACHE_CONFIG_KEY, JSON.stringify(validated.config)).catch(() => {});
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load remote config';
      setConfigError(message);
      try {
        const cachedRaw = await AsyncStorage.getItem(CACHE_CONFIG_KEY);
        if (cachedRaw) {
          const parsed: unknown = JSON.parse(cachedRaw);
          const validated = validateLayoutConfig(parsed);
          if (validated.valid) {
            setConfig(validated.config);
            setIsUsingCachedConfig(true);
          }
        }
      } catch {
        // Ignore cache read error
      }
    } finally {
      setConfigLoading(false);
    }
  }, []);

  const refreshDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    try {
      const list = await mockApiClient.getDoctors();
      setDoctors(list);
    } catch {
      // Keep previous doctors if already present
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  const refreshPrescriptions = useCallback(async () => {
    setPrescriptionsLoading(true);
    setPrescriptionsError(null);
    try {
      const list = await mockApiClient.getPrescriptions();
      setPrescriptions(list);
    } catch (err) {
      setPrescriptionsError(err instanceof Error ? err.message : 'Could not fetch prescriptions');
    } finally {
      setPrescriptionsLoading(false);
    }
  }, []);

  // Bootstrap persisted state + initial fetch
  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const [savedBookings, savedDoses, savedDark] = await Promise.all([
          AsyncStorage.getItem(BOOKINGS_STORAGE_KEY),
          AsyncStorage.getItem(DOSE_LOG_STORAGE_KEY),
          AsyncStorage.getItem(DARK_MODE_STORAGE_KEY),
        ]);
        if (!active) return;
        if (savedBookings) {
          const parsed = JSON.parse(savedBookings) as Booking[];
          if (Array.isArray(parsed)) setBookings(parsed);
        }
        if (savedDoses) {
          const parsed = JSON.parse(savedDoses) as DoseTakenMap;
          if (parsed && typeof parsed === 'object') setDoseTakenMap(parsed);
        }
        if (savedDark === 'true') {
          setIsDark(true);
        }
      } catch {
        // Ignore bootstrap errors
      }
      await Promise.all([refreshConfig(), refreshDoctors(), refreshPrescriptions()]);
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, [refreshConfig, refreshDoctors, refreshPrescriptions]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, String(next)).catch(() => {});
      return next;
    });
  }, []);

  const syncOfflineQueue = useCallback(async (): Promise<{ synced: number; failed: number }> => {
    const pending = bookings.filter((b) => b.status === 'pending_sync');
    if (pending.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;
    const updatedMap = new Map<string, Booking>();

    for (const item of pending) {
      try {
        const confirmed = await mockApiClient.createBooking({
          doctorId: item.doctorId,
          slotId: item.slotId,
          date: item.date,
          startsAt: item.startsAt,
          endsAt: item.endsAt,
        });
        updatedMap.set(item.id, confirmed);
        synced += 1;
      } catch {
        failed += 1;
      }
    }

    if (synced > 0) {
      setBookings((prev) => {
        const next = prev.map((b) => updatedMap.get(b.id) ?? b);
        persistBookings(next);
        return next;
      });
      await triggerSuccessHaptic();
    }

    return { synced, failed };
  }, [bookings, persistBookings]);

  const updateMockSettings = useCallback(
    async (patch: Partial<MockControlSettings>) => {
      const wasOffline = mockSettings.offlineMode;
      const updated = mockApiClient.updateSettings(patch);
      setMockSettings(updated);

      if (patch.preset !== undefined) {
        mockApiClient.setCustomConfigOverride(null);
        await refreshConfig();
      } else if (wasOffline && patch.offlineMode === false) {
        await syncOfflineQueue();
        await refreshConfig();
      }
    },
    [mockSettings.offlineMode, refreshConfig, syncOfflineQueue]
  );

  const switchPreset = useCallback(
    async (preset: ConfigPreset) => {
      await updateMockSettings({ preset });
    },
    [updateMockSettings]
  );

  const loadBundledFallbackConfig = useCallback(() => {
    setConfig(NORMAL_LAYOUT_CONFIG);
    setIsUsingCachedConfig(true);
    setConfigError(null);
  }, []);

  const applyLiveAdminConfig = useCallback((nextConfig: LayoutConfig) => {
    mockApiClient.setCustomConfigOverride(nextConfig);
    setConfig(nextConfig);
    setIsUsingCachedConfig(false);
    setConfigError(null);
    AsyncStorage.setItem(CACHE_CONFIG_KEY, JSON.stringify(nextConfig)).catch(() => {});
  }, []);

  const resetLiveAdminConfig = useCallback(async () => {
    mockApiClient.setCustomConfigOverride(null);
    await refreshConfig();
  }, [refreshConfig]);

  const bookSlotOptimistic = useCallback(
    async ({
      doctor,
      slot,
      date,
    }: {
      doctor: Doctor;
      slot: Slot;
      date: string;
    }): Promise<BookingAttemptResult> => {
      const tempId = `optimistic-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const optimisticBooking: Booking = {
        id: tempId,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        clinicName: doctor.clinicName,
        feeInr: doctor.feeInr,
        slotId: slot.id,
        date,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        createdAt: new Date().toISOString(),
        status: mockSettings.offlineMode ? 'pending_sync' : 'confirmed',
        optimistic: true,
      };

      // Optimistic insert
      setBookings((prev) => {
        const next = [optimisticBooking, ...prev];
        persistBookings(next);
        return next;
      });

      try {
        const confirmed = await mockApiClient.createBooking({
          doctorId: doctor.id,
          slotId: slot.id,
          date,
          startsAt: slot.startsAt,
          endsAt: slot.endsAt,
        });

        setBookings((prev) => {
          const next = prev.map((b) => (b.id === tempId ? confirmed : b));
          persistBookings(next);
          return next;
        });
        await triggerSuccessHaptic();
        return { outcome: 'confirmed', booking: confirmed };
      } catch (err) {
        if (err instanceof ApiError && err.status === 0) {
          // Offline mode -> keep in offline queue as pending_sync!
          const queuedBooking: Booking = { ...optimisticBooking, status: 'pending_sync', optimistic: false };
          setBookings((prev) => {
            const next = prev.map((b) => (b.id === tempId ? queuedBooking : b));
            persistBookings(next);
            return next;
          });
          await triggerSuccessHaptic();
          return { outcome: 'queued', booking: queuedBooking };
        }

        // Rollback optimistic booking on 409 conflict or server error
        setBookings((prev) => {
          const next = prev.filter((b) => b.id !== tempId);
          persistBookings(next);
          return next;
        });
        await triggerErrorHaptic();

        if (err instanceof ApiError && err.status === 409) {
          return { outcome: 'conflict', message: err.message };
        }
        return {
          outcome: 'error',
          message: err instanceof Error ? err.message : 'Booking failed',
        };
      }
    },
    [mockSettings.offlineMode, persistBookings]
  );

  const todayKey = formatIsoDate(0);

  const isDoseTaken = useCallback(
    (prescriptionId: string, medicineId: string, timing: DoseTiming) => {
      const key = makeDoseKey(prescriptionId, medicineId, todayKey, timing);
      return Boolean(doseTakenMap[key]);
    },
    [doseTakenMap, todayKey]
  );

  const toggleDoseTaken = useCallback(
    (prescriptionId: string, medicineId: string, timing: DoseTiming) => {
      const key = makeDoseKey(prescriptionId, medicineId, todayKey, timing);
      setDoseTakenMap((prev) => {
        const next = { ...prev };
        if (next[key]) {
          delete next[key];
        } else {
          next[key] = new Date().toISOString();
          triggerSuccessHaptic().catch(() => {});
        }
        AsyncStorage.setItem(DOSE_LOG_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [todayKey]
  );

  const pendingSyncCount = useMemo(
    () => bookings.filter((b) => b.status === 'pending_sync').length,
    [bookings]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      config,
      configLoading,
      configError,
      isUsingCachedConfig,
      isDark,
      toggleDark,
      mockSettings,
      updateMockSettings,
      switchPreset,
      refreshConfig,
      loadBundledFallbackConfig,
      applyLiveAdminConfig,
      resetLiveAdminConfig,
      doctors,
      doctorsLoading,
      bookings,
      pendingSyncCount,
      bookSlotOptimistic,
      syncOfflineQueue,
      prescriptions,
      prescriptionsLoading,
      prescriptionsError,
      refreshPrescriptions,
      doseTakenMap,
      isDoseTaken,
      toggleDoseTaken,
      selectedCategory,
      setSelectedCategory,
    }),
    [
      config,
      configLoading,
      configError,
      isUsingCachedConfig,
      isDark,
      toggleDark,
      mockSettings,
      updateMockSettings,
      switchPreset,
      refreshConfig,
      loadBundledFallbackConfig,
      applyLiveAdminConfig,
      resetLiveAdminConfig,
      doctors,
      doctorsLoading,
      bookings,
      pendingSyncCount,
      bookSlotOptimistic,
      syncOfflineQueue,
      prescriptions,
      prescriptionsLoading,
      prescriptionsError,
      refreshPrescriptions,
      doseTakenMap,
      isDoseTaken,
      toggleDoseTaken,
      selectedCategory,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppState must be used inside AppProvider');
  }
  return ctx;
}
