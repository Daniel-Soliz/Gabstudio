export type AppointmentStatus = 
  | 'confirmado' 
  | 'pendente_pagamento' 
  | 'concluido' 
  | 'cancelado' 
  | 'faltou';

export type PaymentStatus = 
  | 'pago' 
  | 'pendente' 
  | 'reembolsado' 
  | 'cancelado';

export type PaymentMethod = 
  | 'pix' 
  | 'cartao_credito' 
  | 'cartao_debito' 
  | 'dinheiro';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  price: number;
  isAvailable: boolean;
  image: string;
  badge?: string;
  maintenanceRecommendedDays?: number;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  depositAmount: number;
  remainingAmount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
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
  expiresAt?: string;
  manualPaymentNote?: string;
}

export interface ScheduleSettings {
  businessHoursStart: string; // '09:00'
  businessHoursEnd: string; // '19:00'
  slotIntervalMinutes: number; // 30
  lunchBreakStart: string; // '12:00'
  lunchBreakEnd: string; // '13:00'
  openDays: number[]; // [1, 2, 3, 4, 5, 6] (0 = Sunday, 1 = Monday, ...)
  blockedDates: string[]; // ['2026-12-25']
  depositPercentage: number; // 30 (percent)
  requireFullPayment: boolean; // false
  cancellationHoursLimit: number; // 24
  studioAddress: string;
  studioNeighborhood: string;
  studioCity: string;
  studioWhatsapp: string; // '5511969530621'
  studioInstagram: string; // '@gabstudio.lash'
  studioName: string;
  designerName: string;
  mercadoPagoPublicKey?: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  totalAppointments: number;
  totalSpent: number;
  lastVisitDate?: string;
  lastService?: string;
  preferredStyle?: string;
  allergies?: string;
  notes?: string;
  createdAt: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  service: string;
  text: string;
  stars: number;
  date: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  style: string;
  imageUrl: string;
  description: string;
}
