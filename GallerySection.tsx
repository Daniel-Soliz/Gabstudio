import React, { useState } from 'react';
import { Instagram, Sparkles, X, ZoomIn, ArrowRight } from 'lucide-react';
import { getGallery } from './storage';
import { GalleryItem } from './types';
import { VintageFlourish } from './DecorativeOrnament';

export const GallerySection: React.FC = () => {
  const [items] = useState<GalleryItem[]>(getGallery());
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('todos');

  const filters = ['todos', 'Volume Russo', 'Fox Eyes', 'Volume Brasileiro', 'Estúdio'];

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'todos') return true;
    return item.style === activeFilter;
  });

  return (
    <section id="galeria" className="relative py-24 bg-[#140810] border-t border-[#FF2FA0]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF8AD8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2FA0]" />
            <span className="font-serif-luxury">Portfólio & Resultados</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-normal">
            Meus <span className="text-[#FF8AD8] italic">Trabalhos</span>
          </h2>
          <p className="font-sans-clean text-stone-400 text-sm font-light">
            Clique em cada foto para ampliar os detalhes da aplicação e curvatura.
          </p>
          <div className="flex justify-center pt-1 text-[#FF2FA0]/40">
            <VintageFlourish className="w-36 h-5" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === f
                  ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/30'
                  : 'bg-[#1A0A12] text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              {f === 'todos' ? 'Todas as Fotos' : f}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#1A0A12] border border-stone-800 hover:border-[#FF2FA0]/60 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#FF2FA0]/20"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
              </div>

              {/* Hover overlay with zoom hint */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0509]/95 via-[#0D0509]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-serif-luxury uppercase tracking-widest text-[#FF8AD8]">
                      {item.style}
                    </span>
                    <h3 className="font-display text-white text-base font-medium">
                      {item.title}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#FF2FA0] text-white flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://instagram.com/gabstudio.lash"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1A0A12] hover:bg-stone-900 border border-[#FF2FA0]/40 text-white text-sm font-light hover:border-[#FF2FA0] transition-all hover:scale-105 shadow-lg shadow-black/40"
          >
            <Instagram className="w-4 h-4 text-[#FF2FA0]" />
            <span>Ver mais fotos no Instagram <strong className="font-medium text-[#FF8AD8]">@gabstudio.lash</strong></span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </a>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#1A0A12] rounded-2xl border border-[#FF2FA0]/40 overflow-hidden shadow-2xl p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white hover:text-[#FF8AD8] hover:bg-black flex items-center justify-center transition-colors"
              aria-label="Fechar ampliação"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-hidden rounded-xl aspect-[4/3] sm:aspect-[16/10] bg-stone-900 mb-3">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="px-2 py-1 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#FF8AD8]">
                  {selectedItem.style}
                </span>
                <h4 className="font-display text-xl text-white font-medium">
                  {selectedItem.title}
                </h4>
                <p className="text-xs text-stone-300 font-light mt-0.5">
                  {selectedItem.description}
                </p>
              </div>

              <a
                href="https://instagram.com/gabstudio.lash"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300 hover:text-white"
              >
                <Instagram className="w-3.5 h-3.5 text-[#FF2FA0]" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
