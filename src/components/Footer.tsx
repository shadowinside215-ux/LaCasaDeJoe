import React from 'react';
import { MapPin, Phone, Instagram, ShoppingBag, ArrowUpRight, Compass } from 'lucide-react';
import { BusinessSettings } from '../types/restaurant.ts';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (id: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
}) => {
  const currentYear = new Date().getFullYear();
  const googleMapsDirectionsUrl = settings.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=La+Casa+De+Joe+Sala+Al+Jadida`;

  return (
    <footer className="bg-[#070d17] text-[#9db2ce] border-t border-[#18263a] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand & Introduction Column (4 cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  alt={`${settings.name} Logo`}
                  className="h-10 w-auto max-w-[120px] object-contain rounded"
                />
              )}
              <div className="flex items-center gap-2">
                <span className="font-editorial italic font-normal text-3xl text-[#c49756]">La</span>
                <span className="font-editorial text-2xl tracking-wider uppercase font-semibold text-[#fbf8f2]">
                  Casa De Joe
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-[#8fa5c2] leading-relaxed mb-6 max-w-sm">
              A premium seafood restaurant in Sala Al Jadida, Morocco. Serving authentic Spanish-inspired dishes, sizzling gambas al ajillo, fresh calamari, and sharing platters with warm hospitality.
            </p>

            {/* Quick Badges */}
            <div className="text-xs text-[#c49756] font-medium flex items-center gap-3">
              <span>Google 4.8 / 5 Rating</span>
              <span aria-hidden="true" className="text-[#3b4f6b]">·</span>
              <span>82 Verified Reviews</span>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest text-[#fbf8f2] font-semibold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8fa5c2]">
              <li>
                <button
                  onClick={() => onNavigate('#menu')}
                  className="hover:text-[#fbf8f2] transition-colors cursor-pointer"
                >
                  Menu & Glovo Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#story')}
                  className="hover:text-[#fbf8f2] transition-colors cursor-pointer"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#reviews')}
                  className="hover:text-[#fbf8f2] transition-colors cursor-pointer"
                >
                  Guest Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#location')}
                  className="hover:text-[#fbf8f2] transition-colors cursor-pointer"
                >
                  Location & Map
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-[#fbf8f2] font-semibold mb-4">
              Address & Reservations
            </h4>
            <div className="space-y-3 text-xs text-[#8fa5c2]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c49756] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {settings.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c49756] shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="hover:text-[#fbf8f2] transition-colors tabular-nums font-medium text-[#d4deeb]"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] text-[#7187a4]">
                <Compass className="w-4 h-4 text-[#c49756] shrink-0" />
                <span>Plus Code: {settings.googleMapsPlusCode}</span>
              </div>
            </div>
          </div>

          {/* Ordering & Connect (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-[#fbf8f2] font-semibold mb-4">
              Online Ordering & Social
            </h4>
            <div className="space-y-2.5">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 bg-[#101b2a] hover:bg-[#16253b] text-xs text-[#cbd7e6] rounded border border-[#1f314c] transition-colors"
              >
                <span>Google Maps Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#c49756]" />
              </a>

              {settings.glovoUrl ? (
                <a
                  href={settings.glovoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-[#e9aa37]/15 hover:bg-[#e9aa37]/25 text-xs text-[#f5bd56] font-medium rounded border border-[#e9aa37]/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Glovo Delivery</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="p-2.5 bg-[#101b2a] text-[11px] text-[#6d84a1] rounded border border-[#1a283c]">
                  Glovo delivery available locally
                </div>
              )}

              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-[#101b2a] hover:bg-[#16253b] text-xs text-[#cbd7e6] rounded border border-[#1f314c] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-[#c49756]" />
                    <span>Instagram</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#18263a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#627794]">
          <div>
            © {currentYear} La Casa De Joe. All rights reserved. Seafood Restaurant · Sala Al Jadida, Morocco.
          </div>

          <div className="flex items-center gap-4">
            <span>Dine-in & Online Delivery</span>
            <span aria-hidden="true" className="text-[#2b3d56]">·</span>
            <span>Sala Al Jadida, Morocco</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
