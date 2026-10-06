import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { getTestimonials } from './storage';
import { TestimonialItem } from './types';
import { VintageFlourish } from './DecorativeOrnament';

export const TestimonialsSection: React.FC = () => {
  const [testimonials] = useState<TestimonialItem[]>(getTestimonials());
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section id="depoimentos" className="relative py-24 bg-[#140810] border-y border-[#FF2FA0]/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF8AD8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2FA0]" />
            <span className="font-serif-luxury">Satisfação Comprovada</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-normal">
            O Que Minhas <span className="text-[#FF8AD8] italic">Clientes Dizem</span>
          </h2>
          <p className="font-sans-clean text-stone-400 text-sm font-light">
            Depoimentos reais de quem confia seu olhar aos cuidados do Gab Studio.
          </p>
          <div className="flex justify-center pt-1 text-[#FF2FA0]/40">
            <VintageFlourish className="w-36 h-5" />
          </div>
        </div>

        {/* Featured Testimonial Spotlight */}
        <div className="max-w-3xl mx-auto bg-[#1A0A12] rounded-3xl border border-[#FF2FA0]/30 p-8 sm:p-12 relative shadow-2xl">
          <Quote className="absolute top-6 right-8 w-12 h-12 text-[#FF2FA0]/15 pointer-events-none" />

          {/* Stars */}
          <div className="flex items-center gap-1 mb-6">
            {Array.from({ length: current.stars }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#FF2FA0] text-[#FF2FA0]" />
            ))}
          </div>

          {/* Text */}
          <p className="font-serif-luxury text-lg sm:text-xl text-stone-200 italic leading-relaxed mb-8">
            "{current.text}"
          </p>

          {/* Author */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-stone-800">
            <div>
              <h4 className="font-display text-base text-white font-medium">
                {current.name}
              </h4>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                {current.role} · Procedimento: <span className="text-[#FF8AD8]">{current.service}</span>
              </p>
            </div>

            {/* Carousel navigation controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-stone-800 hover:border-[#FF2FA0] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-stone-400 tabular-nums px-2">
                {currentIndex + 1} / {testimonials.length}
              </span>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-stone-800 hover:border-[#FF2FA0] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mini cards preview below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => setCurrentIndex(idx)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                currentIndex === idx
                  ? 'bg-[#1A0A12] border-[#FF2FA0] shadow-md shadow-[#FF2FA0]/20'
                  : 'bg-[#1A0A12]/50 border-stone-800/80 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#FF2FA0] text-[#FF2FA0]" />
                ))}
              </div>
              <p className="text-xs text-stone-300 line-clamp-2 italic mb-2">
                "{t.text}"
              </p>
              <p className="text-[11px] font-medium text-white truncate">
                {t.name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
