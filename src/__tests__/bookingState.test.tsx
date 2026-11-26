/// <reference types="jest" />
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AppProvider, useAppState } from '@/state/AppContext';
import { mockApiClient } from '@/api/mockClient';
import { MOCK_DOCTORS, formatIsoDate } from '@/api/mockData';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('Booking state & optimistic reconciliation', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    mockApiClient.resetBookings();
    mockApiClient.updateSettings({
      preset: 'normal',
      latencyMode: 'normal',
      failureMode: 'none',
      offlineMode: false,
    });
  });

  it('confirms an appointment optimistically and reconciles with the mock API', async () => {
    const { result } = await renderHook(() => useAppState(), { wrapper });

    await waitFor(() => {
      expect(result.current.configLoading).toBe(false);
    });

    const doctor = MOCK_DOCTORS[0]!;
    const today = formatIsoDate(0);
    const slot = {
      id: `slot-${doctor.id}-${today}-0`,
      doctorId: doctor.id,
      startsAt: `${today}T09:30:00`,
      endsAt: `${today}T09:50:00`,
      available: true,
    };

    let outcome: Awaited<ReturnType<typeof result.current.bookSlotOptimistic>> | undefined;
    await act(async () => {
      outcome = await result.current.bookSlotOptimistic({ doctor, slot, date: today });
    });

    expect(outcome?.outcome).toBe('confirmed');
    expect(result.current.bookings).toHaveLength(1);
    expect(result.current.bookings[0]?.status).toBe('confirmed');
    expect(result.current.bookings[0]?.optimistic).toBeUndefined();
  });

  it('rolls back optimistic booking when mock API returns 409 slot conflict', async () => {
    const { result } = await renderHook(() => useAppState(), { wrapper });

    await waitFor(() => {
      expect(result.current.configLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateMockSettings({ failureMode: 'conflict_409' });
    });

    const doctor = MOCK_DOCTORS[0]!;
    const today = formatIsoDate(0);
    const slot = {
      id: `slot-${doctor.id}-${today}-1`,
      doctorId: doctor.id,
      startsAt: `${today}T11:00:00`,
      endsAt: `${today}T11:20:00`,
      available: true,
    };

    let outcome: Awaited<ReturnType<typeof result.current.bookSlotOptimistic>> | undefined;
    await act(async () => {
      outcome = await result.current.bookSlotOptimistic({ doctor, slot, date: today });
    });

    expect(outcome?.outcome).toBe('conflict');
    expect(result.current.bookings).toHaveLength(0);
  });

  it('queues booking offline and syncs it to confirmed when back online', async () => {
    const { result } = await renderHook(() => useAppState(), { wrapper });

    await waitFor(() => {
      expect(result.current.configLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateMockSettings({ offlineMode: true });
    });

    const doctor = MOCK_DOCTORS[1]!;
    const today = formatIsoDate(0);
    const slot = {
      id: `slot-${doctor.id}-${today}-2`,
      doctorId: doctor.id,
      startsAt: `${today}T17:30:00`,
      endsAt: `${today}T17:50:00`,
      available: true,
    };

    await act(async () => {
      const res = await result.current.bookSlotOptimistic({ doctor, slot, date: today });
      expect(res.outcome).toBe('queued');
    });

    expect(result.current.pendingSyncCount).toBe(1);
    expect(result.current.bookings[0]?.status).toBe('pending_sync');

    await act(async () => {
      await result.current.updateMockSettings({ offlineMode: false });
    });

    await waitFor(() => {
      expect(result.current.pendingSyncCount).toBe(0);
    });
    expect(result.current.bookings[0]?.status).toBe('confirmed');
  });
});
