import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types/restaurant.ts';
import { buildCloudinaryUrl } from '../lib/cloudinary.ts';

interface GallerySectionProps {
  items: GalleryItem[];
  cloudName: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items, cloudName }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const activePhoto = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#0d1624] border-t border-[#1a293f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c49756] font-medium mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Atmosphere</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-[#fbf8f2] tracking-tight mb-4">
            Restaurant & Seafood Gallery
          </h2>
          <p className="text-[#a0b3cc] text-base leading-relaxed">
            Take a visual tour through our Mediterranean specialties, fresh seafood platters, and dining surroundings.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'dishes', label: 'Dishes' },
            { id: 'seafood', label: 'Seafood Platters' },
            { id: 'atmosphere', label: 'Ambiance' },
            { id: 'dessert', label: 'Desserts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-[#c49756] text-[#0b1320]'
                  : 'bg-[#152338] text-[#9bb0cb] hover:text-[#f4efe6] hover:bg-[#1d304c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const thumbUrl = buildCloudinaryUrl(
              item.imageUrl,
              { width: 700, height: 500, crop: 'fill', quality: 'auto', format: 'auto' },
              cloudName
            );

            return (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(index)}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[#09101a] border border-[#20324c] hover:border-[#c49756]/60 transition-all duration-300 cursor-pointer shadow-md"
              >
                <img
                  src={thumbUrl}
                  alt={item.altText || item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <div className="flex items-center justify-between text-[#c49756] mb-1">
                    <span className="text-[11px] uppercase tracking-wider font-medium">{item.category}</span>
                    <Maximize2 className="w-4 h-4 text-[#f4efe6]" />
                  </div>
                  <h4 className="text-base font-bold font-editorial text-[#fbf8f2] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#a0b3cc] line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && activeLightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image and Caption Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] flex flex-col items-center bg-[#0e1726] rounded-lg overflow-hidden border border-[#23354f] shadow-2xl"
          >
            <div className="relative max-h-[68vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={buildCloudinaryUrl(
                  activePhoto.imageUrl,
                  { width: 1400, height: 1000, crop: 'fit', quality: 'auto', format: 'auto' },
                  cloudName
                )}
                alt={activePhoto.altText || activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>

            <div className="w-full p-4 sm:p-6 bg-[#0f1a2c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#1e2f47]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#c49756] font-medium block mb-1">
                  {activePhoto.category}
                </span>
                <h3 className="text-lg font-bold font-editorial text-[#fbf8f2]">
                  {activePhoto.title}
                </h3>
                <p className="text-xs text-[#9bb0cb] mt-0.5">
                  {activePhoto.caption}
                </p>
              </div>

              <div className="text-xs text-[#647b99] tabular-nums shrink-0">
                {activeLightboxIndex + 1} / {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
