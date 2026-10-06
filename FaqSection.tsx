import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import { VintageFlourish } from './DecorativeOrnament';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'A aplicação de extensão de cílios dói?',
      answer: 'Não! O procedimento é 100% indolor e relaxante. A maioria das nossas clientes adormece durante a sessão. Os fios sintéticos são acoplados exclusivamente aos fios naturais a cerca de 0,5mm da raiz, sem encostar na pálpebra ou machucar.',
    },
    {
      question: 'Quanto tempo dura a extensão de cílios?',
      answer: 'Em média de 20 a 30 dias, acompanhando o ciclo biológico de renovação dos seus cílios naturais (que caem naturalmente e dão lugar a novos fios). Para manter o preenchimento uniforme e impecável, recomendamos realizar a manutenção entre 18 e 21 dias.',
    },
    {
      question: 'Posso molhar, tomar banho e praticar esportes?',
      answer: 'Sim! Após o período de cura inicial de 24 horas, você pode molhar o rosto normalmente, tomar banho e ir à academia. Inclusive, lavar os cílios diariamente com shampoo neutro é indispensável para a higienização da raiz e maior durabilidade.',
    },
    {
      question: 'Quanto tempo leva uma sessão de aplicação?',
      answer: 'Depende da técnica escolhida: o Fio a Fio clássico leva em média 1h45min; o Volume Russo e Fox Eyes levam entre 2h e 2h15min; a manutenção leva em torno de 1h15min. Prezamos pela técnica minuciosa de isolamento fio a fio para preservar sua saúde ocular.',
    },
    {
      question: 'Por que é preciso fazer manutenção periódica?',
      answer: 'Nossos cílios crescem continuamente. Com o crescimento natural do fio, o ponto de peso da extensão se desloca para a ponta. A manutenção serve para remover com segurança esses fios que cresceram e preencher os novos fios nascidos, evitando torção e quebra.',
    },
    {
      question: 'Tenho olhos sensíveis ou medo de alergia. Posso fazer?',
      answer: 'Utilizamos adesivos cirúrgicos com registro na Anvisa e fórmulas dermatologicamente testadas, com baixo índice de vapores. Caso você já tenha tido reações alérgicas anteriores ou tenha pele hipersensível, realizamos um teste alérgico prévio com aplicação de 5 a 10 fios 24h antes do atendimento.',
    },
  ];

  return (
    <section id="faq" className="relative py-24 bg-[#140810] border-t border-[#FF2FA0]/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF8AD8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2FA0]" />
            <span className="font-serif-luxury">Tire Suas Dúvidas</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-normal">
            Perguntas <span className="text-[#FF8AD8] italic">Frequentes</span>
          </h2>
          <p className="font-sans-clean text-stone-400 text-sm font-light">
            Esclareça os principais pontos sobre o procedimento, durabilidade e cuidados.
          </p>
          <div className="flex justify-center pt-1 text-[#FF2FA0]/40">
            <VintageFlourish className="w-36 h-5" />
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#1A0A12] rounded-2xl border border-stone-800 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:text-[#FF8AD8] transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#FF2FA0] shrink-0 opacity-70" />
                    <span className="font-display text-sm sm:text-base text-white font-medium">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#FF2FA0]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-stone-800/60 text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
