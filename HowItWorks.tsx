import React from 'react';
import { Sparkles, CalendarDays, Palette, Sparkle, Heart } from 'lucide-react';
import { VintageFlourish } from './DecorativeOrnament';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Agende pelo Site',
      description: 'Escolha seu procedimento preferido, selecione o dia e horário que melhor se encaixam na sua rotina e garanta a vaga com o sinal online seguro.',
      icon: CalendarDays,
    },
    {
      number: '02',
      title: 'Defina seu Estilo',
      description: 'Ao chegar, faremos uma avaliação de visagismo gratuita para alinhar a curvatura, mapping e densidade perfeita para valorizar seus traços.',
      icon: Palette,
    },
    {
      number: '03',
      title: 'Atendimento Relaxante',
      description: 'Deite em nossa maca ergonômica com manta aconchegante em ambiente climatizado. A aplicação é totalmente indolor e você pode descansar.',
      icon: Sparkle,
    },
    {
      number: '04',
      title: 'Cuidados & Durabilidade',
      description: 'Você receberá uma escovinha higiênica e todas as instruções pós-procedimento para manter seus cílios lindos e saudáveis por semanas.',
      icon: Heart,
    },
  ];

  return (
    <section className="relative py-24 bg-[#0D0509]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF8AD8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2FA0]" />
            <span className="font-serif-luxury">Passo a Passo</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-normal">
            Como Funciona a <span className="text-[#FF8AD8] italic">Experiência Gab Studio</span>
          </h2>
          <p className="font-sans-clean text-stone-400 text-sm font-light">
            Da escolha do horário ao resultado no espelho: tudo planejado para o seu conforto e tranquilidade.
          </p>
          <div className="flex justify-center pt-1 text-[#FF2FA0]/40">
            <VintageFlourish className="w-36 h-5" />
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-[#1A0A12]/90 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between hover:border-[#FF2FA0]/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-3xl font-light text-[#FF2FA0] tracking-wider">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FF2FA0]/15 flex items-center justify-center text-[#FF8AD8]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg text-white font-medium mb-2">
                    {step.title}
                  </h3>

                  <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-800/60 flex items-center gap-2 text-[11px] text-[#E6C280] font-light">
                  <span>Passo {step.number} de 04</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
