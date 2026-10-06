import { Appointment, ClientRecord, ScheduleSettings, ServiceItem, TestimonialItem, GalleryItem } from './types';


// Asset paths from generation
export const ASSETS = {
  hero: `${import.meta.env.BASE_URL}hero_eyelash_model_1791255520464.jpg`,
  about: `${import.meta.env.BASE_URL}about_gab_santos_1791255531316.jpg`,
  russianVolume: `${import.meta.env.BASE_URL}service_russian_volume_1791255540362.jpg`,
  foxEyes: `${import.meta.env.BASE_URL}service_fox_eyes_1791255553605.jpg`,
  studio: `${import.meta.env.BASE_URL}studio_interior_1791255562551.jpg`,
};

const DEFAULT_SETTINGS: ScheduleSettings = {
  businessHoursStart: '09:00',
  businessHoursEnd: '19:00',
  slotIntervalMinutes: 30,
  lunchBreakStart: '12:00',
  lunchBreakEnd: '13:00',
  openDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  blockedDates: [],
  depositPercentage: 30, // 30% sinal
  requireFullPayment: false,
  cancellationHoursLimit: 24,
  studioAddress: 'Av. Nova Cantareira, 1850 - Santana',
  studioNeighborhood: 'Zona Norte',
  studioCity: 'São Paulo/SP',
  studioWhatsapp: '5511969530621',
  studioInstagram: '@gabstudio.lash',
  studioName: 'Gab Studio | Especialista em Cílios',
  designerName: 'Gab Santos',
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'fio-a-fio',
    name: 'Fio a Fio (Clássico)',
    category: 'Extensão',
    description: 'Aplicação de 1 fio sintético sobre cada fio natural. Proporciona efeito rímel, elegância e naturalidade impecável para o dia a dia.',
    durationMinutes: 105,
    price: 160,
    isAvailable: true,
    image: ASSETS.hero,
    badge: 'Mais Natural',
    maintenanceRecommendedDays: 20,
  },
  {
    id: 'volume-brasileiro',
    name: 'Volume Brasileiro',
    category: 'Extensão',
    description: 'Fios em formato de Y que conferem leveza e preenchimento marcante na medida certa, sem pesar nos fios naturais.',
    durationMinutes: 120,
    price: 180,
    isAvailable: true,
    image: ASSETS.russianVolume,
    badge: 'Queridinho',
    maintenanceRecommendedDays: 21,
  },
  {
    id: 'volume-russo',
    name: 'Volume Russo',
    category: 'Extensão',
    description: 'Fans artesanais ultrafinos aplicados manualmente. Densidade, curvatura marcante e acabamento aveludado e sofisticado.',
    durationMinutes: 135,
    price: 220,
    isAvailable: true,
    image: ASSETS.russianVolume,
    badge: 'Mais Desejado',
    maintenanceRecommendedDays: 21,
  },
  {
    id: 'fox-eyes',
    name: 'Fox Eyes (Efeito Foxy)',
    category: 'Mapeamento Exclusivo',
    description: 'Mapping alongado em direção ao canto externo dos olhos. Eleva o olhar e confere sensualidade com efeito lifting imediato.',
    durationMinutes: 120,
    price: 210,
    isAvailable: true,
    image: ASSETS.foxEyes,
    badge: 'Tendência',
    maintenanceRecommendedDays: 20,
  },
  {
    id: 'mega-volume',
    name: 'Mega Volume',
    category: 'Extensão',
    description: 'Densidade máxima com fios ultrafinos de 0.03mm. Para quem busca olhar dramático, volumoso e impactante com máxima segurança biológica.',
    durationMinutes: 150,
    price: 260,
    isAvailable: true,
    image: ASSETS.hero,
    badge: 'Impacto Máximo',
    maintenanceRecommendedDays: 18,
  },
  {
    id: 'volume-kim',
    name: 'Volume Kim (Efeito Molhado/Wispy)',
    category: 'Mapeamento Exclusivo',
    description: 'Picos de comprimento intercalados que recriam o visual texturizado e moderno consagrado por Kim Kardashian.',
    durationMinutes: 135,
    price: 230,
    isAvailable: true,
    image: ASSETS.foxEyes,
    badge: 'Exclusivo',
    maintenanceRecommendedDays: 20,
  },
  {
    id: 'manutencao',
    name: 'Manutenção Periódica',
    category: 'Manutenção',
    description: 'Remoção de fios crescidos e reposição de novos fios para manter a extensão sempre alinhada e impecável (até 21 dias).',
    durationMinutes: 75,
    price: 120,
    isAvailable: true,
    image: ASSETS.about,
    badge: 'Essencial',
    maintenanceRecommendedDays: 21,
  },
  {
    id: 'remocao',
    name: 'Remoção Segura',
    category: 'Cuidados',
    description: 'Procedimento profissional com removedor em creme hipoalergênico que preserva integralmente a saúde dos fios naturais.',
    durationMinutes: 45,
    price: 70,
    isAvailable: true,
    image: ASSETS.studio,
    maintenanceRecommendedDays: 0,
  },
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Volume Russo Impecável',
    style: 'Volume Russo',
    imageUrl: ASSETS.russianVolume,
    description: 'Fans artesanais 4D a 6D com acabamento aveludado e curvatura D.',
  },
  {
    id: 'g2',
    title: 'Fox Eyes Marcante',
    style: 'Fox Eyes',
    imageUrl: ASSETS.foxEyes,
    description: 'Alongamento estratégico na cauda dos olhos para elevação do olhar.',
  },
  {
    id: 'g3',
    title: 'Volume Brasileiro Radiante',
    style: 'Volume Brasileiro',
    imageUrl: ASSETS.hero,
    description: 'Fios tecnológicos em Y com leveza e retenção superior a 25 dias.',
  },
  {
    id: 'g4',
    title: 'Estúdio Acolhedor & Sofisticado',
    style: 'Estúdio',
    imageUrl: ASSETS.studio,
    description: 'Ambiente climatizado, manta macia e rigoroso padrão de biossegurança.',
  },
  {
    id: 'g5',
    title: 'Atendimento Personalizado',
    style: 'Visagismo',
    imageUrl: ASSETS.about,
    description: 'Análise morfológica de cada olhar antes de iniciar o mapeamento dos fios.',
  },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Camila Albuquerque',
    role: 'Cliente Fiel há 2 anos',
    service: 'Volume Russo',
    text: 'A Gab é simplesmente a melhor lash designer de São Paulo! Meus cílios duram mais de 3 semanas sem cair quase nada. O estúdio é lindo, cheiroso e relaxante. Não troco por nada!',
    stars: 5,
    date: 'Setembro 2026',
  },
  {
    id: 't2',
    name: 'Larissa Menezes',
    role: 'Cliente',
    service: 'Fox Eyes',
    text: 'Fiz o Fox Eyes para o meu casamento e recebi elogios a noite inteira. O olhar ficou levantado e natural ao mesmo tempo. A Gab tem mãos de fada, nem sinto quando ela está aplicando.',
    stars: 5,
    date: 'Agosto 2026',
  },
  {
    id: 't3',
    name: 'Beatriz Fonseca',
    role: 'Cliente',
    service: 'Volume Brasileiro',
    text: 'Eu tinha muito medo de ter alergia ou danificar meus cílios naturais, mas a Gab me explicou tudo com muita paciência e usou materiais hipoalergênicos de primeira. Retenção maravilhosa!',
    stars: 5,
    date: 'Setembro 2026',
  },
  {
    id: 't4',
    name: 'Juliana Prado',
    role: 'Cliente',
    service: 'Fio a Fio Clássico',
    text: 'A praticidade de agendar online e o atendimento impecável no estúdio fazem toda a diferença. Acordo pronta todos os dias!',
    stars: 5,
    date: 'Outubro 2026',
  },
];

// Seed sample initial appointments so the admin dashboard is immediately lively
function getInitialAppointments(): Appointment[] {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  return [
    {
      id: 'GAB-8491',
      serviceId: 'volume-russo',
      serviceName: 'Volume Russo',
      durationMinutes: 135,
      price: 220,
      depositAmount: 66,
      remainingAmount: 154,
      date: today,
      time: '10:00',
      clientName: 'Mariana Duarte',
      clientPhone: '(11) 98845-1234',
      clientNotes: 'Prefere curvatura D mais cheia. Primeira vez com a Gab.',
      allergies: 'Nenhuma alergia relatada.',
      status: 'confirmado',
      paymentStatus: 'pago',
      paymentMethod: 'pix',
      paymentReferenceId: 'PIX-9823412',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      cancellationToken: 'tok_md8491',
    },
    {
      id: 'GAB-8492',
      serviceId: 'fox-eyes',
      serviceName: 'Fox Eyes (Efeito Foxy)',
      durationMinutes: 120,
      price: 210,
      depositAmount: 63,
      remainingAmount: 147,
      date: today,
      time: '14:30',
      clientName: 'Carla Vasconcelos',
      clientPhone: '(11) 97123-9087',
      clientNotes: 'Formatos 8 a 13mm na ponta externa.',
      allergies: 'Sensibilidade moderada a luz forte.',
      status: 'confirmado',
      paymentStatus: 'pago',
      paymentMethod: 'cartao_credito',
      paymentReferenceId: 'MP-4829104',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      cancellationToken: 'tok_cv8492',
    },
    {
      id: 'GAB-8493',
      serviceId: 'volume-brasileiro',
      serviceName: 'Volume Brasileiro',
      durationMinutes: 120,
      price: 180,
      depositAmount: 54,
      remainingAmount: 126,
      date: tomorrow,
      time: '11:00',
      clientName: 'Tatiane Ribeiro',
      clientPhone: '(11) 99312-4455',
      clientNotes: 'Manutenção dos fios após viagem de praia.',
      allergies: '',
      status: 'confirmado',
      paymentStatus: 'pago',
      paymentMethod: 'pix',
      paymentReferenceId: 'PIX-1204859',
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      cancellationToken: 'tok_tr8493',
    },
  ];
}

// Storage Keys
const STORAGE_KEYS = {
  SETTINGS: 'gab_studio_settings_v1',
  SERVICES: 'gab_studio_services_v1',
  APPOINTMENTS: 'gab_studio_appointments_v1',
  CLIENTS: 'gab_studio_clients_v1',
  GALLERY: 'gab_studio_gallery_v1',
  TESTIMONIALS: 'gab_studio_testimonials_v1',
  AUTH: 'gab_studio_auth_v1',
};

// Dispatch storage change event for reactive UI
function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gab-studio-data-changed'));
  }
}

// Play notification chime for appointments
export function playAppointmentChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // First tone (pleasant gentle high bell)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Second harmonic chime
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.12); // E6
    gain2.gain.setValueAtTime(0.18, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.8);
  } catch {
    // Audio autoplay might be restricted before user gesture
  }
}

// SETTINGS
export function getSettings(): ScheduleSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<ScheduleSettings>): ScheduleSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  notifyChange();
  return updated;
}

// SERVICES
export function getServices(): ServiceItem[] {
  if (typeof window === 'undefined') return DEFAULT_SERVICES;
  const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    return DEFAULT_SERVICES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SERVICES;
  }
}

export function saveService(service: ServiceItem): void {
  const services = getServices();
  const index = services.findIndex(s => s.id === service.id);
  if (index >= 0) {
    services[index] = service;
  } else {
    services.push(service);
  }
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  notifyChange();
}

export function deleteService(serviceId: string): void {
  const services = getServices().filter(s => s.id !== serviceId);
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  notifyChange();
}

// APPOINTMENTS
export function getAppointments(): Appointment[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  if (!raw) {
    const initial = getInitialAppointments();
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getAppointmentById(id: string): Appointment | undefined {
  return getAppointments().find(a => a.id.toLowerCase() === id.toLowerCase() || a.cancellationToken === id);
}

export function createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'cancellationToken'>): Appointment {
  const appointments = getAppointments();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `GAB-${randomSuffix}`;
  const cancellationToken = `tok_${Math.random().toString(36).substring(2, 10)}`;

  const newAppointment: Appointment = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    cancellationToken,
  };

  appointments.unshift(newAppointment);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

  // Sync to Clients database
  recordClientVisit(newAppointment);

  // Play audio chime
  playAppointmentChime();
  notifyChange();

  return newAppointment;
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === id);
  if (index === -1) return null;

  appointments[index] = { ...appointments[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  notifyChange();
  return appointments[index];
}

export function cancelAppointment(id: string, reason?: string): boolean {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === id || a.cancellationToken === id);
  if (index === -1) return false;

  appointments[index] = {
    ...appointments[index],
    status: 'cancelado',
    manualPaymentNote: reason ? `Cancelado: ${reason}` : 'Cancelado pelo cliente ou estúdio',
  };
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  notifyChange();
  return true;
}

// CLIENT CRM
export function getClients(): ClientRecord[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function recordClientVisit(appointment: Appointment) {
  const clients = getClients();
  const cleanPhone = appointment.clientPhone.replace(/\D/g, '');
  const existingIndex = clients.findIndex(c => c.phone.replace(/\D/g, '') === cleanPhone);

  if (existingIndex >= 0) {
    const client = clients[existingIndex];
    client.totalAppointments += 1;
    client.totalSpent += appointment.price;
    client.lastVisitDate = appointment.date;
    client.lastService = appointment.serviceName;
    if (appointment.allergies) client.allergies = appointment.allergies;
    if (appointment.clientNotes) client.notes = `${client.notes ? client.notes + ' | ' : ''}${appointment.clientNotes}`;
    clients[existingIndex] = client;
  } else {
    clients.push({
      id: `cli_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: appointment.clientName,
      phone: appointment.clientPhone,
      totalAppointments: 1,
      totalSpent: appointment.price,
      lastVisitDate: appointment.date,
      lastService: appointment.serviceName,
      allergies: appointment.allergies,
      notes: appointment.clientNotes,
      createdAt: new Date().toISOString(),
    });
  }
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

// TESTIMONIALS & GALLERY
export function getTestimonials(): TestimonialItem[] {
  if (typeof window === 'undefined') return DEFAULT_TESTIMONIALS;
  const raw = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
    return DEFAULT_TESTIMONIALS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

export function getGallery(): GalleryItem[] {
  if (typeof window === 'undefined') return DEFAULT_GALLERY;
  const raw = localStorage.getItem(STORAGE_KEYS.GALLERY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
    return DEFAULT_GALLERY;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_GALLERY;
  }
}

// FINANCIAL SUMMARY
export function getFinancialMetrics() {
  const appointments = getAppointments();
  const today = new Date().toISOString().split('T')[0];
  
  // Start of week (Sunday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeekDate = new Date(now);
  startOfWeekDate.setDate(now.getDate() - dayOfWeek);
  const startOfWeek = startOfWeekDate.toISOString().split('T')[0];

  // Current Month prefix (YYYY-MM)
  const currentMonth = today.substring(0, 7);

  let revenueToday = 0;
  let revenueWeek = 0;
  let revenueMonth = 0;
  let appointmentsToday = 0;
  let appointmentsWeek = 0;

  appointments.forEach(apt => {
    if (apt.status === 'cancelado') return;

    const aptAmount = apt.paymentStatus === 'pago' ? apt.price : apt.depositAmount;

    // Today
    if (apt.date === today) {
      appointmentsToday++;
      if (apt.paymentStatus === 'pago') {
        revenueToday += apt.price;
      } else {
        revenueToday += apt.depositAmount;
      }
    }

    // Week
    if (apt.date >= startOfWeek && apt.date <= today) {
      appointmentsWeek++;
      revenueWeek += aptAmount;
    }

    // Month
    if (apt.date.startsWith(currentMonth)) {
      revenueMonth += aptAmount;
    }
  });

  return {
    revenueToday,
    revenueWeek,
    revenueMonth,
    appointmentsToday,
    appointmentsWeek,
    totalAppointments: appointments.length,
  };
}

// TIME CONVERSION HELPERS
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// CHECK IF DATE IS BLOCKED OR CLOSED
export function isDateAvailable(dateStr: string): boolean {
  const settings = getSettings();
  if (settings.blockedDates.includes(dateStr)) return false;

  // Check day of week (parse as UTC or local to avoid timezone offset glitch)
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const dayOfWeek = targetDate.getDay();

  return settings.openDays.includes(dayOfWeek);
}

// SLOTS GENERATOR
export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  reason?: string;
}

export function getAvailableSlots(dateStr: string, serviceDurationMinutes: number): TimeSlot[] {
  const settings = getSettings();
  
  if (!isDateAvailable(dateStr)) {
    return [];
  }

  const startMinutes = timeToMinutes(settings.businessHoursStart);
  const endMinutes = timeToMinutes(settings.businessHoursEnd);
  const lunchStart = timeToMinutes(settings.lunchBreakStart);
  const lunchEnd = timeToMinutes(settings.lunchBreakEnd);
  const interval = settings.slotIntervalMinutes || 30;

  // Active bookings on this date
  const appointmentsOnDate = getAppointments().filter(
    a => a.date === dateStr && a.status !== 'cancelado'
  );

  const now = new Date();
  const isToday = now.toISOString().split('T')[0] === dateStr;
  const currentMinutesToday = now.getHours() * 60 + now.getMinutes() + 15; // 15 min buffer

  const slots: TimeSlot[] = [];

  for (let m = startMinutes; m + serviceDurationMinutes <= endMinutes; m += interval) {
    const slotTimeStr = minutesToTime(m);
    const slotEndTime = m + serviceDurationMinutes;

    // Past time check
    if (isToday && m < currentMinutesToday) {
      continue;
    }

    // Lunch break overlap check
    const overlapsLunch = (m < lunchEnd && slotEndTime > lunchStart);
    if (overlapsLunch) {
      continue;
    }

    // Appointment overlap check
    let hasConflict = false;
    for (const apt of appointmentsOnDate) {
      const aptStart = timeToMinutes(apt.time);
      const aptEnd = aptStart + apt.durationMinutes;

      // Overlap condition: start < aptEnd && end > aptStart
      if (m < aptEnd && slotEndTime > aptStart) {
        hasConflict = true;
        break;
      }
    }

    if (!hasConflict) {
      slots.push({
        time: slotTimeStr,
        isAvailable: true,
      });
    }
  }

  return slots;
}
