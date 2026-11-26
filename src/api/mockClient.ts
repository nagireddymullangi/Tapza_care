import type {
  Booking,
  Doctor,
  LayoutConfig,
  MockControlSettings,
  Prescription,
  Slot,
} from '@/types/domain';
import {
  FESTIVAL_LAYOUT_CONFIG,
  MOCK_DOCTORS,
  MOCK_PRESCRIPTIONS,
  NORMAL_LAYOUT_CONFIG,
  generateMockSlotsForDate,
} from './mockData';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class MockApiClient {
  private settings: MockControlSettings = {
    preset: 'normal',
    latencyMode: 'normal',
    failureMode: 'none',
    offlineMode: false,
  };

  private customConfigOverride: LayoutConfig | null = null;
  private bookedSlotIds = new Set<string>();
  private bookings: Booking[] = [];

  getSettings(): MockControlSettings {
    return { ...this.settings };
  }

  updateSettings(patch: Partial<MockControlSettings>): MockControlSettings {
    this.settings = { ...this.settings, ...patch };
    return this.getSettings();
  }

  setCustomConfigOverride(config: LayoutConfig | null): void {
    this.customConfigOverride = config;
  }

  private async simulateNetwork(endpoint: 'config' | 'doctors' | 'slots' | 'bookings' | 'prescriptions'): Promise<void> {
    const delayMs = this.settings.latencyMode === 'slow' ? 2400 : 250;
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    if (this.settings.offlineMode) {
      throw new ApiError(0, 'Network offline');
    }

    const mode = this.settings.failureMode;
    if (mode === 'all') {
      throw new ApiError(503, 'Tapza mock server unavailable (simulated)');
    }
    if (mode === 'config' && endpoint === 'config') {
      throw new ApiError(500, 'Failed to fetch remote layout config (simulated)');
    }
    if (mode === 'slots' && endpoint === 'slots') {
      throw new ApiError(500, 'Failed to fetch available slots (simulated)');
    }
    if (mode === 'conflict_409' && endpoint === 'bookings') {
      throw new ApiError(409, 'Slot was already booked by another patient');
    }
  }

  async getConfig(): Promise<LayoutConfig> {
    await this.simulateNetwork('config');
    if (this.customConfigOverride) {
      return structuredCloneCompat(this.customConfigOverride);
    }
    const base =
      this.settings.preset === 'festival' ? FESTIVAL_LAYOUT_CONFIG : NORMAL_LAYOUT_CONFIG;
    return structuredCloneCompat(base);
  }

  async getDoctors(): Promise<Doctor[]> {
    await this.simulateNetwork('doctors');
    return structuredCloneCompat(MOCK_DOCTORS);
  }

  async getSlots(doctorId: string, date: string): Promise<Slot[]> {
    await this.simulateNetwork('slots');
    const generated = generateMockSlotsForDate(doctorId, date);
    return generated.map((slot) => ({
      ...slot,
      available: slot.available && !this.bookedSlotIds.has(slot.id),
    }));
  }

  async createBooking(payload: {
    doctorId: string;
    slotId: string;
    date: string;
    startsAt: string;
    endsAt: string;
  }): Promise<Booking> {
    await this.simulateNetwork('bookings');

    if (this.bookedSlotIds.has(payload.slotId)) {
      throw new ApiError(409, 'Slot already taken');
    }

    this.bookedSlotIds.add(payload.slotId);
    const doctor = MOCK_DOCTORS.find((d) => d.id === payload.doctorId);

    const booking: Booking = {
      id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      doctorId: payload.doctorId,
      doctorName: doctor?.name,
      specialty: doctor?.specialty,
      clinicName: doctor?.clinicName,
      feeInr: doctor?.feeInr,
      slotId: payload.slotId,
      date: payload.date,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };
    this.bookings.unshift(booking);
    return booking;
  }

  async getPrescriptions(): Promise<Prescription[]> {
    await this.simulateNetwork('prescriptions');
    return structuredCloneCompat(MOCK_PRESCRIPTIONS);
  }

  resetBookings(): void {
    this.bookedSlotIds.clear();
    this.bookings = [];
  }
}

function structuredCloneCompat<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const mockApiClient = new MockApiClient();
