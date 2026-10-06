import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X, Shield, Search } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin, onOpenLookup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D0509]/90 backdrop-blur-md border-b border-[#FF2FA0]/20 py-3 shadow-lg shadow-black/50'
          : 'bg-gradient-to-b from-[#0D0509]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Brand wordmark */}
          <a
            href="#inicio"
            className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2FA0]"
          >
            <span className="font-script text-3xl sm:text-4xl text-white group-hover:text-[#FF8AD8] transition-colors tracking-wide neon-text-subtle">
              Gab Studio
            </span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-light tracking-wider text-stone-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#FF8AD8] hover:border-b hover:border-[#FF2FA0] pb-0.5 transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            {/* Appointment Lookup Button */}
            <button
              onClick={onOpenLookup}
              title="Consultar ou Cancelar Agendamento"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-stone-800 hover:border-[#FF2FA0]/40 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-[#FF2FA0]" />
              <span>Minha Reserva</span>
            </button>

            {/* Admin Portal Quick Access */}
            <button
              onClick={onOpenAdmin}
              title="Acesso da Gab Santos (Painel Admin)"
              className="text-stone-400 hover:text-[#FF8AD8] p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Acesso Administrativo"
            >
              <Shield className="w-4 h-4 text-[#FF2FA0]" />
            </button>

            {/* Main Booking CTA */}
            <button
              onClick={onOpenBooking}
              className="neon-button inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#FF2FA0]"
            >
              <Calendar className="w-4 h-4 text-[#FF8AD8]" />
              <span className="whitespace-nowrap tracking-wider">Agendar</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1A0A12]/98 border-b border-[#FF2FA0]/30 backdrop-blur-xl px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4 text-base font-light text-stone-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-800/80 hover:text-[#FF8AD8] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLookup();
                }}
                className="w-full py-2.5 px-4 text-sm rounded-lg border border-stone-700 text-stone-300 flex items-center justify-center gap-2 hover:border-[#FF2FA0]"
              >
                <Search className="w-4 h-4 text-[#FF2FA0]" />
                <span>Consultar Meu Agendamento</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-4 text-sm rounded-lg bg-stone-900 text-stone-300 flex items-center justify-center gap-2 border border-stone-800"
              >
                <Shield className="w-4 h-4 text-[#FF2FA0]" />
                <span>Painel da Gab (Admin)</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
