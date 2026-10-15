import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { CategoryId } from '../types/index.ts';

interface CuratedCollectionsProps {
  onSelectCollection: (category: CategoryId, tag?: string) => void;
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ onSelectCollection }) => {
  const collections = [
    {
      title: 'Everyday Elegance',
      tagline: 'Refined neutral silhouettes for effortless work & weekend styling.',
      category: 'fashion' as CategoryId,
      tag: 'Everyday Elegance',
      image: '/src/assets/images/hero_amazaura_luxury_1792048038650.jpg',
    },
    {
      title: 'The Handbag Edit',
      tagline: 'Structured leather totes, saddle bags, and versatile crossbodies.',
      category: 'handbags' as CategoryId,
      image: '/src/assets/images/cat_handbags_purses_1792048038968.jpg',
    },
    {
      title: 'Beauty Essentials',
      tagline: 'Nourishing botanical oils, restorative ceramides, and clean SPF staples.',
      category: 'beauty' as CategoryId,
      image: '/src/assets/images/cat_beauty_skincare_1792048040765.jpg',
    },
    {
      title: 'Comfortable & Stylish Shoes',
      tagline: 'All-day arch support trainers and sculpted block heels.',
      category: 'shoes' as CategoryId,
      image: '/src/assets/images/cat_womens_shoes_1792048039821.jpg',
    },
    {
      title: 'Thoughtful Gifts',
      tagline: 'Lustrous baroque pearls, apothecary candles, and heirloom keepsakes.',
      category: 'gifts' as CategoryId,
      tag: 'Thoughtful Gifts',
      image: '/src/assets/images/edit_pearl_earrings_1792048099941.jpg',
    },
    {
      title: 'Home Favorites',
      tagline: 'Tactile marble trays, natural soy aromatics, and tranquil accents.',
      category: 'lifestyle' as CategoryId,
      image: '/src/assets/images/cat_home_lifestyle_1792048041664.jpg',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-[#FAF7F0] border-b border-[#F0E7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#063D2E] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>Curated Thematic Discovery</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#063D2E]">
            Curated Collections
          </h2>
          <p className="text-sm text-stone-600 mt-2 font-light">
            Explore curated capsules designed around moments of life, style, and sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, idx) => (
            <div
              key={idx}
              onClick={() => onSelectCollection(col.category, col.tag)}
              className="group relative h-64 rounded-2xl overflow-hidden border border-[#F0E7D8] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
            >
              {/* Background Photography */}
              <img
                src={col.image}
                alt={col.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#042D22]/90 via-[#042D22]/40 to-transparent group-hover:from-[#042D22]/95 transition-colors" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-widest text-[#C9A24A] font-medium mb-1">
                  Collection
                </span>
                <h3 className="font-editorial text-xl font-bold tracking-tight text-[#FAF7F0] group-hover:text-[#C9A24A] transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-[#FAF7F0]/80 mt-1 line-clamp-2 font-light">
                  {col.tagline}
                </p>
                <div className="pt-3 flex items-center gap-1.5 text-xs font-semibold text-[#C9A24A]">
                  <span>Explore Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
