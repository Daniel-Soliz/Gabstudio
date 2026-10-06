import React, { useState, useEffect } from 'react';
import { CalendarDays, Menu, X, Search, Home, Eye, Images, Heart, HelpCircle, MapPin, UserRound } from 'lucide-react';
import { EyeLogo } from './DecorativeOrnament';

type PublicPage = 'home' | 'sobre' | 'servicos' | 'galeria' | 'depoimentos' | 'faq' | 'contato';

interface NavbarProps {
  activePage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenBooking,
  onOpenAdmin,
  onOpenLookup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links: Array<{ label: string; page: PublicPage; icon: React.ComponentType<{ className?: string }> }> = [
    { label: 'INÍCIO', page: 'home', icon: Home },
    { label: 'SOBRE', page: 'sobre', icon: UserRound },
    { label: 'SERVIÇOS', page: 'servicos', icon: Eye },
    { label: 'GALERIA', page: 'galeria', icon: Images },
    { label: 'DEPOIMENTOS', page: 'depoimentos', icon: Heart },
    { label: 'FAQ', page: 'faq', icon: HelpCircle },
    { label: 'CONTATO', page: 'contato', icon: MapPin },
  ];

  const go = (page: PublicPage) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className={`gs-header fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="gs-header-inner">
        <button
          type="button"
          onClick={() => go('home')}
          className="gs-brand"
          aria-label="Ir para o início"
        >
          <div className="gs-brand-mark" aria-hidden="true">
            <EyeLogo className="w-full h-full" />
          </div>
          <div className="gs-brand-copy">
            <div className="gs-brand-name">Gab Studio</div>
            <div className="gs-brand-subtitle">LASH DESIGNER · ZONA NORTE SP</div>
          </div>
        </button>

        <nav className="gs-desktop-nav" aria-label="Navegação principal">
          {links.map(({ label, page }) => (
            <button
              key={page}
              type="button"
              onClick={() => go(page)}
              className={`gs-nav-link ${activePage === page ? 'is-active' : ''}`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="gs-header-actions">
          <button
            type="button"
            onClick={onOpenLookup}
            className="gs-btn gs-btn-secondary gs-reservation-btn"
          >
            <Search className="w-4 h-4" />
            <span>Minha reserva</span>
          </button>

          <button
            type="button"
            onClick={onOpenBooking}
            className="gs-btn gs-btn-primary"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Agendar</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="gs-admin-heart"
            aria-label="Área administrativa"
            title="Área administrativa"
          >
            <Heart className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="gs-mobile-toggle"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="gs-mobile-menu">
          <div className="gs-mobile-menu-grid">
            {links.map(({ label, page, icon: Icon }) => (
              <button
                key={page}
                type="button"
                onClick={() => go(page)}
                className={`gs-mobile-menu-item ${activePage === page ? 'is-active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="gs-mobile-menu-actions">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookup();
              }}
              className="gs-btn gs-btn-secondary"
            >
              <Search className="w-4 h-4" />
              Minha reserva
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="gs-btn gs-btn-primary"
            >
              <CalendarDays className="w-4 h-4" />
              Agendar
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="gs-admin-link"
          >
            Acesso administrativo
          </button>
        </div>
      )}
    </header>
  );
};
