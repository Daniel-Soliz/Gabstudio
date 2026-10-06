import React from 'react';
import { Instagram, MessageCircle, Heart, Shield, Search } from 'lucide-react';
import { LashIcon, VintageFlourish } from './DecorativeOrnament';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenAdmin, onOpenLookup }) => {
  return (
    <footer className="relative bg-[#080205] border-t border-stone-900 pt-16 pb-12 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-900">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <LashIcon className="w-6 h-6 text-[#FF8AD8]" />
              <span className="font-script text-3xl text-white tracking-wide">
                Gab Studio
              </span>
            </div>
            <p className="font-serif-luxury text-xs uppercase tracking-[0.2em] text-[#E6C280]">
              Especialista em Cílios por Gab Santos
            </p>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
              Estúdio boutique de extensão de cílios na Zona Norte de São Paulo. Visagismo, biossegurança rigorosa e alta retenção para destacar sua beleza única.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/gabstudio.lash"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 hover:border-[#FF2FA0] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram da Gab"
              >
                <Instagram className="w-4 h-4 text-[#FF2FA0]" />
              </a>
              <a
                href="https://wa.me/5511969530621"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 hover:border-[#25D366] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp da Gab"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-white text-sm font-medium uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <a href="#/" className="hover:text-[#FF8AD8] transition-colors">Início</a>
              </li>
              <li>
                <a href="#/sobre" className="hover:text-[#FF8AD8] transition-colors">Sobre a Gab</a>
              </li>
              <li>
                <a href="#/servicos" className="hover:text-[#FF8AD8] transition-colors">Procedimentos & Valores</a>
              </li>
              <li>
                <a href="#/galeria" className="hover:text-[#FF8AD8] transition-colors">Galeria de Resultados</a>
              </li>
              <li>
                <a href="#/depoimentos" className="hover:text-[#FF8AD8] transition-colors">Depoimentos</a>
              </li>
              <li>
                <a href="#/faq" className="hover:text-[#FF8AD8] transition-colors">Dúvidas Frequentes</a>
              </li>
              <li>
                <a href="#/contato" className="hover:text-[#FF8AD8] transition-colors">Localização</a>
              </li>
            </ul>
          </div>

          {/* Client & Admin Services */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display text-white text-sm font-medium uppercase tracking-wider">
              Serviços ao Cliente
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={onOpenBooking}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-[#FF2FA0]/50 text-xs text-white flex items-center justify-between transition-colors"
              >
                <span>Agendar Horário Online</span>
                <span className="text-[#FF8AD8] font-medium">Abrir</span>
              </button>

              <button
                onClick={onOpenLookup}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-[#FF2FA0]/50 text-xs text-stone-300 hover:text-white flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-[#FF2FA0]" />
                  <span>Consultar / Cancelar Agendamento</span>
                </div>
                <span className="text-stone-400">Ver</span>
              </button>

              <button
                onClick={onOpenAdmin}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-[#FF2FA0]/50 text-xs text-stone-300 hover:text-white flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#FF2FA0]" />
                  <span>Acesso Restrito da Gab (Painel Admin)</span>
                </div>
                <span className="text-stone-400">Entrar</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 font-light">
          <p>© {new Date().getFullYear()} Gab Studio. Todos os direitos reservados. Zona Norte, São Paulo/SP.</p>
          <div className="flex items-center gap-1">
            <span>Desenvolvido com carinho</span>
            <Heart className="w-3 h-3 text-[#FF2FA0] fill-[#FF2FA0]" />
            <span>para Gab Santos</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
