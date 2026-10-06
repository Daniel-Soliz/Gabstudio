import React, { useEffect, useState } from 'react';
import { CalendarDays, Images, Heart, ArrowRight, Eye, UserRound } from 'lucide-react';
import { Navbar } from './Navbar';
import { About } from './About';
import { ServicesSection } from './ServicesSection';
import { GallerySection } from './GallerySection';
import { TestimonialsSection } from './TestimonialsSection';
import { AftercareSection } from './AftercareSection';
import { FaqSection } from './FaqSection';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { FloatingWhatsapp } from './FloatingWhatsapp';
import { BookingModal } from './BookingModal';
import { AdminModal } from './AdminModal';
import { AppointmentLookupModal } from './AppointmentLookupModal';
import { ASSETS } from './storage';
import { LashIcon } from './DecorativeOrnament';

type PublicPage = 'home' | 'sobre' | 'servicos' | 'galeria' | 'depoimentos' | 'faq' | 'contato';

const PAGE_PATHS: Record<PublicPage, string> = {
  home: '/',
  sobre: '/sobre',
  servicos: '/servicos',
  galeria: '/galeria',
  depoimentos: '/depoimentos',
  faq: '/faq',
  contato: '/contato',
};

function pageFromHash(): PublicPage {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0].replace(/^\/+|\/+$/g, '');
  if (
    raw === 'sobre' ||
    raw === 'servicos' ||
    raw === 'galeria' ||
    raw === 'depoimentos' ||
    raw === 'faq' ||
    raw === 'contato'
  ) {
    return raw;
  }
  return 'home';
}

class PageErrorBoundary extends React.Component<
  { children: React.ReactNode; onHome: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Gab Studio page error:', error);
  }

  componentDidUpdate(prevProps: { children: React.ReactNode; onHome: () => void }) {
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="min-h-[60vh] flex items-center justify-center px-4 py-12 bg-[#F8F3EC]">
          <div className="w-full max-w-xl rounded-[28px] border border-[#D9C3AE] bg-[#FFF9F3] p-7 sm:p-9 text-center">
            <Eye className="w-10 h-10 text-[#B86F4C] mx-auto" />
            <h1 className="font-display text-3xl text-[#30231F] mt-4">Esta área está sendo atualizada</h1>
            <p className="text-sm text-[#78665D] mt-3 leading-relaxed">
              O restante do site continua disponível. Volte ao início e escolha outra opção.
            </p>
            <button
              type="button"
              onClick={this.props.onHome}
              className="mt-6 min-h-[46px] px-6 rounded-[14px] bg-[#B86F4C] text-[#FFF9F3] font-semibold text-sm hover:bg-[#3B2923] transition-colors"
            >
              Voltar ao início
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

interface PageShellProps {
  children: React.ReactNode;
  activePage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

const PageShell: React.FC<PageShellProps> = ({
  children,
  activePage,
  onNavigate,
  onOpenBooking,
  onOpenAdmin,
  onOpenLookup,
}) => (
  <div className="min-h-screen bg-[#F8F3EC] text-[#30231F] font-sans-clean">
    <Navbar
      activePage={activePage}
      onNavigate={onNavigate}
      onOpenBooking={onOpenBooking}
      onOpenAdmin={onOpenAdmin}
      onOpenLookup={onOpenLookup}
    />
    <main className="gs-main-shell min-h-[calc(100vh-80px)]">{children}</main>
    <Footer onOpenBooking={onOpenBooking} onOpenAdmin={onOpenAdmin} onOpenLookup={onOpenLookup} />
    <FloatingWhatsapp />
  </div>
);

function HomePage({
  onOpenBooking,
  onNavigate,
}: {
  onOpenBooking: () => void;
  onNavigate: (page: PublicPage) => void;
}) {
  const cards: Array<{
    title: string;
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    page: PublicPage;
  }> = [
    { title: 'Serviços', text: 'Técnicas, duração e valores.', icon: Eye, page: 'servicos' },
    { title: 'Galeria', text: 'Veja referências de resultados e estilos.', icon: Images, page: 'galeria' },
    { title: 'Sobre a Gab', text: 'Conheça a proposta de trabalho e atendimento.', icon: UserRound, page: 'sobre' },
    { title: 'Depoimentos', text: 'Veja experiências de clientes.', icon: Heart, page: 'depoimentos' },
  ];

  return (
    <section className="gs-home">
      <div className="gs-home-container">
        <div className="gs-home-grid">
          <article className="gs-hero">
            <img
              src={ASSETS.hero}
              alt="Mulher com destaque para olhos e cílios"
              className="gs-hero-image"
            />
            <div className="gs-hero-overlay" />

            <div className="gs-hero-content">
              <p className="gs-hero-kicker">GAB STUDIO · LASH DESIGNER</p>
              <h1 className="gs-hero-title">
                Seu olhar,
                <br />
                <em>em destaque</em>
              </h1>
              <div className="gs-hero-divider" />
              <button type="button" onClick={onOpenBooking} className="gs-hero-cta">
                <CalendarDays className="w-5 h-5" />
                <span>Agendar meu horário</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </article>

          <div className="gs-home-actions">
            <button type="button" onClick={onOpenBooking} className="gs-booking-card">
              <div className="gs-booking-decoration" aria-hidden="true">
                <LashIcon className="w-full h-full" />
              </div>

              <div className="gs-card-icon gs-card-icon-large">
                <CalendarDays className="w-6 h-6" />
              </div>

              <div className="gs-booking-copy">
                <h2>Agendar horário</h2>
                <p>Escolha técnica, data e horário.</p>
              </div>

              <span className="gs-card-arrow gs-card-arrow-filled" aria-hidden="true">
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>

            <div className="gs-secondary-grid">
              {cards.map(({ title, text, icon: Icon, page }) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => onNavigate(page)}
                  className={`gs-feature-card gs-feature-card-${page}`}
                >
                  <div className="gs-card-icon">
                    <Icon className="w-5 h-5" />
                  </div>

                  {page === 'galeria' && (
                    <div className="gs-gallery-polaroids" aria-hidden="true">
                      <span className="gs-polaroid gs-polaroid-one">
                        <img src={ASSETS.foxEyes} alt="" />
                      </span>
                      <span className="gs-polaroid gs-polaroid-two">
                        <img src={ASSETS.russianVolume} alt="" />
                      </span>
                    </div>
                  )}

                  {page === 'depoimentos' && (
                    <div className="gs-quote-decoration" aria-hidden="true">“</div>
                  )}

                  <div className="gs-feature-copy">
                    <h2>{title}</h2>
                    <p>{text}</p>
                  </div>

                  <span className="gs-card-arrow" aria-hidden="true">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PublicPage>(() => pageFromHash());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      setActivePage(pageFromHash());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('hashchange', onHashChange);
    onHashChange();

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (page: PublicPage) => {
    const nextHash = `#${PAGE_PATHS[page]}`;

    if (window.location.hash === nextHash) {
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      window.location.hash = nextHash;
    }
  };

  const openBooking = (serviceId?: string) => {
    setPreselectedServiceId(serviceId || null);
    setIsBookingOpen(true);
  };

  let pageContent: React.ReactNode;

  switch (activePage) {
    case 'sobre':
      pageContent = <About />;
      break;
    case 'servicos':
      pageContent = <ServicesSection onSelectService={(id) => openBooking(id)} />;
      break;
    case 'galeria':
      pageContent = <GallerySection />;
      break;
    case 'depoimentos':
      pageContent = <TestimonialsSection />;
      break;
    case 'faq':
      pageContent = (
        <>
          <FaqSection />
          <AftercareSection />
        </>
      );
      break;
    case 'contato':
      pageContent = <ContactSection onOpenBooking={() => openBooking()} />;
      break;
    default:
      pageContent = <HomePage onOpenBooking={() => openBooking()} onNavigate={navigate} />;
  }

  return (
    <>
      <PageShell
        activePage={activePage}
        onNavigate={navigate}
        onOpenBooking={() => openBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
      >
        <PageErrorBoundary key={activePage} onHome={() => navigate('home')}>
          {pageContent}
        </PageErrorBoundary>
      </PageShell>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setPreselectedServiceId(null);
        }}
        preselectedServiceId={preselectedServiceId}
      />

      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <AppointmentLookupModal isOpen={isLookupOpen} onClose={() => setIsLookupOpen(false)} />
    </>
  );
}
