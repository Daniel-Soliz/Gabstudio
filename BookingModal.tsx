import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, ChevronRight, ChevronLeft, Check, 
  Copy, ShieldCheck, Sparkles, MessageCircle, Download, ExternalLink,
  CreditCard, QrCode, AlertCircle, Info, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getServices, getSettings, getAvailableSlots, createAppointment, 
  TimeSlot, isDateAvailable 
} from './storage';
import { 
  createPixPayment, generateGoogleCalendarUrl, 
  generateIcsFileContent, generateWhatsAppBookingUrl, PixPaymentData 
} from './mercadopago';
import { ServiceItem, ScheduleSettings, Appointment, PaymentMethod } from './types';
import { LashIcon, VintageFlourish } from './DecorativeOrnament';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  preselectedServiceId 
}) => {
  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<ScheduleSettings>(getSettings());

  // Form State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [allergies, setAllergies] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [payFullAmount, setPayFullAmount] = useState<boolean>(false);

  // Computed & Slot state
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Payment & Result state
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [pixTimeRemaining, setPixTimeRemaining] = useState<number>(900); // 15 mins
  const [copiedPix, setCopiedPix] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      const allServices = getServices();
      const currentSettings = getSettings();
      setServices(allServices);
      setSettings(currentSettings);

      // If preselected, select it
      if (preselectedServiceId) {
        const found = allServices.find(s => s.id === preselectedServiceId);
        if (found) {
          setSelectedService(found);
          setStep(2);
        }
      } else {
        setStep(1);
      }

      // Default tomorrow if not set
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      setSelectedDate(tomorrow);
    } else {
      // Reset state when closed
      setConfirmedAppointment(null);
      setPixData(null);
      setErrors({});
    }
  }, [isOpen, preselectedServiceId]);

  // Load available slots whenever selectedDate or selectedService changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      setLoadingSlots(true);
      const slots = getAvailableSlots(selectedDate, selectedService.durationMinutes);
      setAvailableSlots(slots);
      setLoadingSlots(false);
      // Reset time if no longer valid
      if (!slots.some(s => s.time === selectedTime)) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, selectedService]);

  // Pix countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && pixData && pixTimeRemaining > 0 && !confirmedAppointment) {
      timer = setInterval(() => {
        setPixTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, pixData, pixTimeRemaining, confirmedAppointment]);

  if (!isOpen) return null;

  // Format phone mask (11) 99999-9999
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }
    setClientPhone(formatted);
  };

  // Helper calculation for prices
  const totalPrice = selectedService?.price || 0;
  const depositPercent = settings.depositPercentage || 30;
  const depositAmount = payFullAmount ? totalPrice : Math.round((totalPrice * depositPercent) / 100);
  const remainingAmount = totalPrice - depositAmount;

  // Step 1: Select Service Next
  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setStep(2);
  };

  // Step 2: Date & Time validation
  const handleValidateDateTime = () => {
    const errs: { [key: string]: string } = {};
    if (!selectedDate) errs.date = 'Selecione uma data para o agendamento';
    if (!selectedTime) errs.time = 'Selecione um horário disponível';
    if (!isDateAvailable(selectedDate)) errs.date = 'O estúdio não abre nesta data';

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(3);
    }
  };

  // Step 3: Client Details validation
  const handleValidateClient = async () => {
    const errs: { [key: string]: string } = {};
    if (!clientName.trim() || clientName.trim().length < 3) {
      errs.name = 'Informe seu nome completo';
    }
    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errs.phone = 'Informe um WhatsApp válido com DDD';
    }

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Generate Pix payload if method is Pix
      if (paymentMethod === 'pix') {
        const dummyId = `GAB-TEMP-${Date.now()}`;
        const data = await createPixPayment(depositAmount, dummyId, clientName);
        setPixData(data);
        setPixTimeRemaining(900);
      }
      setStep(4);
    }
  };

  // Step 4: Finalize & Confirm Booking
  const handleCompleteBooking = async (simulateApproved = true) => {
    if (!selectedService) return;
    setIsProcessingPayment(true);

    try {
      const apt = createAppointment({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        durationMinutes: selectedService.durationMinutes,
        price: totalPrice,
        depositAmount,
        remainingAmount,
        date: selectedDate,
        time: selectedTime,
        clientName: clientName.trim(),
        clientPhone,
        clientNotes,
        allergies,
        status: 'confirmado',
        paymentStatus: simulateApproved ? 'pago' : 'pendente',
        paymentMethod,
        paymentReferenceId: pixData?.paymentId || `MP-${Date.now()}`,
      });

      setConfirmedAppointment(apt);
      setStep(5);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF2FA0', '#FF8AD8', '#E6C280', '#FFFFFF'],
        });
      } catch {
        // Safe fallback
      }
    } catch {
      alert('Erro ao processar o agendamento. Tente novamente.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Copy Pix Payload
  const handleCopyPix = () => {
    if (!pixData) return;
    navigator.clipboard.writeText(pixData.pixCopiaECola);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  // Download .ics
  const handleDownloadIcs = () => {
    if (!confirmedAppointment) return;
    const content = generateIcsFileContent({
      title: `Extensão de Cílios (${confirmedAppointment.serviceName}) - Gab Studio`,
      description: `Agendamento com Gab Santos. Código: ${confirmedAppointment.id}. Endereço: ${settings.studioAddress}`,
      location: `${settings.studioAddress}, ${settings.studioNeighborhood}, ${settings.studioCity}`,
      startDate: confirmedAppointment.date,
      startTime: confirmedAppointment.time,
      durationMinutes: confirmedAppointment.durationMinutes,
    });

    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agendamento-gab-studio-${confirmedAppointment.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [dateY, dateM, dateD] = selectedDate.split('-');
  const formattedSelectedDate = selectedDate ? `${dateD}/${dateM}/${dateY}` : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-2xl bg-[#140810] border border-[#FF2FA0]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-[#1A0A12] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LashIcon className="w-5 h-5 text-[#FF8AD8]" />
            <h3 className="font-display text-lg sm:text-xl text-white font-medium">
              Agendamento Online · <span className="font-script text-xl text-[#FF8AD8]">Gab Studio</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Fechar janela"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicator (if not on success screen) */}
        {step < 5 && (
          <div className="px-6 py-3 bg-[#0D0509] border-b border-stone-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${step >= 1 ? 'bg-[#FF2FA0] text-white' : 'bg-stone-800 text-stone-400'}`}>
                1
              </span>
              <span className={`hidden sm:inline ${step >= 1 ? 'text-white' : 'text-stone-500'}`}>Serviço</span>
            </div>
            <div className="h-0.5 w-6 bg-stone-800" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${step >= 2 ? 'bg-[#FF2FA0] text-white' : 'bg-stone-800 text-stone-400'}`}>
                2
              </span>
              <span className={`hidden sm:inline ${step >= 2 ? 'text-white' : 'text-stone-500'}`}>Data & Hora</span>
            </div>
            <div className="h-0.5 w-6 bg-stone-800" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${step >= 3 ? 'bg-[#FF2FA0] text-white' : 'bg-stone-800 text-stone-400'}`}>
                3
              </span>
              <span className={`hidden sm:inline ${step >= 3 ? 'text-white' : 'text-stone-500'}`}>Seus Dados</span>
            </div>
            <div className="h-0.5 w-6 bg-stone-800" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${step >= 4 ? 'bg-[#FF2FA0] text-white' : 'bg-stone-800 text-stone-400'}`}>
                4
              </span>
              <span className={`hidden sm:inline ${step >= 4 ? 'text-white' : 'text-stone-500'}`}>Sinal & Pagamento</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: CHOOSE SERVICE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <h4 className="font-display text-lg text-white font-medium">
                  Selecione o Procedimento Desejado
                </h4>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Cada técnica possui tempo de aplicação e cuidados específicos.
                </p>
              </div>

              <div className="space-y-3">
                {services.filter(s => s.isAvailable).map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleSelectService(service)}
                    className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800 hover:border-[#FF2FA0] cursor-pointer transition-all hover:bg-[#200D17] flex items-center justify-between gap-4 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-display text-white text-base font-medium group-hover:text-[#FF8AD8] transition-colors">
                          {service.name}
                        </h5>
                        {service.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF2FA0]/20 text-[#FF8AD8] border border-[#FF2FA0]/30 font-medium">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 font-light mt-1 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
                        <span className="flex items-center gap-1 text-[#E6C280]">
                          <Clock className="w-3.5 h-3.5 text-[#FF2FA0]" />
                          <span>{service.durationMinutes} min</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display text-lg text-white font-semibold tabular-nums block">
                        R$ {service.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[11px] text-[#FF8AD8] group-hover:underline inline-flex items-center gap-1 mt-1">
                        <span>Escolher</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE DATE & TIME */}
          {step === 2 && selectedService && (
            <div className="space-y-6">
              {/* Selected service pill */}
              <div className="p-3.5 rounded-xl bg-[#1A0A12] border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Procedimento Escolhido</span>
                  <span className="font-display text-white text-sm font-medium">{selectedService.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#E6C280] block font-light">{selectedService.durationMinutes} min</span>
                  <span className="text-sm font-semibold text-white">R$ {selectedService.price.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                  Escolha o Dia do Atendimento
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#1A0A12] border border-stone-800 focus:border-[#FF2FA0] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
                {errors.date && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.date}</span>
                  </p>
                )}
                {!isDateAvailable(selectedDate) && selectedDate && (
                  <p className="text-xs text-amber-400 mt-1">
                    * O estúdio não atende aos domingos ou nesta data selecionada. Escolha outro dia.
                  </p>
                )}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                    Horários Disponíveis ({selectedService.durationMinutes} min de atendimento)
                  </label>
                  <span className="text-[11px] text-stone-400">Sem choque de horários</span>
                </div>

                {loadingSlots ? (
                  <div className="py-8 text-center text-stone-400 text-xs">
                    Verificando disponibilidade na agenda...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-6 rounded-xl bg-stone-900/60 border border-stone-800 text-center space-y-1">
                    <p className="text-sm text-stone-300 font-medium">Nenhum horário livre nesta data</p>
                    <p className="text-xs text-stone-400 font-light">
                      Todos os horários foram preenchidos ou o dia está fora do expediente. Por favor, escolha outra data.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium tabular-nums transition-all border ${
                          selectedTime === slot.time
                            ? 'bg-[#FF2FA0] text-white border-[#FF2FA0] shadow-md shadow-[#FF2FA0]/30 font-semibold'
                            : 'bg-[#1A0A12] text-stone-300 border-stone-800 hover:border-[#FF2FA0]/50 hover:text-white'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
                {errors.time && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.time}</span>
                  </p>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl border border-stone-800 text-stone-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trocar Serviço</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedTime}
                  onClick={handleValidateDateTime}
                  className="neon-button px-6 py-2.5 rounded-full text-white text-xs sm:text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Continuar</span>
                  <ChevronRight className="w-4 h-4 text-[#FF8AD8]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CLIENT DETAILS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-display text-lg text-white font-medium">
                  Seus Dados para Contato
                </h4>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Seu WhatsApp é fundamental para o envio do lembrete e confirmação de presença.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mariana Albuquerque"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#1A0A12] border border-stone-800 focus:border-[#FF2FA0] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors"
                />
                {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                  WhatsApp com DDD *
                </label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={clientPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full bg-[#1A0A12] border border-stone-800 focus:border-[#FF2FA0] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors"
                />
                {errors.phone && <p className="text-xs text-rose-400">{errors.phone}</p>}
              </div>

              {/* Allergies & Preferences */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                  Possui alguma alergia ou sensibilidade nos olhos? (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Nenhuma / Olhos ressecam com facilidade"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full bg-[#1A0A12] border border-stone-800 focus:border-[#FF2FA0] rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                  Observações ou Estilo de Preferência (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gosto de efeito mais volumoso / curvatura D / primeira vez fazendo extensão"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full bg-[#1A0A12] border border-stone-800 focus:border-[#FF2FA0] rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl border border-stone-800 text-stone-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="button"
                  onClick={handleValidateClient}
                  className="neon-button px-6 py-2.5 rounded-full text-white text-xs sm:text-sm font-medium flex items-center gap-2"
                >
                  <span>Ir para o Pagamento</span>
                  <ChevronRight className="w-4 h-4 text-[#FF8AD8]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT & SINAL (MERCADO PAGO / PIX) */}
          {step === 4 && selectedService && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg text-white font-medium">
                  Resumo & Garantia da Vaga (Sinal)
                </h4>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Para reservar seu horário na agenda da Gab, cobramos um sinal que é abatido do valor final.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800 space-y-3">
                <div className="flex justify-between items-center text-xs text-stone-300">
                  <span className="text-stone-400">Procedimento:</span>
                  <span className="font-medium text-white">{selectedService.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-stone-300">
                  <span className="text-stone-400">Data e Hora:</span>
                  <span className="font-medium text-white">{formattedSelectedDate} às {selectedTime}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-stone-300">
                  <span className="text-stone-400">Cliente:</span>
                  <span className="font-medium text-white">{clientName} ({clientPhone})</span>
                </div>
                <div className="border-t border-stone-800 pt-2 flex justify-between items-center text-xs text-stone-300">
                  <span className="text-stone-400">Valor Total do Procedimento:</span>
                  <span className="text-white font-semibold tabular-nums">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Deposit toggle */}
              <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-white font-medium block">
                    Pagar Valor Total Agora?
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Padrão: Sinal de {depositPercent}% (R$ {Math.round((totalPrice * depositPercent) / 100).toFixed(2).replace('.', ',')}) e o restante no dia
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPayFullAmount(!payFullAmount)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    payFullAmount ? 'bg-[#FF2FA0]' : 'bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      payFullAmount ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Amount to pay now highlight */}
              <div className="p-4 rounded-xl bg-[#1A0A12] border border-[#FF2FA0]/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#FF8AD8] block font-semibold">
                    {payFullAmount ? 'Valor Total a Pagar Agora' : `Sinal de ${depositPercent}% a Pagar Agora`}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {!payFullAmount ? `Restante de R$ ${remainingAmount.toFixed(2).replace('.', ',')} no estúdio (dinheiro, Pix ou cartão)` : 'Sem pendências no estúdio'}
                  </span>
                </div>
                <span className="font-display text-2xl text-white font-bold tabular-nums">
                  R$ {depositAmount.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                  Forma de Pagamento (Mercado Pago)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 transition-all text-xs font-medium ${
                      paymentMethod === 'pix'
                        ? 'bg-[#FF2FA0]/15 border-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                        : 'bg-[#1A0A12] border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-[#FF2FA0]" />
                    <span>Pix Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cartao_credito')}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 transition-all text-xs font-medium ${
                      paymentMethod === 'cartao_credito'
                        ? 'bg-[#FF2FA0]/15 border-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                        : 'bg-[#1A0A12] border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#FF2FA0]" />
                    <span>Cartão de Crédito</span>
                  </button>
                </div>
              </div>

              {/* Pix Display Area */}
              {paymentMethod === 'pix' && pixData && (
                <div className="p-5 rounded-2xl bg-[#0D0509] border border-stone-800 space-y-4 text-center">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FF2FA0]" />
                      <span>Expira em: <strong className="text-white tabular-nums">{formatTimer(pixTimeRemaining)}</strong></span>
                    </span>
                    <span className="text-[11px] text-stone-400">Liberação automática após 15 min</span>
                  </div>

                  {/* QR Code SVG */}
                  <div 
                    className="flex justify-center my-2"
                    dangerouslySetInnerHTML={{ __html: pixData.qrCodeSvg }}
                  />

                  {/* Pix Copia e Cola */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      Código Pix Copia e Cola
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixData.pixCopiaECola}
                        className="flex-1 bg-[#1A0A12] border border-stone-800 rounded-lg px-3 py-2 text-[11px] font-mono text-stone-300 focus:outline-none truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="px-3 py-2 rounded-lg bg-[#FF2FA0] hover:bg-[#FF8AD8] text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-400 italic">
                    Abra o app do seu banco, escolha a opção "Pix Copia e Cola" ou aponte a câmera para o QR Code acima.
                  </p>
                </div>
              )}

              {/* Credit Card Simulation */}
              {paymentMethod === 'cartao_credito' && (
                <div className="p-4 rounded-2xl bg-[#0D0509] border border-stone-800 text-xs text-stone-300 space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                    <span>Checkout Seguro Mercado Pago</span>
                  </div>
                  <p className="text-stone-400 text-xs font-light">
                    Ao clicar em confirmar, o sinal será processado de forma criptografada.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl border border-stone-800 text-stone-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => handleCompleteBooking(true)}
                  className="neon-button px-6 py-3 rounded-full text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-lg shadow-[#FF2FA0]/20 disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FF8AD8]" />
                  <span>
                    {isProcessingPayment 
                      ? 'Confirmando reserva...' 
                      : `Confirmar Agendamento (R$ ${depositAmount.toFixed(2).replace('.', ',')})`
                    }
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION VOUCHER */}
          {step === 5 && confirmedAppointment && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center mx-auto shadow-xl shadow-[#25D366]/10">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#FF8AD8] font-medium block">
                  Reserva Confirmada com Sucesso!
                </span>
                <h4 className="font-display text-2xl sm:text-3xl text-white font-normal mt-1">
                  Seu Olhar Está em Boas Mãos
                </h4>
                <p className="text-xs text-stone-300 font-light max-w-md mx-auto mt-1">
                  Enviamos as instruções e reservamos sua vaga com a Gab Santos.
                </p>
              </div>

              {/* Voucher Ticket Card */}
              <div className="bg-[#1A0A12] rounded-3xl border border-[#FF2FA0]/40 p-5 text-left space-y-3 shadow-xl">
                <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 block">Código da Reserva</span>
                    <span className="font-mono text-base text-[#FF8AD8] font-bold">
                      {confirmedAppointment.id}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-medium">
                    Sinal Confirmado
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block">Procedimento:</span>
                    <strong className="text-white font-medium">{confirmedAppointment.serviceName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Data & Horário:</span>
                    <strong className="text-white font-medium">{formattedSelectedDate} às {confirmedAppointment.time}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Cliente:</span>
                    <strong className="text-white font-medium">{confirmedAppointment.clientName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Sinal Pago:</span>
                    <strong className="text-[#FF8AD8] font-medium">
                      R$ {confirmedAppointment.depositAmount.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-stone-800/80">
                    <span className="text-stone-400 block">Restante no estúdio:</span>
                    <strong className="text-white font-medium">
                      R$ {confirmedAppointment.remainingAmount.toFixed(2).replace('.', ',')} (dinheiro, Pix ou cartão no local)
                    </strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 block">Endereço do Estúdio:</span>
                    <p className="text-stone-200 text-xs">
                      {settings.studioAddress} · {settings.studioNeighborhood}, {settings.studioCity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Google Calendar, WhatsApp, ICS */}
              <div className="space-y-3 pt-2">
                {/* Send Voucher to Gab on WhatsApp */}
                <a
                  href={generateWhatsAppBookingUrl({
                    whatsappNumber: settings.studioWhatsapp,
                    appointmentId: confirmedAppointment.id,
                    clientName: confirmedAppointment.clientName,
                    serviceName: confirmedAppointment.serviceName,
                    date: confirmedAppointment.date,
                    time: confirmedAppointment.time,
                    depositAmount: confirmedAppointment.depositAmount,
                    paymentMethod: confirmedAppointment.paymentMethod,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 shadow-lg transition-transform hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Enviar Comprovante à Gab no WhatsApp</span>
                </a>

                {/* Add to Google Calendar */}
                <a
                  href={generateGoogleCalendarUrl({
                    title: `Extensão de Cílios (${confirmedAppointment.serviceName}) - Gab Studio`,
                    description: `Agendamento com Gab Santos. Código: ${confirmedAppointment.id}. Endereço: ${settings.studioAddress}`,
                    location: `${settings.studioAddress}, ${settings.studioNeighborhood}, ${settings.studioCity}`,
                    startDate: confirmedAppointment.date,
                    startTime: confirmedAppointment.time,
                    durationMinutes: confirmedAppointment.durationMinutes,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-white text-xs sm:text-sm font-light flex items-center justify-center gap-2 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#FF2FA0]" />
                  <span>Adicionar ao Google Agenda</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                {/* Download .ICS file */}
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="w-full py-2.5 px-4 rounded-full bg-stone-900/60 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF8AD8]" />
                  <span>Baixar Arquivo para Calendário Apple / Outlook (.ics)</span>
                </button>
              </div>

              {/* Cancellation policy note */}
              <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-800 text-[11px] text-stone-400 text-left">
                <Info className="w-3.5 h-3.5 text-[#FF2FA0] inline mr-1" />
                <span>
                  <strong>Política de Cancelamento:</strong> Cancelamentos ou reagendamentos podem ser realizados até {settings.cancellationHoursLimit} horas antes do horário pelo site com seu código <strong>{confirmedAppointment.id}</strong> ou diretamente com a Gab.
                </span>
              </div>

              {/* Finish Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-full border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white text-xs transition-colors"
              >
                Concluir e Fechar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
