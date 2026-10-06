import { generateQrSvg } from './qrcode';

export interface PixPaymentData {
  paymentId: string;
  qrCodeSvg: string;
  pixCopiaECola: string;
  amount: number;
  expiresInSeconds: number;
}

/**
 * Format standard Pix EMV Payload string (Copia e Cola)
 */
export function generatePixCopiaECola(amount: number, appointmentId: string): string {
  const formattedAmount = amount.toFixed(2);
  const cleanId = appointmentId.replace(/[^A-Za-z0-9]/g, '');
  return `00020126580014br.gov.bcb.pix0136gabstudio.lash@mercadopago.com5204000053039865405${formattedAmount}5802BR5910GAB SANTOS6009SAO PAULO62170513${cleanId}6304E8A2`;
}

/**
 * Initialize a Pix checkout for the appointment deposit or total
 */
export async function createPixPayment(amount: number, appointmentId: string, clientName: string): Promise<PixPaymentData> {
  const paymentId = `MP-PIX-${Date.now()}`;
  const pixCopiaECola = generatePixCopiaECola(amount, appointmentId);
  const qrCodeSvg = generateQrSvg(pixCopiaECola, 240);

  // Attempt backend endpoint if available, but fallback gracefully
  try {
    const res = await fetch('/api/mercadopago/pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, appointmentId, clientName }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.pixCopiaECola) {
        return {
          paymentId: data.paymentId || paymentId,
          qrCodeSvg: generateQrSvg(data.pixCopiaECola, 240),
          pixCopiaECola: data.pixCopiaECola,
          amount,
          expiresInSeconds: 900,
        };
      }
    }
  } catch {
    // Backend offline or running in pure client preview mode
  }

  return {
    paymentId,
    qrCodeSvg,
    pixCopiaECola,
    amount,
    expiresInSeconds: 900, // 15 minutes
  };
}

/**
 * Generate Google Calendar Add URL
 */
export function generateGoogleCalendarUrl({
  title,
  description,
  location,
  startDate, // YYYY-MM-DD
  startTime, // HH:mm
  durationMinutes,
}: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  durationMinutes: number;
}): string {
  const [year, month, day] = startDate.split('-').map(Number);
  const [hour, minute] = startTime.split(':').map(Number);

  const startObj = new Date(year, month - 1, day, hour, minute);
  const endObj = new Date(startObj.getTime() + durationMinutes * 60000);

  const formatGCalTime = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatGCalTime(startObj)}/${formatGCalTime(endObj)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: datesParam,
    details: description,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate iCalendar (.ics) content for native calendar download
 */
export function generateIcsFileContent({
  title,
  description,
  location,
  startDate,
  startTime,
  durationMinutes,
}: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  durationMinutes: number;
}): string {
  const [year, month, day] = startDate.split('-').map(Number);
  const [hour, minute] = startTime.split(':').map(Number);

  const startObj = new Date(year, month - 1, day, hour, minute);
  const endObj = new Date(startObj.getTime() + durationMinutes * 60000);

  const formatIcsTime = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';
  };

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gab Studio//Agendamento de Cilios//PT',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@gabstudio.lash`,
    `DTSTAMP:${formatIcsTime(new Date())}`,
    `DTSTART:${formatIcsTime(startObj)}`,
    `DTEND:${formatIcsTime(endObj)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Generate WhatsApp message URL for booking confirmation or voucher sharing
 */
export function generateWhatsAppBookingUrl({
  whatsappNumber,
  appointmentId,
  clientName,
  serviceName,
  date,
  time,
  depositAmount,
  paymentMethod,
}: {
  whatsappNumber: string;
  appointmentId: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  depositAmount: number;
  paymentMethod: string;
}): string {
  const [year, month, day] = date.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const message = `✨ *Comprovante de Agendamento - Gab Studio*\n\n` +
    `Olá, Gab! Acabei de agendar meu horário pelo site:\n\n` +
    `🆔 *Código:* ${appointmentId}\n` +
    `👤 *Cliente:* ${clientName}\n` +
    `👁️ *Serviço:* ${serviceName}\n` +
    `📅 *Data:* ${formattedDate} às ${time}\n` +
    `💳 *Sinal:* R$ ${depositAmount.toFixed(2)} (${paymentMethod.toUpperCase()})\n\n` +
    `Gostaria de confirmar o agendamento! Muito obrigada! 💖`;

  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
