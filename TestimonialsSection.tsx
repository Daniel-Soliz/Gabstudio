import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, Info } from 'lucide-react';
import { getTestimonials } from './storage';
import { TestimonialItem } from './types';

export const TestimonialsSection: React.FC = () => {
  const [testimonials] = useState<TestimonialItem[]>(getTestimonials());
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  const current = testimonials[currentIndex];

  if (!current) return null;

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-[#0D0509]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-5 items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#FF8AD8]">
              <Sparkles className="w-4 h-4 text-[#FF2FA0]" />
              Prova social
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-3 leading-tight">
              Como as avaliações podem <span className="text-[#FF8AD8] italic">valorizar o trabalho</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-stone-400 max-w-2xl leading-relaxed">
              A página pode destacar experiências de clientes e ajudar novas pessoas a se sentirem mais seguras antes de agendar.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6C280]/20 bg-[#E6C280]/5 p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-[#E6C280] shrink-0 mt-0.5" />
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong className="text-[#F3E5AB]">Depoimentos demonstrativos:</strong> os textos abaixo são exemplos de apresentação e devem ser trocados pelas avaliações reais da profissional antes da divulgação final.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-[#FF2FA0]/25 bg-gradient-to-br from-[#1A0A12] via-[#160A12] to-[#10070D] p-6 sm:p-8 lg:p-10">
          <Quote className="absolute top-6 right-7 w-14 h-14 text-[#FF2FA0]/10" />

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex gap-1">
              {Array.from({ length: current.stars }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FF2FA0] text-[#FF2FA0]" />
              ))}
            </div>
            <span className="rounded-full border border-[#FF8AD8]/15 bg-[#24101C] px-3 py-1 text-[10px] uppercase tracking-wider text-[#FF8AD8]">
              Exemplo de avaliação
            </span>
          </div>

          <p className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl text-stone-100 italic leading-relaxed max-w-4xl">
            “{current.text}”
          </p>

          <div className="mt-8 pt-6 border-t border-[#FF8AD8]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h2 className="font-display text-lg text-white">{current.name}</h2>
              <p className="text-xs text-stone-400 mt-1">
                {current.role} · <span className="text-[#FF8AD8]">{current.service}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="w-11 h-11 rounded-full border border-[#FF8AD8]/15 bg-[#160A12] text-stone-300 hover:text-white hover:border-[#FF2FA0]/45 flex items-center justify-center"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-stone-500 tabular-nums px-2">{currentIndex + 1} / {testimonials.length}</span>
              <button
                type="button"
                onClick={nextSlide}
                className="w-11 h-11 rounded-full border border-[#FF8AD8]/15 bg-[#160A12] text-stone-300 hover:text-white hover:border-[#FF2FA0]/45 flex items-center justify-center"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`text-left rounded-2xl border p-4 transition-all ${
                index === currentIndex
                  ? 'border-[#FF2FA0]/45 bg-[#1A0A12]'
                  : 'border-[#FF8AD8]/10 bg-[#160A12]/70 hover:border-[#FF2FA0]/25'
              }`}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="w-3 h-3 fill-[#FF2FA0] text-[#FF2FA0]" />
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-300 line-clamp-3 italic">“{testimonial.text}”</p>
              <p className="mt-3 text-[11px] font-semibold text-white">{testimonial.name}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
