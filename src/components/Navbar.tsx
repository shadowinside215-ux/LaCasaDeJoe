import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Utensils, Shield, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../lib/authContext.tsx';
import { BusinessSettings } from '../types/restaurant.ts';

interface NavbarProps {
  settings: BusinessSettings;
  activeView: 'site' | 'admin';
  setActiveView: (view: 'site' | 'admin') => void;
  onExploreMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeView,
  setActiveView,
  onExploreMenu
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Menu & Ordering', href: '#menu' },
    { label: 'Our Story', href: '#story' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Location & Map', href: '#location' },
  ];

  const handleNavClick = (href: string) => {
    if (activeView === 'admin') {
      setActiveView('site');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b1320]/95 backdrop-blur-md border-b border-[#22334d]/60 py-3 shadow-lg shadow-black/30'
          : 'bg-gradient-to-b from-[#0b1320]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => {
              setActiveView('site');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group text-left text-xl sm:text-2xl font-bold tracking-tight text-[#f4efe6] hover:text-[#d4a86a] transition-colors whitespace-nowrap shrink-0 flex items-center gap-3 cursor-pointer"
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={`${settings.name} Logo`}
                className="h-10 sm:h-11 w-auto max-w-[120px] object-contain rounded"
              />
            ) : null}
            <div className="flex items-center gap-2">
              <span className="font-editorial italic font-normal text-2xl sm:text-3xl text-[#c49756]">La</span>
              <span className="font-editorial tracking-wider uppercase font-semibold">Casa De Joe</span>
            </div>
          </button>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#c4d1e2] tracking-wide">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="hover:text-[#f4efe6] hover:underline underline-offset-8 decoration-[#c49756] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Admin Affordance */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Phone quick call (desktop) */}
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="hidden md:inline-flex items-center gap-2 text-xs text-[#a0b3cc] hover:text-[#f4efe6] transition-colors px-2.5 py-1.5"
              title="Call restaurant"
            >
              <Phone className="w-3.5 h-3.5 text-[#c49756]" />
              <span className="tabular-nums font-medium">{settings.phone}</span>
            </a>

            {/* Admin Switcher (Hidden in public site view) */}
            {activeView === 'admin' && (
              <button
                onClick={() => setActiveView('site')}
                className="p-2 rounded-md transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-[#c49756] text-[#0b1320]"
                title="Exit Admin"
              >
                <Shield className="w-4 h-4" />
                <span className="whitespace-nowrap">Exit Admin</span>
              </button>
            )}

            {/* Primary Action Button: Direct Glovo Ordering */}
            {activeView === 'site' ? (
              <a
                href={settings.glovoUrl || 'https://glovoapp.com/fr/ma/technopolis/stores/la-casa-de-joe-tec?utm_medium=organic&utm_campaign=google_reserve_place_order_action&utm_source=google'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0b1320] bg-gradient-to-r from-[#d4a86a] to-[#c49756] hover:from-[#e0b77b] hover:to-[#d4a86a] rounded transition-all shadow-md hover:shadow-[#c49756]/20 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Order on Glovo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={() => setActiveView('site')}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#f4efe6] bg-[#1a2942] hover:bg-[#233757] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                View Website
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#c4d1e2] hover:text-[#f4efe6] rounded-md hover:bg-[#162238] transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#22334d]/80 pb-4 bg-[#0b1320]/95 backdrop-blur-md rounded-b-lg">
            <div className="flex flex-col gap-2.5 px-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left py-2 px-3 text-sm font-medium text-[#c4d1e2] hover:text-[#f4efe6] hover:bg-[#162238] rounded transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-2 border-t border-[#22334d]/50 flex flex-col gap-2">
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 py-2 px-3 text-xs text-[#d4a86a] font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: {settings.phone}</span>
                </a>

                {settings.glovoUrl && (
                  <a
                    href={settings.glovoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-2 px-3 bg-[#e9aa37]/10 text-[#f5bd56] text-xs font-semibold rounded hover:bg-[#e9aa37]/20"
                  >
                    <span>Order on Glovo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
