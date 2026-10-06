import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { HowItWorks } from './components/HowItWorks';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AftercareSection } from './components/AftercareSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsapp } from './components/FloatingWhatsapp';
import { BookingModal } from './components/BookingModal';
import { AdminModal } from './components/admin/AdminModal';
import { AppointmentLookupModal } from './components/AppointmentLookupModal';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  // Check URL hash for direct links like #admin or #agendar
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsAdminOpen(true);
      } else if (hash === '#agendar') {
        setIsBookingOpen(true);
      } else if (hash === '#minha-reserva') {
        setIsLookupOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenBooking = (serviceId?: string) => {
    setPreselectedServiceId(serviceId || null);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0509] text-stone-100 flex flex-col font-sans-clean selection:bg-[#FF2FA0] selection:text-white">
      {/* Fixed Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* Main Single-Page Sections */}
      <main className="flex-1">
        <Hero onOpenBooking={() => handleOpenBooking()} />
        <About />
        <ServicesSection onSelectService={(id) => handleOpenBooking(id)} />
        <GallerySection />
        <HowItWorks />
        <TestimonialsSection />
        <AftercareSection />
        <FaqSection />
        <ContactSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* Floating Pulsing WhatsApp Button */}
      <FloatingWhatsapp />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setPreselectedServiceId(null);
        }}
        preselectedServiceId={preselectedServiceId}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', ' ');
          }
        }}
      />

      <AppointmentLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />
    </div>
  );
}
