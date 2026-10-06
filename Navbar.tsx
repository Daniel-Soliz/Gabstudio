import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Menu, X, Shield, Search, Home, Eye, Images, Heart, HelpCircle, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin, onOpenLookup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Início', path: '/', icon: Home },
    { label: 'Sobre', path: '/sobre', icon: Heart },
    { label: 'Serviços', path: '/servicos', icon: Eye },
    { label: 'Galeria', path: '/galeria', icon: Images },
    { label: 'Depoimentos', path: '/depoimentos', icon: Heart },
    { label: 'FAQ', path: '/faq', icon: HelpCircle },
    { label: 'Contato', path: '/contato', icon: MapPin },
  ];

  const go = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0D0509]/95 backdrop-blur-xl border-b border-[#FF2FA0]/20 shadow-xl shadow-black/30 py-2' : 'bg-[#0D0509]/92 backdrop-blur-md border-b border-[#FF8AD8]/10 py-2.5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <button type="button" onClick={() => go('/')} className="flex items-center gap-3 min-w-0 text-left">
          <div className="w-10 h-10 rounded-2xl border border-[#FF2FA0]/30 bg-[#1C0B15] flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-[#FF8AD8]" />
          </div>
          <div className="min-w-0">
            <div className="font-script text-2xl sm:text-3xl text-white leading-none whitespace-nowrap">Gab Studio</div>
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#E6C280] mt-1 truncate">Lash Designer · Zona Norte SP</div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-5">
          {links.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `text-xs uppercase tracking-wider font-medium transition-colors relative py-2 ${isActive ? 'text-[#FF8AD8]' : 'text-stone-300 hover:text-white'}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={onOpenLookup} className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#FF8AD8]/15 bg-[#160A12] text-xs text-stone-300 hover:text-white hover:border-[#FF2FA0]/40 transition-colors">
            <Search className="w-4 h-4 text-[#FF8AD8]" />
            Minha reserva
          </button>
          <button onClick={onOpenBooking} className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#FF2FA0] hover:bg-[#ff45aa] text-white text-xs font-semibold shadow-lg shadow-[#FF2FA0]/20">
            <Calendar className="w-4 h-4" />
            <span className="hidden xs:inline">Agendar</span>
          </button>
          <button onClick={onOpenAdmin} className="p-2 rounded-full text-stone-500 hover:text-[#FF8AD8]" title="Área administrativa">
            <Shield className="w-4 h-4" />
          </button>
          <button onClick={() => setMobileMenuOpen(v => !v)} className="lg:hidden p-2 rounded-xl border border-[#FF8AD8]/15 bg-[#160A12] text-stone-300" aria-label="Abrir menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-4 border-t border-[#FF8AD8]/10 bg-[#0D0509]/98 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            {links.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                type="button"
                onClick={() => go(path)}
                className="flex items-center gap-3 text-left p-3 rounded-2xl border border-[#FF8AD8]/10 bg-[#160A12] hover:border-[#FF2FA0]/35"
              >
                <div className="w-9 h-9 rounded-xl bg-[#24101C] border border-[#FF8AD8]/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#FF8AD8]" />
                </div>
                <span className="text-xs font-medium text-stone-200">{label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button onClick={() => { setMobileMenuOpen(false); onOpenLookup(); }} className="p-3 rounded-2xl border border-stone-800 bg-stone-900/60 text-xs text-stone-300 flex items-center justify-center gap-2">
              <Search className="w-4 h-4 text-[#FF8AD8]" /> Minha reserva
            </button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} className="p-3 rounded-2xl bg-[#FF2FA0] text-xs font-semibold text-white flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> Agendar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
