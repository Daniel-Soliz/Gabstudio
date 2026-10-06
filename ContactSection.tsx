import React, { useState, useEffect } from 'react';
import { MapPin, Clock, MessageCircle, Instagram, Sparkles, Navigation, Calendar } from 'lucide-react';
import { getSettings } from '../services/storage';
import { ScheduleSettings } from '../types';
import { VintageFlourish } from './DecorativeOrnament';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const [settings, setSettings] = useState<ScheduleSettings>(getSettings());

  useEffect(() => {
    const handleDataChange = () => setSettings(getSettings());
    window.addEventListener('gab-studio-data-changed', handleDataChange);
    return () => window.removeEventListener('gab-studio-data-changed', handleDataChange);
  }, []);

  const whatsappLink = `https://wa.me/${settings.studioWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Olá, Gab! Vim pelo site e gostaria de agendar um horário ou tirar dúvidas.'
  )}`;

  const instagramLink = `https://instagram.com/${settings.studioInstagram.replace('@', '')}`;

  return (
    <section id="contato" className="relative py-24 bg-[#0D0509]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF8AD8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2FA0]" />
            <span className="font-serif-luxury">Localização & Contato</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-normal">
            Visite Nosso <span className="text-[#FF8AD8] italic">Estúdio</span>
          </h2>
          <p className="font-sans-clean text-stone-400 text-sm font-light">
            Localizado no coração da Zona Norte de São Paulo, em ponto nobre e de fácil acesso com estacionamento próximo.
          </p>
          <div className="flex justify-center pt-1 text-[#FF2FA0]/40">
            <VintageFlourish className="w-36 h-5" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#1A0A12] rounded-3xl border border-stone-800 p-8 space-y-6">
            <h3 className="font-display text-2xl text-white font-medium">
              Informações do Estúdio
            </h3>

            <div className="space-y-5 text-stone-300 text-sm font-light">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF2FA0]/15 text-[#FF8AD8] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#FF2FA0]" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block font-normal">
                    Endereço
                  </span>
                  <p className="text-white font-medium">
                    {settings.studioAddress}
                  </p>
                  <p className="text-xs text-stone-400">
                    {settings.studioNeighborhood} · {settings.studioCity}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF2FA0]/15 text-[#FF8AD8] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#FF2FA0]" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block font-normal">
                    Horário de Atendimento
                  </span>
                  <p className="text-white font-medium">
                    Segunda a Sábado: {settings.businessHoursStart} às {settings.businessHoursEnd}
                  </p>
                  <p className="text-xs text-stone-400">
                    Atendimento com hora marcada para exclusividade total.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 border-t border-stone-800/80 space-y-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-sm font-medium flex items-center justify-center gap-2.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </a>

              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-sm font-medium flex items-center justify-center gap-2.5 transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#FF2FA0]" />
                <span>Seguir no Instagram {settings.studioInstagram}</span>
              </a>

              <button
                onClick={onOpenBooking}
                className="w-full neon-button py-3 px-4 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-transform"
              >
                <Calendar className="w-4 h-4 text-[#FF8AD8]" />
                <span>Agendar Horário Online</span>
              </button>
            </div>
          </div>

          {/* Map Preview Card */}
          <div className="lg:col-span-7 bg-[#1A0A12] rounded-3xl border border-stone-800 overflow-hidden shadow-2xl relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-stone-900">
              {/* Stylized Google Map iframe representation for Zona Norte Santana SP */}
              <iframe
                title="Localização do Gab Studio"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14635.801657434724!2d-46.63473147775514!3d-23.498299863459146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5881458e0a81%3A0xe54cf1c62f88a44b!2sSantana%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(95%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Pin Card */}
              <div className="absolute top-4 left-4 bg-[#0D0509]/90 backdrop-blur-md border border-[#FF2FA0]/40 p-3 rounded-xl shadow-lg max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF2FA0] animate-ping" />
                  <span className="font-display text-xs text-white font-medium">Gab Studio</span>
                </div>
                <p className="text-[11px] text-stone-300 font-light">
                  {settings.studioAddress}
                </p>
              </div>

              <div className="absolute bottom-4 right-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${settings.studioAddress}, ${settings.studioNeighborhood}, ${settings.studioCity}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D0509]/90 border border-stone-700 text-xs text-white hover:border-[#FF2FA0] shadow-md transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FF2FA0]" />
                  <span>Traçar Rota no Google Maps</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
