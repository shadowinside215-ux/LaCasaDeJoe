import React from 'react';
import { motion } from 'motion/react';
import { Star, ExternalLink, CheckCircle, Quote } from 'lucide-react';
import { BusinessSettings } from '../types/restaurant.ts';

interface ReviewsSectionProps {
  settings: BusinessSettings;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ settings }) => {
  // Review themes explicitly supplied in client brief
  const verifiedThemes = [
    {
      theme: 'Fresh and Delicious Fish',
      excerpt: 'Fresh and delicious fish prepared with great care.',
      detail: 'Guests consistently praise the quality and flavor of the seafood dishes.'
    },
    {
      theme: 'Spanish Culinary Influences',
      excerpt: 'Spanish culinary influences that make every seafood plate special.',
      detail: 'Distinctive recipes such as Gambas Al Ajillo cooked in olive oil and garlic.'
    },
    {
      theme: 'Warm and Friendly Service',
      excerpt: 'Warm and friendly service with attentive staff.',
      detail: 'Attentive and welcoming Moroccan and Mediterranean hospitality.'
    },
    {
      theme: 'Cozy and Welcoming Atmosphere',
      excerpt: 'A cozy and welcoming atmosphere perfect for dining.',
      detail: 'An inviting setting for family gatherings and seafood lovers.'
    },
    {
      theme: 'Relaxing Music & Surroundings',
      excerpt: 'Relaxing music and comfortable surroundings.',
      detail: 'A comfortable dining space complemented by pleasant ambient background music.'
    }
  ];

  const googleReviewUrl = settings.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=La+Casa+De+Joe+Sala+Al+Jadida`;

  return (
    <section id="reviews" className="py-24 bg-[#0b1320] border-t border-[#18273d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block with Prominent Score */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c49756] font-medium mb-3">
            <CheckCircle className="w-3.5 h-3.5 text-[#c49756]" />
            <span>Verified Customer Reputation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-[#fbf8f2] tracking-tight mb-6">
            Loved by Diners in Sala Al Jadida
          </h2>

          {/* Prominent Score Card (Claim-to-Proof Adjacency) */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 p-6 bg-[#121c2d] border border-[#223550] rounded-xl shadow-xl">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-editorial text-[#d4a86a] tabular-nums">
                {settings.googleRating.toFixed(1)}
              </span>
              <span className="text-xl sm:text-2xl text-[#8ba1bc]">/ 5</span>
            </div>

            <div className="h-8 w-px bg-[#263a56] hidden sm:block" />

            <div className="text-left">
              <div className="flex items-center gap-1 text-[#d4a86a] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'fill-[#d4a86a]' : 'fill-[#d4a86a]/60'}`}
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#f4efe6]">
                Based on <span className="tabular-nums font-bold text-[#d4a86a]">{settings.googleReviewsCount}</span> verified Google reviews
              </p>
              <p className="text-[11px] text-[#7187a4]">
                Consistently rated for fresh catch & friendly hospitality
              </p>
            </div>
          </div>
        </motion.div>

        {/* Themed Review Cards with Staggered Scroll Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {verifiedThemes.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#101927] border border-[#1d2d44] hover:border-[#c49756]/40 rounded-lg p-6 flex flex-col justify-between transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#d4a86a]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#d4a86a]" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#283d5a]" />
                </div>

                <div className="text-xs uppercase tracking-wider font-semibold text-[#c49756] mb-2 font-editorial">
                  {item.theme}
                </div>

                <blockquote className="text-sm font-medium text-[#e4edf7] leading-relaxed mb-3">
                  "{item.excerpt}"
                </blockquote>
              </div>

              <div className="pt-3 border-t border-[#1a293d] text-xs text-[#7d93ae]">
                {item.detail}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Read Reviews Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#152338] hover:bg-[#1d314e] border border-[#273d5e] text-[#f4efe6] text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-md hover:shadow-black/30 hover:scale-105"
          >
            <span>Read Verified Google Reviews</span>
            <ExternalLink className="w-4 h-4 text-[#c49756]" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};
