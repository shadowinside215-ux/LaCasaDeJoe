import React from 'react';
import { Anchor, Waves, Users, HeartHandshake, Star } from 'lucide-react';
import { BusinessSettings } from '../types/restaurant.ts';

interface StorySectionProps {
  settings: BusinessSettings;
}

export const StorySection: React.FC<StorySectionProps> = ({ settings }) => {
  const pillars = [
    {
      icon: Anchor,
      title: 'Ocean Fresh Seafood',
      description: 'Carefully selected fresh catches and shellfish, prepared with respect for authentic maritime flavors.',
    },
    {
      icon: Waves,
      title: 'Spanish Traditions',
      description: 'Inspired by coastal Iberian recipes, seasoned with extra virgin olive oil, garlic, and Mediterranean spices.',
    },
    {
      icon: Users,
      title: 'Platters to Share',
      description: 'Generous seafood servings and culinary delights designed for family and friends gathering together.',
    },
    {
      icon: HeartHandshake,
      title: 'Warm Hospitality',
      description: 'A welcoming, cozy atmosphere with thoughtful service in the heart of Sala Al Jadida.',
    },
  ];

  return (
    <section id="story" className="py-24 bg-[#0a111c] border-t border-[#18263a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Balanced Editorial Layout (No stock pictures) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Editorial Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f1a2c] border border-[#22354f] rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c49756]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="text-xs uppercase tracking-widest text-[#c49756] font-semibold mb-3">
                Established in Sala Al Jadida
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="font-editorial italic font-normal text-3xl text-[#c49756]">La</span>
                <span className="font-editorial text-2xl tracking-wider uppercase font-semibold text-[#fbf8f2]">
                  Casa De Joe
                </span>
              </div>

              <blockquote className="text-base text-[#d1e0f2] font-editorial italic leading-relaxed mb-8">
                "Where the flavors of the sea meet the warmth of Mediterranean hospitality. A welcoming place to gather around good food and enjoy a memorable meal."
              </blockquote>

              <div className="pt-6 border-t border-[#1e2f47] space-y-3">
                <div className="flex items-center gap-2 text-[#d4a86a]">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#d4a86a]" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-[#f4efe6] tabular-nums">
                    {settings.googleRating.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="text-xs text-[#8ca2be]">
                  Based on {settings.googleReviewsCount} verified Google reviews · Immeuble C, Résidence Romana 3
                </div>
              </div>
            </div>
          </div>

          {/* Right Text & Pillars */}
          <div className="lg:col-span-7">
            <div className="text-xs uppercase tracking-widest text-[#c49756] font-medium mb-3">
              Our Culinary Heritage
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-editorial text-[#fbf8f2] tracking-tight mb-6 text-balance">
              Where Maritime Flavor Meets Mediterranean Warmth
            </h2>

            <p className="text-[#c1d0e3] text-base sm:text-lg leading-relaxed mb-6 font-normal">
              {settings.storyText}
            </p>

            <p className="text-[#899eb9] text-sm leading-relaxed mb-10">
              Whether you are stopping in for a relaxed lunch, a family dinner, or an evening gathering with fresh seafood, our kitchen brings passion, tradition, and respect for maritime dining to every table.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#1e2f47]">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded bg-[#132034] text-[#c49756] border border-[#23354f] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#f4efe6] mb-1 font-editorial">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-[#8095af] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
