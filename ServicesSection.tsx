import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles, Check } from 'lucide-react';
import { getServices } from '../services/storage';
import { ServiceItem } from '../types';
import { LashIcon, VintageFlourish } from './DecorativeOrnament';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [filter, setFilter] = useState<string>('todos');

  useEffect(() => {
    setServices(getServices());

    const handleDataChange = () => {
      setServices(getServices());
    };
    window.addEventListener('gab-studio-data-changed', handleDataChange);
    return () => window.removeEventListener('gab-studio-data-changed', handleDataChange);
  }, []);

  const categories = [
    { id: 'todos', label: 'Todos os Procedimentos' },
    { id: 'Extensão', label: 'Extensões' },
    { id: 'Mapeamento Exclusivo', label: 'Efeitos Especiais' },
    { id: 'Cuidados', label: 'Manutenção & Remoção' },
  ];

  const filteredServices = services.filter((s) => {
    if (!s.isAvailable) return false;
    if (filter === 'todos') return true;
    if (filter === 'Cuidados') return s.category === 'Manutenção' || s.category === 'Cuidados';
    return s.category === filter;
  });

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}min`;
    if (h > 0) return `${h}h`;
    return `${m}min`;
  };

  return (
    <section id="servicos" className="relative py-24 bg-[#0D0509]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF8AD8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2FA0]" />
            <span className="font-serif-luxury">Cardápio de Serviços</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-normal">
            Procedimentos & Técnicas <span className="text-[#FF8AD8] italic">Exclusivas</span>
          </h2>
          <p className="font-sans-clean text-stone-400 text-sm font-light">
            Valores transparentes, fios de alta retenção e aplicação com visagismo personalizado.
          </p>
          <div className="flex justify-center pt-1 text-[#FF2FA0]/40">
            <VintageFlourish className="w-36 h-5" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                filter === cat.id
                  ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/30'
                  : 'bg-[#1A0A12] text-stone-400 hover:text-white border border-stone-800 hover:border-[#FF2FA0]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative bg-[#1A0A12]/80 backdrop-blur-sm rounded-2xl border border-stone-800 hover:border-[#FF2FA0]/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#FF2FA0]/10 hover:-translate-y-1"
            >
              <div>
                {/* Header with category and badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-serif-luxury tracking-widest uppercase text-stone-400">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#FF2FA0]/15 text-[#FF8AD8] border border-[#FF2FA0]/30">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Service Name */}
                <h3 className="font-display text-xl text-white font-medium mb-2 group-hover:text-[#FF8AD8] transition-colors">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Bottom Price, Duration & CTA */}
              <div className="pt-4 border-t border-stone-800/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 block font-light">Valor</span>
                    <span className="font-display text-2xl text-white font-semibold tabular-nums">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-stone-400 block font-light">Duração</span>
                    <div className="inline-flex items-center gap-1 text-xs text-[#E6C280] font-light">
                      <Clock className="w-3.5 h-3.5 text-[#FF2FA0]" />
                      <span>{formatDuration(service.durationMinutes)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectService(service.id)}
                  className="w-full neon-button py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 group-hover:scale-[1.01] transition-transform"
                >
                  <Calendar className="w-4 h-4 text-[#FF8AD8]" />
                  <span>Agendar este Procedimento</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Note on Maintenance */}
        <div className="mt-12 text-center text-xs text-stone-400 max-w-xl mx-auto flex items-center justify-center gap-2">
          <LashIcon className="w-4 h-4 text-[#FF2FA0] shrink-0" />
          <span>
            Dica da Gab: Para manter seus cílios impecáveis, recomendamos agendar a manutenção a cada 18 a 21 dias.
          </span>
        </div>

      </div>
    </section>
  );
};
