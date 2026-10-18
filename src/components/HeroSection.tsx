import React from 'react';
import { Star, MapPin, Compass, ArrowDown } from 'lucide-react';
import { BusinessSettings } from '../types/restaurant.ts';
import { SEAFOOD_ASSETS, buildCloudinaryUrl } from '../lib/cloudinary.ts';

interface HeroSectionProps {
  settings: BusinessSettings;
  onExploreMenu: () => void;
  onFindRestaurant: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onExploreMenu,
  onFindRestaurant,
}) => {
  const heroImageUrl = buildCloudinaryUrl(
    SEAFOOD_ASSETS.hero,
    { width: 1920, height: 1080, crop: 'fill', quality: 'auto', format: 'auto' },
    settings.cloudinaryCloudName
  );

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16 bg-[#0b1320]">
      {/* Background Image with Measured Scrim Overlay for AA Contrast */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageUrl}
          alt="Mediterranean seafood culinary presentation at La Casa De Joe"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Multilayer gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1320] via-[#0b1320]/75 to-[#0b1320]/50" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0b1320]/40 to-[#0b1320]/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Quiet Editorial Kicker with Unboxed Metadata */}
        <div className="inline-flex items-center gap-3 text-xs sm:text-sm tracking-widest uppercase font-medium text-[#c49756] mb-6">
          <span>Seafood Restaurant</span>
          <span aria-hidden="true" className="text-[#556984]">·</span>
          <span>Sala Al Jadida</span>
          <span aria-hidden="true" className="text-[#556984]">·</span>
          <span>Spanish & Mediterranean Traditions</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-editorial text-[#fbf8f2] tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto text-balance">
          {settings.heroHeadline || 'A Taste of the Mediterranean.'}
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#d4deeb] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {settings.heroSubheadline ||
            'Discover the flavors of the sea at La Casa De Joe. From sizzling gambas and crispy calamari to beautifully prepared seafood specialties, enjoy a Mediterranean-inspired dining experience in Sala Al Jadida.'}
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href={settings.glovoUrl || 'https://glovoapp.com/fr/ma/technopolis/stores/la-casa-de-joe-tec?utm_medium=organic&utm_campaign=google_reserve_place_order_action&utm_source=google'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#0b1320] bg-[#c49756] hover:bg-[#d4a86a] rounded transition-all duration-200 shadow-lg shadow-[#c49756]/20 cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <span>Order on Glovo</span>
            <Compass className="w-4 h-4 text-[#0b1320]" />
          </a>
          <a
            href={settings.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=La+Casa+De+Joe+Sala+Al+Jadida'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#f4efe6] bg-[#162238]/80 hover:bg-[#1f314f] border border-[#2c4161] rounded transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#c49756]" />
            <span>Find on Google Maps</span>
          </a>
        </div>

        {/* Quiet Social Proof & Verification Bar (Claim-to-Proof Adjacency) */}
        <div className="pt-8 border-t border-[#23354f]/60 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-[#a6b8d0]">
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-[#d4a86a]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? 'fill-[#d4a86a]' : 'fill-[#d4a86a]/60'}`}
                />
              ))}
            </div>
            <span className="font-semibold text-[#f4efe6] tabular-nums">
              {settings.googleRating.toFixed(1)} / 5
            </span>
            <span className="text-[#6d829e]">
              ({settings.googleReviewsCount} Google Reviews)
            </span>
          </div>

          <span aria-hidden="true" className="hidden sm:inline text-[#3a4d6b]">·</span>

          {/* Price Range */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#6d829e]">Reported:</span>
            <span className="font-medium text-[#f4efe6]">{settings.priceRange}</span>
          </div>

          <span aria-hidden="true" className="hidden sm:inline text-[#3a4d6b]">·</span>

          {/* Location */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#c49756]" />
            <span>Avenue Hassan II</span>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <button
        onClick={onExploreMenu}
        aria-label="Scroll down to menu"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#7f95b3] hover:text-[#f4efe6] transition-colors p-2 cursor-pointer"
      >
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};
