export type TabScreenName = 'home' | 'bookings' | 'prescriptions' | 'profile';

export type BackgroundSpec = {
  kind: 'color' | 'gradient' | 'image';
  value: string;
};

export type FestivalThemeMeta = {
  name: string;
  greeting: string;
  bannerImageUrl: string;
};

export type ConfigTheme = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  festival?: FestivalThemeMeta;
  dark?: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
  };
  spacingScale?: number;
  fontScale?: number;
};

export type ConfigTab = {
  id: string;
  label: string;
  icon: string;
  screen: TabScreenName;
};

export type ConfigSection = {
  id: string;
  type: string;
  background: BackgroundSpec;
  title?: string;
  items: unknown[];
};

export type LayoutConfig = {
  version: number;
  theme: ConfigTheme;
  tabs: ConfigTab[];
  sections: ConfigSection[];
};

export type HeroBannerItem = {
  id: string;
  greeting: string;
  headline: string;
  subtitle: string;
  ctaLabel: string;
  imageUrl?: string;
  badge?: string;
  targetDoctorId?: string;
};

export type CategoryChipItem = {
  id: string;
  label: string;
  icon: string;
  categoryKey: string;
};

export type QuickActionItem = {
  id: string;
  label: string;
  subtitle?: string;
  icon: string;
  actionType: 'book' | 'prescriptions' | 'reminders' | 'family';
};

export type ServiceGridItem = {
  id: string;
  name: string;
  priceInr: number;
  originalPriceInr?: number;
  badge?: string;
  imageUrl?: string;
  icon?: string;
  durationLabel?: string;
  doctorId: string;
  category?: string;
};

export type OfferStripItem = {
  id: string;
  message: string;
  code?: string;
  badge?: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  feeInr: number;
  languages: string[];
  clinicName?: string;
  experienceYears?: number;
  nextAvailableSlot?: string;
  rating?: number;
};

export type Slot = {
  id: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
};

export type BookingStatus = 'confirmed' | 'pending_sync' | 'failed';

export type Booking = {
  id: string;
  doctorId: string;
  doctorName?: string;
  specialty?: string;
  clinicName?: string;
  feeInr?: number;
  slotId: string;
  date: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  status: BookingStatus;
  optimistic?: boolean;
};

export type DoseTiming = 'morning' | 'afternoon' | 'night';

export type Medicine = {
  id: string;
  name: string;
  dose: string;
  days: number;
  timing: DoseTiming[];
  instructions?: string;
};

export type Prescription = {
  id: string;
  issuedAt: string;
  doctorName: string;
  clinicName: string;
  diagnosis?: string;
  medicines: Medicine[];
};

export type ConfigPreset = 'normal' | 'festival';

export type FailureMode = 'none' | 'config' | 'slots' | 'conflict_409' | 'all';

export type LatencyMode = 'normal' | 'slow';

export type MockControlSettings = {
  preset: ConfigPreset;
  latencyMode: LatencyMode;
  failureMode: FailureMode;
  offlineMode: boolean;
};

export type SupportedLocale = 'en' | 'hi' | 'te';

export type DoseTakenMap = Record<string, string>; // key: `${prescriptionId}:${medicineId}:${date}:${timing}` -> ISO timestamp
