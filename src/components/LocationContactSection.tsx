import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Navigation, Instagram, ShoppingBag, ExternalLink, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../types/restaurant.ts';

interface LocationContactSectionProps {
  settings: BusinessSettings;
}

export const LocationContactSection: React.FC<LocationContactSectionProps> = ({ settings }) => {
  const cleanPhone = settings.phone.replace(/\s+/g, '');
  const googleMapsDirectionsUrl = settings.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=La+Casa+De+Joe+Sala+Al+Jadida`;

  return (
    <section id="location" className="py-24 bg-[#0a111c] border-t border-[#18273d] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c49756] font-medium mb-3">
            <Navigation className="w-3.5 h-3.5" />
            <span>Visit Us in Sala Al Jadida</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-[#fbf8f2] tracking-tight mb-4">
            Location & Contact
          </h2>
          <p className="text-[#a0b3cc] text-base leading-relaxed">
            Conveniently situated along Avenue Hassan II. Join us for a delightful dine-in seafood meal or place an order via Glovo.
          </p>
        </motion.div>

        {/* 2-Column Grid: Contact Information & Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Information Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Address Card */}
            <div className="bg-[#101927] border border-[#1d2d44] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#152338] text-[#c49756] rounded-md shrink-0 border border-[#233854]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-editorial text-[#fbf8f2] mb-1">
                    Restaurant Address
                  </h3>
                  <p className="text-sm text-[#cbd7e6] leading-relaxed mb-3">
                    {settings.address}
                  </p>
                  
                  {/* Google Maps Plus Code */}
                  <div className="text-xs text-[#8ca1bd] flex items-center gap-2 pt-2 border-t border-[#1a283c]">
                    <span className="font-semibold text-[#c49756]">Plus Code:</span>
                    <span className="font-mono bg-[#162336] px-2 py-0.5 rounded text-[#e0ebf7]">
                      {settings.googleMapsPlusCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#1a283c]">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Telephone & Reservation Call */}
            <div className="bg-[#101927] border border-[#1d2d44] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#152338] text-[#c49756] rounded-md shrink-0 border border-[#233854]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-editorial text-[#fbf8f2] mb-1">
                    Telephone & Orders
                  </h3>
                  <p className="text-xs text-[#8ca1bd] mb-2">
                    Call directly for table inquiries and dish questions:
                  </p>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-lg font-bold text-[#d4a86a] hover:text-[#fbf8f2] transition-colors tabular-nums tracking-wide inline-block"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Service & Hours */}
            <div className="bg-[#101927] border border-[#1d2d44] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#152338] text-[#c49756] rounded-md shrink-0 border border-[#233854]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-editorial text-[#fbf8f2] mb-1">
                    Service Hours
                  </h3>
                  <p className="text-sm text-[#cbd7e6] mb-1">
                    Reported closing time: <span className="font-semibold text-[#fbf8f2]">{settings.closingTime}</span>
                  </p>
                  <p className="text-xs text-[#7e93ad] italic leading-relaxed">
                    {settings.scheduleNote}
                  </p>
                  <div className="mt-3 text-xs text-[#9bb0ca] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#c49756]" />
                    <span>Dine-in service available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* External Connections: Glovo & Instagram */}
            <div className="p-6 bg-[#131f32] border border-[#22354e] rounded-lg space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-[#c49756] font-semibold">
                Online Ordering & Social Media
              </h4>

              {/* Glovo Ordering Callout */}
              {settings.glovoUrl ? (
                <a
                  href={settings.glovoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3.5 bg-[#e9aa37] hover:bg-[#f5b84a] text-[#0b1320] rounded-md transition-colors font-semibold text-xs uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order on Glovo Delivery</span>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="p-3 bg-[#17253a] border border-[#243954] rounded-md text-xs text-[#8ca1bd]">
                  <div className="flex items-center gap-2 font-medium text-[#f4efe6] mb-1">
                    <ShoppingBag className="w-4 h-4 text-[#e9aa37]" />
                    <span>Glovo Ordering Available</span>
                  </div>
                  <p className="text-[11px] text-[#7187a4]">
                    The restaurant has an active Glovo presence. The exact listing URL can be configured directly in the Admin Dashboard.
                  </p>
                </div>
              )}

              {/* Instagram */}
              {settings.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 bg-[#1c2c43] hover:bg-[#253a58] text-[#f4efe6] border border-[#2c4363] rounded-md transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-[#d4a86a]" />
                    <span>Follow @la_casa_de_joe on Instagram</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#8ea3c0]" />
                </a>
              ) : (
                <div className="p-3 bg-[#17253a] border border-[#243954] rounded-md text-xs text-[#8ca1bd]">
                  <div className="flex items-center gap-2 font-medium text-[#f4efe6] mb-1">
                    <Instagram className="w-4 h-4 text-[#d4a86a]" />
                    <span>Instagram Profile</span>
                  </div>
                  <p className="text-[11px] text-[#7187a4]">
                    Instagram handle link can be updated from the Admin panel.
                  </p>
                </div>
              )}
            </div>

          </motion.div>

          {/* Interactive Map Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="bg-[#101927] border border-[#1d2d44] rounded-lg overflow-hidden shadow-xl">
              
              <div className="p-4 bg-[#142133] border-b border-[#1d2d44] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#c49756]">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold text-[#f4efe6]">Sala Al Jadida, Morocco</span>
                </div>
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9bb0ca] hover:text-[#f4efe6] flex items-center gap-1"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Embedded Google Maps Frame */}
              <div className="relative w-full h-[460px] bg-[#0c1421]">
                <iframe
                  title="La Casa De Joe Location Map"
                  src={`https://maps.google.com/maps?q=La+Casa+De+Joe,+Sala+Al+Jadida&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'contrast(1.05) saturate(0.9)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="p-4 bg-[#121c2d] text-xs text-[#7f95b3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-[#1d2d44]">
                <div>
                  <span className="font-medium text-[#c49756]">Address:</span> Immeuble C, Résidence Romana 3, Magasin 11, Avenue Hassan II
                </div>
                <div className="shrink-0 text-[#677e9b]">
                  Sala Al Jadida 11000
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
