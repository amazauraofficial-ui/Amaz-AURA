import React from 'react';
import { ArrowRight } from 'lucide-react';
import { handleImageError } from '../utils/image.ts';
import type { CategoryId } from '../types/index.ts';

interface CategoryCardsProps {
  onSelectCategory: (category: CategoryId) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  const categoryList: Array<{
    id: CategoryId;
    title: string;
    image: string;
    alt: string;
  }> = [
    {
      id: 'handbags',
      title: 'Handbags & Purses',
      image: '/assets/images/cat_handbags_purses_1792048038968.jpg',
      alt: 'Quilted emerald flap bag and cream leather tote on travertine pedestal',
    },
    {
      id: 'shoes',
      title: 'Shoes',
      image: '/assets/images/cat_womens_shoes_1792048039821.jpg',
      alt: 'Nude patent leather pumps and white comfort sneakers',
    },
    {
      id: 'beauty',
      title: 'Beauty & Skincare',
      image: '/assets/images/cat_beauty_skincare_1792048040765.jpg',
      alt: 'Luxury botanical serum bottle, face cream jar, and cosmetic tube',
    },
    {
      id: 'accessories',
      title: 'Accessories',
      image: '/assets/images/cat_accessories_jewelry_1792048040800.jpg',
      alt: 'Tortoiseshell acetate sunglasses, gold watch, and pearl drop earrings',
    },
    {
      id: 'lifestyle',
      title: 'Home & Lifestyle',
      image: '/assets/images/cat_home_lifestyle_1792048041664.jpg',
      alt: 'Amber soy scented candle, essential oil reed diffuser, and marble tray',
    },
  ];

  return (
    <section className="w-full py-8 md:py-12 bg-[#FAF7F0] border-b border-[#F0E7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Cards Grid - Exactly 5 items matching the reference photo */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {categoryList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-white border border-[#F0E7D8] shadow-xs hover:shadow-md transition-all duration-300 text-left cursor-pointer transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#C9A24A]"
              aria-label={`Shop ${cat.title}`}
            >
              {/* Product Category Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => handleImageError(e, cat.id)}
                />
              </div>

              {/* Bottom Emerald Footer Strip with Gold Text and Arrow */}
              <div className="w-full bg-[#063D2E] text-white py-2.5 px-3 flex items-center justify-between group-hover:bg-[#042D22] transition-colors border-t border-[#C9A24A]/40">
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#FAF7F0] truncate">
                  {cat.title}
                </span>
                <ArrowRight className="w-4 h-4 text-[#C9A24A] shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
