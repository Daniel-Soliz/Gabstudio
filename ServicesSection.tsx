import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles, Check, Eye, Info } from 'lucide-react';
import { getServices } from './storage';
import { ServiceItem } from './types';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

const idealFor: Record<string, string> = {
  'fio-a-fio': 'Para quem busca naturalidade e efeito máscara de cílios.',
  'volume-brasileiro': 'Para quem quer preenchimento leve e moderno.',
  'volume-russo': 'Para quem gosta de um olhar marcante e sofisticado.',
  'fox-eyes': 'Para quem busca efeito alongado e destaque no canto externo.',
  'mega-volume': 'Para quem prefere bastante presença e densidade visual.',
  'volume-kim': 'Para quem gosta de acabamento texturizado e contemporâneo.',
  'manutencao': 'Para manter o desenho alinhado e o efeito sempre bonito.',
  'remocao': 'Para remover a extensão de forma cuidadosa e profissional.',
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    setServices(getServices());
    const handleDataChange = () => setServices(getServices());
    window.addEventListener('gab-studio-data-changed', handleDataChange);
    return () => window.removeEventListener('gab-studio-data-changed', handleDataChange);
  }, []);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'Extensão', label: 'Extensões' },
    { id: 'Mapeamento Exclusivo', label: 'Efeitos' },
    { id: 'Cuidados', label: 'Cuidados' },
  ];

  const filteredServices = services.filter((service) => {
    if (!service.isAvailable) return false;
    if (filter === 'todos') return true;
    if (filter === 'Cuidados') return service.category === 'Manutenção' || service.category === 'Cuidados';
    return service.category === filter;
  });

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}min`;
    if (h > 0) return `${h}h`;
    return `${m}min`;
  };

  return (
    <section className="relative bg-[#0D0509] py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-5 lg:gap-8 items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#FF8AD8]">
              <Sparkles className="w-4 h-4 text-[#FF2FA0]" />
              Menu de procedimentos
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-3 leading-tight">
              Escolha o efeito que combina com <span className="text-[#FF8AD8] italic">seu olhar</span>
            </h1>
          </div>
          <div className="lg:pb-1">
            <p className="text-sm sm:text-base text-stone-400 leading-relaxed max-w-2xl">
              Uma apresentação clara ajuda a cliente a entender a diferença entre cada técnica antes mesmo de chamar no WhatsApp.
            </p>
            <div className="mt-4 inline-flex items-start gap-2 rounded-2xl border border-[#E6C280]/20 bg-[#E6C280]/5 px-4 py-3 text-xs text-stone-300">
              <Info className="w-4 h-4 text-[#E6C280] shrink-0 mt-0.5" />
              <span><strong className="text-[#F3E5AB]">Valores demonstrativos:</strong> preços e tempos podem ser personalizados com a tabela real da profissional.</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-7 sm:flex-wrap sm:overflow-visible">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                filter === cat.id
                  ? 'bg-[#FF2FA0] text-white shadow-lg shadow-[#FF2FA0]/20'
                  : 'bg-[#160A12] text-stone-300 border border-[#FF8AD8]/10 hover:border-[#FF2FA0]/35'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="group overflow-hidden rounded-[24px] border border-[#FF8AD8]/12 bg-[#160A12] hover:border-[#FF2FA0]/40 transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#24101C]">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={`Referência visual para ${service.name}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye className="w-10 h-10 text-[#FF8AD8]/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#160A12] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/55 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="rounded-full bg-[#FF2FA0] px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-white">
                      {service.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h2 className="font-display text-xl text-white group-hover:text-[#FF8AD8] transition-colors">
                  {service.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mt-2 min-h-[44px]">
                  {service.description}
                </p>

                <div className="mt-4 rounded-2xl bg-[#0D0509]/60 border border-[#FF8AD8]/8 p-3.5">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#FF8AD8] shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-300 leading-relaxed">{idealFor[service.id] || 'Procedimento personalizado conforme o efeito desejado.'}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4 mt-5 pt-4 border-t border-[#FF8AD8]/10">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-stone-500">A partir de</span>
                    <strong className="font-display text-2xl text-white">R$ {service.price.toFixed(2).replace('.', ',')}</strong>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase tracking-wider text-stone-500">Tempo médio</span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#E6C280] mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(service.durationMinutes)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(service.id)}
                  className="mt-5 w-full min-h-[46px] rounded-2xl bg-[#FF2FA0] hover:bg-[#ff45aa] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Quero este efeito
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
