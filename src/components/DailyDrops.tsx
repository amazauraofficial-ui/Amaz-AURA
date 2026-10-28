import React from 'react';
import type { Product } from '../types/index.ts';
import { Flame, Box, ExternalLink, Heart, Sparkles, PlusCircle } from 'lucide-react';
import { formatPrice } from '../utils/catalog.ts';
import { handleImageError } from '../utils/image.ts';
import type { Product3DModelId } from './ThreeLuxuryViewer.tsx';

interface DailyDropsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: string[];
  onOpen3DViewer: (modelId: Product3DModelId) => void;
  onOpenProductManager: () => void;
}

export const DailyDrops: React.FC<DailyDropsProps> = ({
  products,
  onSelectProduct,
  onToggleFavorite,
  favorites,
  onOpen3DViewer,
  onOpenProductManager,
}) => {
  // Products that are daily drops or user custom added
  const dailyDrops = products.filter((p) => p.isDailyDrop || p.id.startsWith('amz-custom-'));

  if (dailyDrops.length === 0) return null;

  const todayDateString = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <section className="w-full py-12 md:py-16 bg-[#042D22] text-white border-y border-[#C9A24A]/40 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#063D2E]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#C9A24A]/30">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A24A]/20 border border-[#C9A24A] text-[#C9A24A] text-xs font-bold rounded-full uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>Amazon Daily Drops · {todayDateString}</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#FAF7F0]">
              Today's Curated Finds & 3D Realistic Previews
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF7F0]/80 font-light max-w-xl">
              Freshly updated Amazon finds hand-inspected for exceptional craftsmanship, verified customer consensus, and 100% realistic 3D mesh simulation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpen3DViewer('watch')}
              className="px-4 py-2 bg-black/40 hover:bg-black/60 border border-[#C9A24A]/40 text-[#C9A24A] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Box className="w-4 h-4" />
              <span>Launch 3D Studio</span>
            </button>
            <button
              onClick={onOpenProductManager}
              className="px-4 py-2 bg-[#C9A24A] hover:bg-[#d8b056] text-[#063D2E] rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Daily Find</span>
            </button>
          </div>
        </div>

        {/* Drops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dailyDrops.slice(0, 4).map((product) => {
            const isFav = favorites.includes(product.id);
            const model3D = (product.model3DId ||
              (product.category === 'handbags'
                ? 'tote'
                : product.category === 'shoes'
                ? 'sneaker'
                : product.category === 'accessories'
                ? 'watch'
                : product.category === 'beauty'
                ? 'skincare-jar'
                : 'candle')) as Product3DModelId;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col bg-[#063D2E]/90 rounded-2xl overflow-hidden border border-[#C9A24A]/30 shadow-xl hover:border-[#C9A24A] transition-all duration-300 transform hover:-translate-y-1 text-left"
              >
                {/* Image & Badges */}
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden bg-black/20 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => handleImageError(e, product.category)}
                  />

                  {/* Drop Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#042D22]/95 border border-[#C9A24A] text-[#C9A24A] text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs pointer-events-none flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{product.badge || "TODAY'S DROP"}</span>
                  </div>

                  {/* 3D Mesh Inspection Badge Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen3DViewer(model3D);
                    }}
                    title="Inspect 100% Realistic 3D Mesh"
                    className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#042D22]/95 hover:bg-[#C9A24A] hover:text-[#063D2E] text-[#C9A24A] border border-[#C9A24A] text-[10px] font-bold rounded-md shadow-md flex items-center gap-1 transition-all active:scale-95"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Mesh</span>
                  </button>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product);
                    }}
                    aria-label={isFav ? 'Remove from saved' : 'Save find'}
                    className="absolute top-3 right-3 p-2 bg-[#042D22]/80 hover:bg-[#042D22] text-[#FAF7F0] rounded-full shadow-xs transition-colors border border-white/10"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? 'fill-[#C9A24A] text-[#C9A24A]' : 'text-stone-300'}`}
                    />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-1.5 cursor-pointer" onClick={() => onSelectProduct(product)}>
                    <div className="flex items-center justify-between text-[11px] text-[#FAF7F0]/60">
                      <span className="uppercase font-semibold tracking-wider text-[#C9A24A]">
                        {product.category}
                      </span>
                      {product.verifiedRating && (
                        <span>★ {product.verifiedRating} / 5.0</span>
                      )}
                    </div>

                    <h3 className="font-editorial text-base font-bold text-[#FAF7F0] group-hover:text-[#C9A24A] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-[#FAF7F0]/70 line-clamp-2 font-light">
                      {product.editorialNote || product.description}
                    </p>

                    <div className="pt-1 text-sm font-bold text-[#C9A24A]">
                      {formatPrice(product.verifiedPrice, product.currency)}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => onOpen3DViewer(model3D)}
                      title="Inspect 3D Realistic Mesh & Finishes"
                      className="p-2.5 bg-black/40 hover:bg-black/70 text-[#C9A24A] rounded-xl border border-[#C9A24A]/40 transition-colors"
                    >
                      <Box className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-2.5 px-4 bg-[#C9A24A] hover:bg-[#d8b056] text-[#063D2E] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98]"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
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
