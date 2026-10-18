import React, { useState } from 'react';
import { ShoppingBag, Phone, UtensilsCrossed, ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { MenuCategory, MenuItem } from '../types/restaurant.ts';

interface MenuSectionProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
  glovoUrl?: string;
  phone?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  items,
  glovoUrl = 'https://glovoapp.com/fr/ma/technopolis/stores/la-casa-de-joe-tec?utm_medium=organic&utm_campaign=google_reserve_place_order_action&utm_source=google',
  phone = '+212 688-939826',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const activeCategories = categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.categoryId === selectedCategory;
  });

  return (
    <section id="menu" className="py-24 bg-[#0b1320] border-t border-[#18263a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c49756] font-medium mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Mediterranean Seafood Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-[#fbf8f2] tracking-tight mb-4">
            Menu & Online Orders
          </h2>
          <p className="text-[#a0b3cc] text-base leading-relaxed">
            Authentic coastal dishes prepared fresh in Sala Al Jadida. Order online directly via Glovo or join us for dine-in service.
          </p>
        </div>

        {/* Glovo Ordering Callout Strip */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#14233a] via-[#101b2c] to-[#14233a] border border-[#22354f] rounded-xl p-6 sm:p-8 mb-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#e9aa37]/15 text-[#f5bd56] text-xs font-semibold rounded mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Glovo Delivery Store Available</span>
            </div>
            <h3 className="text-xl font-bold font-editorial text-[#fbf8f2] mb-1">
              Craving fresh seafood at home?
            </h3>
            <p className="text-xs text-[#9bb0cb]">
              Place your order directly on our verified Glovo store with quick dispatch in Sala Al Jadida.
            </p>
          </div>

          <a
            href={glovoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#e9aa37] hover:bg-[#f5b84a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-all shadow-md hover:shadow-[#e9aa37]/20 flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>Order on Glovo</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Category Filters (Segmented tabs) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#c49756] text-[#0b1320]'
                : 'bg-[#121d2d] text-[#8fa5c2] hover:text-[#f4efe6] hover:bg-[#18273d]'
            }`}
          >
            All Dishes ({items.length})
          </button>
          {activeCategories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#c49756] text-[#0b1320]'
                    : 'bg-[#121d2d] text-[#8fa5c2] hover:text-[#f4efe6] hover:bg-[#18273d]'
                }`}
              >
                {cat.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Dish List with Zero Pictures */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 max-w-md mx-auto p-6 bg-[#101a29] border border-[#1d2d44] rounded-lg">
            <p className="text-sm text-[#8fa5c2] mb-3">No dishes listed in this category yet.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-[#c49756] hover:underline cursor-pointer"
            >
              Show all dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#101927] border border-[#1e2f47] hover:border-[#c49756]/50 rounded-xl p-6 flex flex-col justify-between transition-all duration-200 shadow-md group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-xl font-bold font-editorial text-[#fbf8f2] group-hover:text-[#d4a86a] transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-lg font-bold text-[#d4a86a] tabular-nums font-editorial shrink-0">
                      {item.price ? `${item.price},00 MAD` : 'Price on request'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#9cb1cd] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#18273d] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#c49756] uppercase tracking-wider font-semibold">
                    {item.categoryName}
                  </span>

                  <a
                    href={glovoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#f5bd56] hover:text-white transition-colors"
                  >
                    <span>Order via Glovo</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Contact Strip */}
        <div className="pt-8 border-t border-[#18263a] max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#8ca2be]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#c49756]" />
            <span>Reported closing time: 9:00 PM</span>
          </div>
          <span aria-hidden="true" className="text-[#3b4f6b]">·</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#c49756]" />
            <span>Immeuble C, Résidence Romana 3, Avenue Hassan II</span>
          </div>
          <span aria-hidden="true" className="text-[#3b4f6b]">·</span>
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 text-[#d4a86a] hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call: {phone}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
