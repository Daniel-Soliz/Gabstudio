import React from 'react';
import { Calendar, Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import { ASSETS } from '../services/storage';
import { LashIcon, VintageFlourish, CornerOrnament } from './DecorativeOrnament';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section id="inicio" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background ambient radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-[#FF2FA0]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-96 h-96 bg-[#FF8AD8]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Top editorial brand pill/badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A0A12]/80 border border-[#FF2FA0]/30 shadow-sm text-xs uppercase tracking-widest text-[#FF8AD8]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2FA0]" />
              <span className="font-serif-luxury font-medium">Gab Santos · Zona Norte, São Paulo</span>
            </div>

            {/* Neon Brand Title */}
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <LashIcon className="w-8 h-8 text-[#FF8AD8] opacity-80" />
                <span className="font-script text-5xl sm:text-7xl lg:text-8xl text-white neon-text animate-neon-pulse tracking-wide select-none">
                  Gab Studio
                </span>
              </div>
              <p className="font-serif-luxury text-sm sm:text-base tracking-[0.3em] uppercase text-[#E6C280] font-light">
                Especialista em Cílios & Visagismo do Olhar
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight max-w-2xl text-balance">
              Realce seu olhar com cílios feitos <span className="italic text-[#FF8AD8]">sob medida</span>
            </h1>

            {/* Paragraph */}
            <p className="font-sans-clean text-stone-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Técnicas avançadas de alta retenção, biossegurança impecável e visagismo individualizado. Acorde todos os dias com a confiança de um olhar perfeito, leve e natural.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto neon-button px-7 py-3.5 rounded-full text-white font-medium text-sm sm:text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-[#FF2FA0]/20"
              >
                <Calendar className="w-4 h-4 text-[#FF8AD8]" />
                <span className="tracking-wider">Agendar Meu Horário</span>
              </button>

              <a
                href="#servicos"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 hover:border-[#FF2FA0]/40 text-stone-300 hover:text-white font-light text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Ver Procedimentos</span>
                <ArrowRight className="w-4 h-4 text-[#FF8AD8]" />
              </a>
            </div>

            {/* Flourish Divider */}
            <div className="flex justify-center lg:justify-start pt-2 text-[#FF2FA0]/40">
              <VintageFlourish className="w-44 h-5" />
            </div>

            {/* Trust Badges */}
            <div className="pt-2 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left border-t border-stone-800/80">
              <div className="pt-3">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[#FF8AD8] text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#FF2FA0]" />
                  <span>Biossegurança</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">Materiais descartáveis e esterilizados</p>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[#FF8AD8] text-xs font-medium">
                  <Eye className="w-4 h-4 text-[#FF2FA0]" />
                  <span>Alta Retenção</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">Fios intactos por 20 a 25 dias</p>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[#FF8AD8] text-xs font-medium">
                  <HeartHandshake className="w-4 h-4 text-[#FF2FA0]" />
                  <span>Visagismo</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">Design harmônico para o seu formato</p>
              </div>
            </div>

          </div>

          {/* Right Visual Image Column */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-[#FF2FA0]/20 rounded-3xl blur-2xl transform scale-95" />

            {/* Framed Image Container */}
            <div className="relative group w-full max-w-md bg-[#1A0A12] p-2.5 rounded-3xl border border-[#FF2FA0]/30 shadow-2xl transition-all duration-500 hover:border-[#FF2FA0]">
              <CornerOrnament position="top-left" className="absolute top-4 left-4 w-6 h-6 text-[#FF8AD8]" />
              <CornerOrnament position="top-right" className="absolute top-4 right-4 w-6 h-6 text-[#FF8AD8]" />
              <CornerOrnament position="bottom-left" className="absolute bottom-4 left-4 w-6 h-6 text-[#FF8AD8]" />
              <CornerOrnament position="bottom-right" className="absolute bottom-4 right-4 w-6 h-6 text-[#FF8AD8]" />

              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-stone-900">
                <img
                  src={ASSETS.hero}
                  alt="Modelo com extensão de cílios profissional por Gab Studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0509]/90 via-[#0D0509]/20 to-transparent" />

                {/* Float Card Info */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#1A0A12]/85 backdrop-blur-md border border-[#FF2FA0]/30 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-[#FF8AD8] font-medium block">
                      Técnica em Destaque
                    </span>
                    <span className="font-display text-sm text-white font-medium">
                      Volume Russo & Fox Eyes
                    </span>
                  </div>
                  <button
                    onClick={onOpenBooking}
                    className="px-3 py-1.5 rounded-lg bg-[#FF2FA0] text-white text-xs font-medium hover:bg-[#FF8AD8] transition-colors"
                  >
                    Escolher
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
