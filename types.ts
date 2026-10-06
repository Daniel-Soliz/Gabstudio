export type AppointmentStatus = 'pendente' | 'confirmado' | 'cancelado' | 'concluido' | string;
export type PaymentStatus = 'pendente' | 'pago' | 'falhou' | 'reembolsado' | string;
export type PaymentMethod = 'pix' | 'cartao_credito' | 'dinheiro' | string;

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  price: number;
  isAvailable: boolean;
  image?: string;
  badge?: string;
  maintenanceRecommendedDays?: number;
  [key: string]: unknown;
}

export interface ScheduleSettings {
  businessHoursStart: string;
  businessHoursEnd: string;
  slotIntervalMinutes: number;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  openDays: number[];
  blockedDates: string[];
  depositPercentage: number;
  requireFullPayment: boolean;
  cancellationHoursLimit: number;
  studioAddress: string;
  studioNeighborhood: string;
  studioCity: string;
  studioWhatsapp: string;
  studioInstagram: string;
  studioName: string;
  designerName: string;
  [key: string]: unknown;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  depositAmount: number;
  remainingAmount: number;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
  allergies?: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentReferenceId?: string;
  createdAt: string;
  cancellationToken: string;
  manualPaymentNote?: string;
  [key: string]: unknown;
}

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  totalAppointments: number;
  totalSpent: number;
  lastVisitDate: string;
  lastService: string;
  allergies?: string;
  notes?: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  service: string;
  text: string;
  stars: number;
  date: string;
  [key: string]: unknown;
}

export interface GalleryItem {
  id: string;
  title: string;
  style: string;
  imageUrl: string;
  description: string;
  [key: string]: unknown;
}
