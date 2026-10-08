import React, { useState } from 'react';
import { Sparkles, X, ZoomIn, Image as ImageIcon, Info } from 'lucide-react';
import { getGallery } from './storage';
import { GalleryItem } from './types';

export const GallerySection: React.FC = () => {
  const [items] = useState<GalleryItem[]>(getGallery());
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('todos');

  const filters = ['todos', 'Volume Russo', 'Fox Eyes', 'Volume Brasileiro', 'Estúdio', 'Visagismo'];

  const filteredItems = items.filter((item) => activeFilter === 'todos' || item.style === activeFilter);

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-[#231D27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-5 items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#EB7AAC]">
              <Sparkles className="w-4 h-4 text-[#E5488C]" />
              Portfólio visual
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-3">
              Referências de <span className="text-[#EB7AAC] italic">resultados</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-stone-400 max-w-2xl leading-relaxed">
              Uma galeria ajuda a cliente a identificar rapidamente o estilo que mais combina com ela antes do agendamento.
            </p>
          </div>

          <div className="rounded-2xl border border-[#D977A3]/20 bg-[#D977A3]/5 p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-[#D977A3] shrink-0 mt-0.5" />
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong className="text-[#E9A0C0]">Galeria demonstrativa:</strong> estas imagens funcionam como referências visuais da proposta e devem ser substituídas pelos trabalhos reais da profissional.
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-7 sm:flex-wrap sm:overflow-visible">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-[#E5488C] text-white'
                  : 'bg-[#27212B] text-stone-300 border border-[#EB7AAC]/10 hover:border-[#E5488C]/35'
              }`}
            >
              {filter === 'todos' ? 'Todos os estilos' : filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item)}
              className={`group text-left relative overflow-hidden rounded-[22px] border border-[#EB7AAC]/12 bg-[#27212B] hover:border-[#E5488C]/45 transition-all ${
                index === 0 ? 'col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[16/9] lg:aspect-[4/5]' : 'aspect-[4/5]'}`}>
                <img
                  src={item.imageUrl}
                  alt={`Referência ilustrativa: ${item.title}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A171E]/95 via-[#1A171E]/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-wider text-white">
                    <ImageIcon className="w-3 h-3 text-[#EB7AAC]" />
                    Referência visual
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#EB7AAC]">{item.style}</span>
                  <div className="flex items-end justify-between gap-3 mt-1">
                    <div className="min-w-0">
                      <h2 className="font-display text-base sm:text-xl text-white truncate">{item.title}</h2>
                      <p className="hidden sm:block text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#E5488C] text-white flex items-center justify-center shrink-0">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-[24px] bg-[#28212C] border border-[#E5488C]/35 overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/65 text-white flex items-center justify-center"
              aria-label="Fechar imagem"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[4/3] sm:aspect-[16/10] bg-stone-900">
              <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-5 sm:p-6">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#EB7AAC]">Referência demonstrativa · {selectedItem.style}</span>
              <h2 className="font-display text-2xl text-white mt-2">{selectedItem.title}</h2>
              <p className="text-sm text-stone-300 leading-relaxed mt-2">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
