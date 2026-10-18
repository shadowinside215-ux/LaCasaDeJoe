import React from 'react';
import { X, Phone, ShoppingBag, Utensils, Check } from 'lucide-react';
import { MenuItem, BusinessSettings } from '../types/restaurant.ts';
import { buildCloudinaryUrl } from '../lib/cloudinary.ts';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  settings: BusinessSettings;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  onClose,
  settings,
}) => {
  if (!dish) return null;

  const imageUrl = buildCloudinaryUrl(
    dish.imageUrl,
    { width: 900, height: 600, crop: 'fill', quality: 'auto', format: 'auto' },
    settings.cloudinaryCloudName
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0e1726] border border-[#23354f] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-[#f4efe6] transition-colors cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Food Image */}
        <div className="relative aspect-[16/10] bg-[#080d14] overflow-hidden shrink-0">
          <img
            src={imageUrl}
            alt={dish.imageAlt || dish.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726] via-transparent to-transparent opacity-90" />

          {/* Category kicker */}
          <div className="absolute bottom-4 left-6 text-xs uppercase tracking-wider text-[#c49756] font-semibold">
            {dish.categoryName}
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
            <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#fbf8f2]">
              {dish.name}
            </h3>

            {/* Price */}
            <div>
              {dish.price && !dish.priceOnRequest ? (
                <span className="text-2xl font-bold text-[#d4a86a] tabular-nums font-editorial">
                  {dish.price} MAD
                </span>
              ) : (
                <span className="text-xs text-[#c49756] italic font-medium px-2 py-1 bg-[#1a283e] rounded border border-[#293d5a]">
                  Price upon request
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#cbd7e6] leading-relaxed mb-6 font-normal">
            {dish.description}
          </p>

          {/* Dietary & Details (Zero-Pill formatting) */}
          {dish.dietary && dish.dietary.length > 0 && (
            <div className="mb-6 p-3.5 bg-[#121c2d] border border-[#1e2f47] rounded-lg">
              <span className="text-xs text-[#8299b8] uppercase tracking-wider font-semibold block mb-1.5">
                Dietary & Preparation
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#d4deeb]">
                {dish.dietary.map((tag, idx) => (
                  <span key={tag} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#c49756]" />
                    <span>{tag}</span>
                    {idx < (dish.dietary?.length || 0) - 1 && (
                      <span aria-hidden="true" className="text-[#3b4f6b] ml-1">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#1e2f47]">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors text-center"
            >
              <Phone className="w-4 h-4" />
              <span>Call to Inquire ({settings.phone})</span>
            </a>

            {settings.glovoUrl ? (
              <a
                href={settings.glovoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#e9aa37] hover:bg-[#f5b84a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors text-center"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order on Glovo</span>
              </a>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#17253a] hover:bg-[#1f324d] text-[#f4efe6] text-xs font-semibold uppercase tracking-wider rounded transition-colors text-center border border-[#273d5c]"
              >
                <Utensils className="w-4 h-4 text-[#c49756]" />
                <span>Return to Menu</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
