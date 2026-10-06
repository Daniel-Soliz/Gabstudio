import React from 'react';
import { Droplets, Wind, Sparkles, Ban, Bed, CalendarSync } from 'lucide-react';
import { VintageFlourish } from './DecorativeOrnament';

export const AftercareSection: React.FC = () => {
  const tips = [
    {
      icon: Droplets,
      title: 'Primeiras 24 Horas',
      text: 'Evite molhar os olhos diretamente, banhos muito quentes com vapor intenso, saunas e piscinas enquanto a cola completa a sua cura total.',
    },
    {
      icon: Wind,
      title: 'Higienização Diária',
      text: 'Lave os cílios suavemente com shampoo neutro infantil ou espuma específica para extensões. Manter a raiz limpa previne blefarite e aumenta a retenção.',
    },
    {
      icon: Sparkles,
      title: 'Escovação Delicada',
      text: 'Penteie seus cílios com a escovinha fornecida pela Gab uma a duas vezes ao dia, sempre com os fios secos e da raiz às pontas com leveza.',
    },
    {
      icon: Ban,
      title: 'Zero Produtos Oleosos e Rímel',
      text: 'Nunca utilize rímel (máscara de cílios) nem demaquilantes bifásicos à base de óleo, pois eles dissolvem o adesivo cirúrgico e derrubam os fios precocemente.',
    },
    {
      icon: Bed,
      title: 'Atenção ao Dormir',
      text: 'Evite dormir de bruços ou com o rosto pressionado no travesseiro. Fronhas de cetim ou seda ajudam a diminuir o atrito e preservam o alinhamento.',
    },
    {
      icon: CalendarSync,
      title: 'Manutenção em Dia',
      text: 'Agende a manutenção entre 18 e 21 dias. Fios que crescem precisam ser removidos e repostos com segurança para não sobrecarregar seu fio natural.',
    },
  ];

  return (
    <section className="relative py-24 bg-[#0D0509]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF8AD8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2FA0]" />
            <span className="font-serif-luxury">Guia de Retenção</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-normal">
            Cuidados <span className="text-[#FF8AD8] italic">Pós-Aplicação</span>
          </h2>
          <p className="font-sans-clean text-stone-400 text-sm font-light">
            Pequenos hábitos diários garantem que seus cílios durem perfeitos por muito mais tempo.
          </p>
          <div className="flex justify-center pt-1 text-[#FF2FA0]/40">
            <VintageFlourish className="w-36 h-5" />
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div
                key={index}
                className="bg-[#1A0A12]/80 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between hover:border-[#FF2FA0]/40 transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FF2FA0]/15 text-[#FF8AD8] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg text-white font-medium mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                    {tip.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
