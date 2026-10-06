import React, { useState } from 'react';
import { X, Search, Calendar, Clock, AlertCircle, CheckCircle, MessageCircle, Ban } from 'lucide-react';
import { getAppointments, cancelAppointment, getSettings } from './storage';
import { Appointment } from './types';
import { LashIcon } from './DecorativeOrnament';

interface AppointmentLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentLookupModal: React.FC<AppointmentLookupModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundAppointment, setFoundAppointment] = useState<Appointment | null>(null);
  const [searched, setSearched] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim().toLowerCase();
    const cleanNumbers = term.replace(/\D/g, '');

    const appointments = getAppointments();
    const found = appointments.find((apt) => {
      if (apt.id.toLowerCase() === term || apt.cancellationToken.toLowerCase() === term) return true;
      if (cleanNumbers.length >= 8 && apt.clientPhone.replace(/\D/g, '').includes(cleanNumbers)) return true;
      return false;
    });

    setFoundAppointment(found || null);
    setSearched(true);
    setCancelFeedback(null);
  };

  const handleCancel = () => {
    if (!foundAppointment) return;

    const settings = getSettings();
    const [year, month, day] = foundAppointment.date.split('-').map(Number);
    const [hour, minute] = foundAppointment.time.split(':').map(Number);
    const aptTime = new Date(year, month - 1, day, hour, minute).getTime();
    const now = Date.now();
    const hoursDifference = (aptTime - now) / (1000 * 60 * 60);

    if (hoursDifference < settings.cancellationHoursLimit) {
      alert(
        `O cancelamento online é permitido até ${settings.cancellationHoursLimit} horas antes do horário marcado. Como faltam menos de ${Math.max(
          1,
          Math.round(hoursDifference)
        )} horas, entre em contato diretamente com a Gab no WhatsApp para avaliar a remarcação.`
      );
      return;
    }

    if (confirm('Tem certeza de que deseja cancelar este agendamento?')) {
      const ok = cancelAppointment(foundAppointment.id, 'Cancelado pelo cliente na área de consulta');
      if (ok) {
        setCancelFeedback('Agendamento cancelado com sucesso. Seu horário foi liberado.');
        setFoundAppointment((prev) => (prev ? { ...prev, status: 'cancelado' } : null));
      }
    }
  };

  const settings = getSettings();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative w-full max-w-lg bg-[#140810] border border-[#FF2FA0]/40 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <LashIcon className="w-5 h-5 text-[#FF8AD8]" />
            <h3 className="font-display text-lg text-white font-medium">
              Consultar Minha Reserva
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
            Código da Reserva (Ex: GAB-8491) ou Número do WhatsApp
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="GAB-8491 ou (11) 99999-9999"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-[#1A0A12] border border-stone-800 focus:border-[#FF2FA0] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FF2FA0] hover:bg-[#FF8AD8] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar</span>
            </button>
          </div>
        </form>

        {cancelFeedback && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{cancelFeedback}</span>
          </div>
        )}

        {/* Result */}
        {foundAppointment && (
          <div className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] uppercase text-stone-400 block">Código</span>
                <span className="font-mono text-white font-bold">{foundAppointment.id}</span>
              </div>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                  foundAppointment.status === 'confirmado'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30'
                    : foundAppointment.status === 'cancelado'
                    ? 'bg-rose-950/40 text-rose-400 border border-rose-800/40'
                    : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                }`}
              >
                {foundAppointment.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400">Procedimento:</span>
                <span className="text-white font-medium">{foundAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Data e Horário:</span>
                <span className="text-white font-medium">
                  {foundAppointment.date} às {foundAppointment.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Cliente:</span>
                <span className="text-white">{foundAppointment.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Sinal Pago:</span>
                <span className="text-[#FF8AD8] font-medium">
                  R$ {foundAppointment.depositAmount.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Restante no Estúdio:</span>
                <span className="text-white">
                  R$ {foundAppointment.remainingAmount.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Actions for found appointment */}
            <div className="pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row items-center gap-2">
              <a
                href={`https://wa.me/${settings.studioWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Olá, Gab! Gostaria de tirar uma dúvida sobre o agendamento ${foundAppointment.id} (${foundAppointment.serviceName}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 py-2 px-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#25D366] text-stone-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Conversar no WhatsApp</span>
              </a>

              {foundAppointment.status !== 'cancelado' && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto py-2 px-3 rounded-xl border border-rose-900/60 hover:bg-rose-950/40 text-rose-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cancelar Agendamento</span>
                </button>
              )}
            </div>
          </div>
        )}

        {searched && !foundAppointment && (
          <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800 text-center space-y-1 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-white font-medium">Nenhum agendamento encontrado</p>
            <p className="text-stone-400">
              Verifique se digitou o código corretamente (Ex: GAB-8491) ou o número de WhatsApp com DDD.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
