import React from 'react';
import { Sparkles, Heart, ShieldCheck, Eye, Info, CheckCircle2 } from 'lucide-react';
import { ASSETS } from './storage';

export const About: React.FC = () => {
  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-[#231D27] overflow-hidden">
      <div className="absolute -top-24 right-0 w-80 h-80 rounded-full bg-[#E5488C]/8 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-6 lg:gap-10 items-stretch">
          <div className="relative overflow-hidden rounded-[28px] border border-[#EB7AAC]/15 bg-[#28212C] min-h-[420px]">
            <img
              src={ASSETS.about}
              alt="Imagem demonstrativa da profissional Gab Studio"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A171E] via-[#1A171E]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white">
                <Info className="w-3.5 h-3.5 text-[#D977A3]" />
                Apresentação demonstrativa
              </span>
              <h1 className="font-script text-4xl text-white mt-4">Gab Santos</h1>
              <p className="text-xs uppercase tracking-[0.18em] text-[#D977A3] mt-1">Lash Designer · Conceito de marca</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#EB7AAC]/10 bg-[#1A171E]/70 p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#EB7AAC]">
              <Sparkles className="w-4 h-4 text-[#E5488C]" />
              Sobre a profissional
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-3 leading-tight">
              Um espaço pensado para realçar a <span className="text-[#EB7AAC] italic">beleza do olhar</span>
            </h2>

            <div className="mt-5 space-y-4 text-sm sm:text-base text-stone-300 leading-relaxed">
              <p>
                Esta área mostra como a história da profissional pode ser apresentada de forma mais humana e valorizada. A proposta é transmitir cuidado, atenção aos detalhes e uma experiência feminina do primeiro contato ao pós-atendimento.
              </p>
              <p>
                O texto final pode contar a trajetória real da Gab, técnicas em que ela atua, estilo de atendimento, cursos, diferenciais e tudo o que torna o trabalho dela único.
              </p>
            </div>

            <div className="mt-7 grid sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#EB7AAC]/10 bg-[#28212C] p-4">
                <div className="w-10 h-10 rounded-2xl bg-[#E5488C]/12 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#EB7AAC]" />
                </div>
                <h3 className="font-display text-sm text-white mt-3">Olhar personalizado</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">Apresentar efeitos e técnicas de acordo com o estilo desejado por cada cliente.</p>
              </div>

              <div className="rounded-2xl border border-[#EB7AAC]/10 bg-[#28212C] p-4">
                <div className="w-10 h-10 rounded-2xl bg-[#E5488C]/12 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#EB7AAC]" />
                </div>
                <h3 className="font-display text-sm text-white mt-3">Confiança no atendimento</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">Comunicar rotina de higiene, organização e cuidados reais adotados pela profissional.</p>
              </div>

              <div className="rounded-2xl border border-[#EB7AAC]/10 bg-[#28212C] p-4">
                <div className="w-10 h-10 rounded-2xl bg-[#E5488C]/12 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#EB7AAC]" />
                </div>
                <h3 className="font-display text-sm text-white mt-3">Experiência feminina</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">Uma comunicação acolhedora, elegante e alinhada ao público de beleza.</p>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-[#D977A3]/20 bg-[#D977A3]/5 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D977A3] shrink-0" />
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  <strong className="text-[#E9A0C0]">Na versão final:</strong> esta apresentação será personalizada com a história, cursos, endereço, fotos e diferenciais verdadeiros da profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
