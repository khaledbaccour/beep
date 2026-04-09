const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';

interface ApiResponse<T> {
  data: T;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SessionOption {
  id: string;
  durationMinutes: number;
  priceMillimes: number;
  label?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ExpertProfile {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio: string;
  headline?: string;
  category: string;
  tags?: string[];
  sessionPriceMillimes: number;
  sessionDurationMinutes: number;
  timezone: string;
  averageRating: number;
  totalSessions: number;
  sessionOptions: SessionOption[];
}

export interface MarketplaceSearchParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CLIENT' | 'EXPERT' | 'ADMIN';
    avatarUrl: string | null;
    onboardingCompleted?: boolean;
  };
}

export async function registerUser(body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<ApiResponse<AuthResponse>> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function loginUser(body: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ── Expert Profile ── */

export async function getExpertBySlug(slug: string): Promise<ApiResponse<ExpertProfile>> {
  const res = await fetch(`${API_BASE}/experts/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Expert not found' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ── Availability Slots ── */

export interface AvailableSlot {
  startTime: string;
  endTime: string;
}

export async function getAvailableSlots(
  expertProfileId: string,
  date: string,
  durationMinutes?: number,
): Promise<ApiResponse<AvailableSlot[]>> {
  let url = `${API_BASE}/availability/${encodeURIComponent(expertProfileId)}/slots?date=${encodeURIComponent(date)}`;
  if (durationMinutes) {
    url += `&duration=${durationMinutes}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to load slots' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function getAvailableDates(
  expertProfileId: string,
  from: string,
  to: string,
): Promise<ApiResponse<string[]>> {
  const res = await fetch(
    `${API_BASE}/availability/${encodeURIComponent(expertProfileId)}/available-dates?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to load available dates' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ── Bookings ── */

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED_BY_CLIENT'
  | 'CANCELLED_BY_EXPERT'
  | 'NO_SHOW'
  | 'DISPUTED';

export interface BookingResponse {
  id: string;
  clientId: string;
  expertProfileId: string;
  expertName: string;
  clientName: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  status: BookingStatus;
  amountMillimes: number;
  durationMinutes?: number;
  sessionRoomId?: string;
}

export async function createBooking(
  body: { expertProfileId: string; scheduledStartTime: string; sessionOptionId?: string },
  token: string,
): Promise<ApiResponse<BookingResponse>> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Booking failed' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function confirmBookingPayment(
  bookingId: string,
  transactionId: string,
  token: string,
): Promise<ApiResponse<BookingResponse>> {
  const res = await fetch(
    `${API_BASE}/bookings/${encodeURIComponent(bookingId)}/confirm-payment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transactionId }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Payment confirmation failed' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ── Dashboard: Expert Profile CRUD ── */

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('beep_token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/* ── User Profile ── */

export async function getUserProfile(): Promise<ApiResponse<AuthResponse['user']>> {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to get profile' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ── User Role ── */

export async function revertToClient(): Promise<ApiResponse<AuthResponse>> {
  const res = await fetch(`${API_BASE}/users/revert-to-client`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Revert failed' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function checkSlugAvailability(slug: string): Promise<ApiResponse<{ available: boolean }>> {
  const res = await fetch(`${API_BASE}/experts/slug-available/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Slug check failed' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export interface CreateExpertProfileBody {
  slug: string;
  bio: string;
  headline?: string;
  category: string;
  tags?: string[];
  sessionPriceMillimes: number;
  sessionDurationMinutes?: number;
  timezone?: string;
  sessionOptions?: SessionOptionInput[];
}

export async function createExpertProfile(body: CreateExpertProfileBody): Promise<ApiResponse<ExpertProfile>> {
  const res = await fetch(`${API_BASE}/experts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to create profile' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function updateExpertProfile(body: Partial<CreateExpertProfileBody>): Promise<ApiResponse<ExpertProfile>> {
  const res = await fetch(`${API_BASE}/experts`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ── Dashboard: Availability ── */

export interface AvailabilityScheduleSlot {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export async function setAvailability(slots: AvailabilityScheduleSlot[]): Promise<ApiResponse<AvailabilityScheduleSlot[]>> {
  const res = await fetch(`${API_BASE}/availability`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ slots }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to set availability' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function getSchedules(expertProfileId: string): Promise<ApiResponse<AvailabilityScheduleSlot[]>> {
  const res = await fetch(`${API_BASE}/availability/${encodeURIComponent(expertProfileId)}/schedules`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export interface WeekSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export async function setWeekAvailability(weekStart: string, slots: WeekSlot[]): Promise<ApiResponse<WeekSlot[]>> {
  const res = await fetch(`${API_BASE}/availability/week`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ weekStart, slots }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to save week availability' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function getWeekSlots(expertProfileId: string, weekStart: string): Promise<ApiResponse<WeekSlot[]>> {
  const res = await fetch(
    `${API_BASE}/availability/${encodeURIComponent(expertProfileId)}/week-slots?weekStart=${encodeURIComponent(weekStart)}`,
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export interface RecurrenceConfig {
  isRecurring: boolean;
  recurringUntil: string | null;
}

export async function setRecurrence(config: RecurrenceConfig): Promise<ApiResponse<RecurrenceConfig>> {
  const res = await fetch(`${API_BASE}/availability/recurrence`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to save recurrence' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function getRecurrence(expertProfileId: string): Promise<ApiResponse<RecurrenceConfig>> {
  const res = await fetch(`${API_BASE}/availability/${encodeURIComponent(expertProfileId)}/recurrence`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/* ── Dashboard: Bookings ── */

export async function getMyBookings(): Promise<ApiResponse<BookingResponse[]>> {
  const res = await fetch(`${API_BASE}/bookings/my`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getExpertBookings(): Promise<ApiResponse<BookingResponse[]>> {
  const res = await fetch(`${API_BASE}/bookings/expert`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function cancelBooking(id: string, reason: string): Promise<ApiResponse<BookingResponse>> {
  const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(id)}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to cancel booking' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ── Expert Onboarding ── */

export interface OnboardingStep1Data {
  slug: string;
  bio: string;
  headline?: string;
  category: string;
}

export interface OnboardingStep2Data {
  tags: string[];
  certifications: { name: string; issuer: string; year: number }[];
  yearsOfExperience: number;
  languages: string[];
}

export interface SessionOptionInput {
  durationMinutes: number;
  priceMillimes: number;
  label?: string;
  sortOrder?: number;
}

export interface OnboardingStep3Data {
  sessionOptions: SessionOptionInput[];
  timezone: string;
  sessionPriceMillimes?: number;
  sessionDurationMinutes?: number;
}

export interface OnboardingStep4Data {
  payoutMethod: 'BANK_TRANSFER' | 'MOBILE_MONEY';
  bankTransferDetails?: {
    accountHolderName: string;
    bankName: string;
    iban: string;
  };
  mobileMoneyDetails?: {
    mobileProvider: string;
    mobilePhone: string;
  };
}

export interface OnboardingStatus {
  currentStep: number;
  completed: boolean;
  profileCompleteness?: number;
  profile?: {
    slug?: string;
    bio?: string;
    headline?: string;
    category?: string;
    tags?: string[];
    certifications?: { name: string; issuer: string; year: number }[];
    yearsOfExperience?: number;
    languages?: string[];
    sessionPriceMillimes?: number;
    sessionDurationMinutes?: number;
    timezone?: string;
    sessionOptions?: { id: string; durationMinutes: number; priceMillimes: number; label?: string; isActive: boolean; sortOrder: number }[];
    payoutMethod?: 'BANK_TRANSFER' | 'MOBILE_MONEY';
    payoutDetails?: Record<string, string>;
  };
}

export async function saveOnboardingStep1(data: OnboardingStep1Data): Promise<ApiResponse<OnboardingStatus>> {
  const res = await fetch(`${API_BASE}/experts/onboarding/step-1`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to save step 1' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function saveOnboardingStep2(data: OnboardingStep2Data): Promise<ApiResponse<OnboardingStatus>> {
  const res = await fetch(`${API_BASE}/experts/onboarding/step-2`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to save step 2' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function saveOnboardingStep3(data: OnboardingStep3Data): Promise<ApiResponse<OnboardingStatus>> {
  const res = await fetch(`${API_BASE}/experts/onboarding/step-3`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to save step 3' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function saveOnboardingStep4(data: OnboardingStep4Data): Promise<ApiResponse<OnboardingStatus>> {
  const res = await fetch(`${API_BASE}/experts/onboarding/step-4`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to save step 4' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function completeOnboarding(): Promise<ApiResponse<{ redirectUrl: string }>> {
  const res = await fetch(`${API_BASE}/experts/onboarding/complete`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to complete onboarding' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function getOnboardingStatus(): Promise<ApiResponse<OnboardingStatus>> {
  const res = await fetch(`${API_BASE}/experts/onboarding/status`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to get onboarding status' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ── Marketplace Search ── */

export async function searchExperts(
  params: MarketplaceSearchParams,
): Promise<PaginatedResponse<ExpertProfile>> {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.minPrice != null) query.set('minPrice', String(params.minPrice));
  if (params.maxPrice != null) query.set('maxPrice', String(params.maxPrice));
  if (params.page != null) query.set('page', String(params.page));
  if (params.limit != null) query.set('limit', String(params.limit));

  const res = await fetch(`${API_BASE}/marketplace?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }
  return res.json();
}

// --- Session Access ---

export interface SessionAccessResponse {
  allowed: boolean;
  reason?: 'TOO_EARLY' | 'EXPIRED' | 'NOT_FOUND' | 'FORBIDDEN';
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  expertName?: string;
  clientName?: string;
  minutesUntilStart?: number;
}

export async function checkSessionAccess(
  roomId: string,
  token: string,
): Promise<ApiResponse<SessionAccessResponse>> {
  const res = await fetch(`${API_BASE}/session/${roomId}/access`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }
  return res.json();
}
