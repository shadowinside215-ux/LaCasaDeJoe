import React from 'react';
import { Eye, UtensilsCrossed } from 'lucide-react';
import { MenuItem } from '../types/restaurant.ts';
import { buildCloudinaryUrl } from '../lib/cloudinary.ts';

interface SignatureDishesProps {
  items: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
  cloudName: string;
}

export const SignatureDishes: React.FC<SignatureDishesProps> = ({
  items,
  onSelectDish,
  cloudName,
}) => {
  const signatureItems = items.filter((item) => item.isFeatured).slice(0, 6);

  return (
    <section id="signatures" className="py-24 bg-[#0e1726] border-y border-[#1e2c42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c49756] font-medium mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Culinary Highlights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-editorial text-[#fbf8f2] tracking-tight mb-4 text-balance">
            Signature Seafood Selections
          </h2>
          <p className="text-[#a0b3cc] text-base sm:text-lg leading-relaxed">
            Crafted with the freshest ocean catches and traditional Spanish culinary techniques.
            These dishes represent the heart of our dining experience in Sala Al Jadida.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {signatureItems.map((dish) => {
            const optimizedImage = buildCloudinaryUrl(
              dish.imageUrl,
              { width: 800, height: 600, crop: 'fill', quality: 'auto', format: 'auto' },
              cloudName
            );

            return (
              <div
                key={dish.id}
                onClick={() => onSelectDish(dish)}
                className="group bg-[#131f33] rounded-lg overflow-hidden border border-[#23354f] hover:border-[#c49756]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col cursor-pointer"
              >
                {/* Image Container with 4:3 Aspect Ratio */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0a101a]">
                  <img
                    src={optimizedImage}
                    alt={dish.imageAlt || dish.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131f33] via-transparent to-transparent opacity-80" />

                  {/* Category subtle label (no pill cliches) */}
                  <div className="absolute top-3 left-3 text-[11px] uppercase tracking-wider text-[#d4deeb] bg-[#0b1320]/80 backdrop-blur-sm px-2.5 py-1 rounded font-medium border border-[#2a3c57]">
                    {dish.categoryName || 'Specialty'}
                  </div>

                  {/* Availability badge if out of stock */}
                  {!dish.isAvailable && (
                    <div className="absolute top-3 right-3 text-[11px] uppercase tracking-wider text-[#fca5a5] bg-red-950/80 backdrop-blur-sm px-2.5 py-1 rounded font-medium border border-red-800">
                      Unavailable today
                    </div>
                  )}

                  {/* Hover Quick View Trigger */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0b1320]/90 text-[#fbf8f2] text-xs font-medium rounded border border-[#c49756]/50">
                      <Eye className="w-3.5 h-3.5 text-[#c49756]" />
                      <span>View Details</span>
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold font-editorial text-[#fbf8f2] group-hover:text-[#d4a86a] transition-colors">
                        {dish.name}
                      </h3>
                    </div>

                    <p className="text-sm text-[#94a8c2] leading-relaxed mb-4 line-clamp-3">
                      {dish.description}
                    </p>
                  </div>

                  {/* Price and Dietary Footer */}
                  <div className="pt-4 border-t border-[#22354e] flex items-center justify-between text-xs">
                    {/* Unboxed dietary tags */}
                    <div className="text-[#849bb8] flex items-center gap-1.5 truncate max-w-[60%]">
                      {dish.dietary && dish.dietary.length > 0 ? (
                        dish.dietary.map((tag, idx) => (
                          <React.Fragment key={tag}>
                            <span>{tag}</span>
                            {idx < (dish.dietary?.length || 0) - 1 && (
                              <span aria-hidden="true" className="text-[#495f7c]">·</span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <span>Fresh Daily</span>
                      )}
                    </div>

                    {/* Price in MAD or tasteful unconfirmed notice */}
                    <div className="text-right shrink-0">
                      {dish.price && !dish.priceOnRequest ? (
                        <span className="text-base font-semibold text-[#d4a86a] tabular-nums">
                          {dish.price} MAD
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#c49756] italic font-medium">
                          Price upon request
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
