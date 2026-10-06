import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getSettings } from '../services/storage';

export const FloatingWhatsapp: React.FC = () => {
  const settings = getSettings();
  const phone = settings.studioWhatsapp.replace(/\D/g, '') || '5511969530621';
  const text = encodeURIComponent('Olá, Gab! Vim pelo site e gostaria de agendar um horário.');
  const whatsappUrl = `https://wa.me/${phone}?text=${text}`;

  return (
    <aside aria-label="Atendimento pelo WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Falar com Gab Santos no WhatsApp"
      >
        {/* Pulsing ring aura */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/50 animate-ping pointer-events-none opacity-75" />

        <MessageCircle className="w-7 h-7 fill-white text-white drop-shadow-md" />

        {/* Tooltip on hover */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#1A0A12] border border-[#25D366]/50 text-white text-xs font-medium whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
          Falar com a Gab no WhatsApp
        </span>
      </a>
    </aside>
  );
};
