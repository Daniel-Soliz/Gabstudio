import React, { useEffect, useState } from 'react';
import { CalendarDays, Sparkles, Images, Heart, HelpCircle, MapPin, ArrowUpRight, Eye, UserRound } from 'lucide-react';
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
  if (raw === 'sobre' || raw === 'servicos' || raw === 'galeria' || raw === 'depoimentos' || raw === 'faq' || raw === 'contato') {
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
        <section className="min-h-[60vh] flex items-center justify-center px-4 py-12 bg-[#0D0509]">
          <div className="w-full max-w-xl rounded-[28px] border border-[#FF2FA0]/25 bg-[#160A12] p-7 sm:p-9 text-center">
            <Eye className="w-10 h-10 text-[#FF8AD8] mx-auto" />
            <h1 className="font-display text-2xl sm:text-3xl text-white mt-4">Esta área está sendo atualizada</h1>
            <p className="text-sm text-stone-400 mt-3 leading-relaxed">
              O restante do site continua disponível. Volte ao início e escolha outra opção.
            </p>
            <button
              type="button"
              onClick={this.props.onHome}
              className="mt-6 min-h-[46px] px-6 rounded-full bg-[#FF2FA0] text-white font-semibold text-sm"
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
  <div className="min-h-screen bg-[#0D0509] text-stone-100 font-sans-clean selection:bg-[#FF2FA0] selection:text-white">
    <Navbar
      activePage={activePage}
      onNavigate={onNavigate}
      onOpenBooking={onOpenBooking}
      onOpenAdmin={onOpenAdmin}
      onOpenLookup={onOpenLookup}
    />
    <main className="pt-[82px] sm:pt-[92px] min-h-[calc(100vh-80px)]">
      {children}
    </main>
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
    page?: PublicPage;
    action?: () => void;
  }> = [
    { title: 'Agendar horário', text: 'Escolha técnica, data e horário.', icon: CalendarDays, action: onOpenBooking },
    { title: 'Serviços', text: 'Técnicas, duração e valores.', icon: Eye, page: 'servicos' },
    { title: 'Galeria', text: 'Veja referências de resultados e estilos.', icon: Images, page: 'galeria' },
    { title: 'Sobre a Gab', text: 'Conheça a proposta de trabalho e atendimento.', icon: UserRound, page: 'sobre' },
    { title: 'Depoimentos', text: 'Veja como a prova social pode aparecer no site.', icon: Heart, page: 'depoimentos' },
    { title: 'Dúvidas', text: 'Cuidados, manutenção e perguntas frequentes.', icon: HelpCircle, page: 'faq' },
    { title: 'Contato', text: 'WhatsApp, localização e horários.', icon: MapPin, page: 'contato' },
  ];

  return (
    <div className="min-h-[calc(100vh-82px)] bg-[#0D0509] px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-4 lg:gap-6 items-stretch">
          <section className="relative min-h-[320px] sm:min-h-[420px] overflow-hidden rounded-[28px] border border-[#FF8AD8]/20 bg-[#160A12]">
            <img
              src={ASSETS.hero}
              alt="Gab Studio extensão de cílios"
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0509] via-[#0D0509]/55 to-[#140810]/20" />
            <div className="relative h-full min-h-[320px] sm:min-h-[420px] p-6 sm:p-8 lg:p-10 flex flex-col justify-end">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#FFD1EA] font-medium">
                <Sparkles className="w-4 h-4 text-[#FF2FA0]" />
                Gab Studio · Lash Designer
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95] mt-4 max-w-xl">
                Seu olhar,<br />
                <span className="font-script text-[#FF8AD8] normal-case">sua assinatura.</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed">
                Uma experiência feminina, prática e profissional para escolher seu procedimento e agendar sem perder tempo.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 sm:gap-4 content-start">
            {cards.map((card, index) => {
              const Icon = card.icon;
              const large = index === 0;
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => {
                    if (card.action) card.action();
                    else if (card.page) onNavigate(card.page);
                  }}
                  className={`group text-left relative overflow-hidden rounded-[22px] border transition-all duration-300 p-4 sm:p-5 min-h-[145px] sm:min-h-[168px] ${large ? 'col-span-2 bg-gradient-to-br from-[#FF2FA0]/20 via-[#26101E] to-[#160A12] border-[#FF2FA0]/45' : 'bg-[#160A12] border-[#FF8AD8]/15 hover:border-[#FF2FA0]/45'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border ${large ? 'bg-[#FF2FA0] border-[#FF8AD8] text-white' : 'bg-[#24101C] border-[#FF8AD8]/20 text-[#FF8AD8]'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-[#FF8AD8] transition-colors" />
                  </div>
                  <div className="mt-4">
                    <h2 className="font-display text-lg sm:text-xl text-white">{card.title}</h2>
                    <p className="text-[11px] sm:text-xs text-stone-400 mt-1 leading-relaxed">{card.text}</p>
                  </div>
                </button>
              );
            })}
          </section>
        </div>
      </div>
    </div>
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
