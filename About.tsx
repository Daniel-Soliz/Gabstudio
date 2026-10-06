import React from 'react';
import { Sparkles, Award, Shield, CheckCircle2 } from 'lucide-react';
import { ASSETS } from '../services/storage';
import { LashIcon, VintageFlourish, CornerOrnament } from './DecorativeOrnament';

export const About: React.FC = () => {
  return (
    <section id="sobre" className="relative py-24 bg-[#140810] border-y border-[#FF2FA0]/15 overflow-hidden">
      {/* Delicate background illumination */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#FF2FA0]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Portrait Column */}
          <div className="lg:col-span-5 relative flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-sm">
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#FF2FA0]/40 via-transparent to-[#FF8AD8]/30 rounded-3xl blur-md" />
              
              <div className="relative bg-[#1A0A12] p-2.5 rounded-3xl border border-[#FF2FA0]/30 shadow-2xl">
                <CornerOrnament position="top-left" className="absolute top-4 left-4 w-6 h-6 text-[#FF8AD8]" />
                <CornerOrnament position="top-right" className="absolute top-4 right-4 w-6 h-6 text-[#FF8AD8]" />
                <CornerOrnament position="bottom-left" className="absolute bottom-4 left-4 w-6 h-6 text-[#FF8AD8]" />
                <CornerOrnament position="bottom-right" className="absolute bottom-4 right-4 w-6 h-6 text-[#FF8AD8]" />

                <div className="overflow-hidden rounded-2xl aspect-[3/4] bg-stone-900">
                  <img
                    src={ASSETS.about}
                    alt="Gab Santos - Lash Designer Especialista"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                <div className="mt-3 text-center py-2">
                  <p className="font-script text-2xl text-white">Gab Santos</p>
                  <p className="font-serif-luxury text-xs tracking-widest text-[#E6C280] uppercase">
                    Lash Designer Certificada
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF8AD8] font-medium mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF2FA0]" />
                <span className="font-serif-luxury">Conheça Sua Especialista</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white font-normal leading-snug">
                Arte, precisão e respeito absoluto pela <span className="text-[#FF8AD8] italic">saúde dos seus fios</span>
              </h2>
            </div>

            <div className="text-stone-300 font-sans-clean font-light text-sm sm:text-base space-y-4 leading-relaxed">
              <p>
                Olá, eu sou a <strong className="text-white font-normal">Gab Santos</strong>. Apaixonada por realçar a beleza feminina através do olhar, criei o <strong>Gab Studio</strong> na Zona Norte de São Paulo para oferecer muito mais do que extensões de cílios: uma experiência acolhedora de autoestima, relaxamento e sofisticação.
              </p>
              <p>
                Acredito firmemente que um olhar marcante nunca deve custar a saúde dos seus cílios naturais. Cada aplicação é antecedida por uma breve consulta de visagismo para identificar a curvatura, espessura e comprimento ideais para a anatomia dos seus olhos e rotina de vida.
              </p>
            </div>

            {/* 3 Pillars / Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#1A0A12]/90 border border-stone-800 hover:border-[#FF2FA0]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#FF2FA0]/15 flex items-center justify-center text-[#FF2FA0] mb-2.5">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-display text-white text-sm font-medium mb-1">
                  Materiais Premium
                </h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Fios hipoalergênicos ultrafinos e colas com certificação e testes dermatológicos.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1A0A12]/90 border border-stone-800 hover:border-[#FF2FA0]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#FF2FA0]/15 flex items-center justify-center text-[#FF2FA0] mb-2.5">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="font-display text-white text-sm font-medium mb-1">
                  Biossegurança Rigorosa
                </h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Pinças esterilizadas, escovinhas descartáveis e protocolo rigoroso de assepsia.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1A0A12]/90 border border-stone-800 hover:border-[#FF2FA0]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#FF2FA0]/15 flex items-center justify-center text-[#FF2FA0] mb-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-display text-white text-sm font-medium mb-1">
                  Resultado Sob Medida
                </h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Do clássico mais sutil ao mega volume, desenhado para valorizar seus traços únicos.
                </p>
              </div>
            </div>

            {/* Quote / Divider */}
            <div className="pt-2 flex items-center gap-3 text-stone-400 text-xs italic">
              <LashIcon className="w-5 h-5 text-[#FF2FA0] shrink-0" />
              <span>"Cílios perfeitos não são apenas sobre beleza exterior, são sobre acordar sentindo-se pronta para o mundo."</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
