import React from 'react';
import type { Product } from '../types/index.ts';
import { Heart, ExternalLink, ArrowRight, Box } from 'lucide-react';
import { formatPrice } from '../utils/catalog.ts';
import { handleImageError } from '../utils/image.ts';
import type { Product3DModelId } from './ThreeLuxuryViewer.tsx';

interface AmazauraEditProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: string[];
  onViewAllEdit: () => void;
  onOpen3DViewer?: (modelId: Product3DModelId) => void;
}

export const AmazauraEdit: React.FC<AmazauraEditProps> = ({
  products,
  onSelectProduct,
  onToggleFavorite,
  favorites,
  onViewAllEdit,
  onOpen3DViewer,
}) => {
  // Only the products marked as featured in the edit (the 4 primary hero cards)
  const editProducts = products.filter((p) => p.isFeaturedInEdit).slice(0, 4);

  return (
    <section className="w-full py-12 md:py-16 bg-[#FAF7F0] border-b border-[#F0E7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Refined Gold Flourish Lines */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="h-[1px] w-12 sm:w-24 bg-[#C9A24A]/60" />
          <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#063D2E] text-center">
            The Amazaura Edit
          </h2>
          <span className="h-[1px] w-12 sm:w-24 bg-[#C9A24A]/60" />
        </div>

        {/* 4 Cards Grid - Exactly matching the user's reference mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {editProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            const model3D = (product.model3DId ||
              (product.category === 'handbags'
                ? 'tote'
                : product.category === 'shoes'
                ? 'sneaker'
                : product.category === 'accessories'
                ? 'pearls'
                : product.category === 'beauty'
                ? 'skincare-jar'
                : 'candle')) as Product3DModelId;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#F0E7D8] shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container with Badges */}
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden bg-stone-50 cursor-pointer"
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

                  {/* Editorial Badge Pill (Matches Reference) */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-[#FAF7F0]/95 backdrop-blur-xs border border-[#C9A24A] text-[#063D2E] text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-xs pointer-events-none">
                      {product.badge}
                    </div>
                  )}

                  {/* 3D Mesh Quick Badge */}
                  {onOpen3DViewer && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen3DViewer(model3D);
                      }}
                      title="Inspect 3D Realistic Mesh & Finishes"
                      className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#063D2E]/90 hover:bg-[#063D2E] text-[#C9A24A] text-[10px] font-bold rounded-md shadow-sm border border-[#C9A24A]/40 flex items-center gap-1 transition-transform active:scale-95"
                    >
                      <Box className="w-3 h-3" />
                      <span>3D Mesh</span>
                    </button>
                  )}

                  {/* Save / Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product);
                    }}
                    aria-label={isFav ? `Remove ${product.title} from favorites` : `Save ${product.title} to favorites`}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-[#252525] hover:text-[#063D2E] rounded-full shadow-sm transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? 'fill-[#C9A24A] text-[#C9A24A]' : 'text-stone-400'}`}
                    />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 text-center justify-between space-y-4">
                  <div className="space-y-1.5 cursor-pointer" onClick={() => onSelectProduct(product)}>
                    <h3 className="font-editorial text-base sm:text-lg font-bold text-[#063D2E] group-hover:text-[#C9A24A] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-stone-600 italic line-clamp-2">
                      {product.editorialNote || product.description}
                    </p>
                    <div className="pt-1 text-xs font-semibold text-[#063D2E]">
                      {formatPrice(product.verifiedPrice, product.currency)}
                    </div>
                  </div>

                  {/* Action Buttons: 3D Preview & View Details */}
                  <div className="pt-2 flex items-center gap-2">
                    {onOpen3DViewer && (
                      <button
                        onClick={() => onOpen3DViewer(model3D)}
                        title="Inspect 3D Mesh"
                        aria-label="Inspect 3D Mesh"
                        className="p-2.5 bg-[#FAF7F0] hover:bg-[#F0E7D8] text-[#063D2E] rounded-full border border-[#C9A24A]/40 transition-colors shadow-xs"
                      >
                        <Box className="w-3.5 h-3.5 text-[#C9A24A]" />
                      </button>
                    )}
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-2.5 px-4 bg-[#063D2E] hover:bg-[#042D22] text-[#FAF7F0] text-xs font-semibold rounded-full border border-[#C9A24A]/40 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                    >
                      <span>View Product</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#C9A24A]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Affiliate Disclosure */}
        <div className="mt-8 text-center text-xs text-stone-500 font-normal flex items-center justify-center gap-1.5">
          <span>🌿</span>
          <span className="italic">As an Amazon Associate I earn from qualifying purchases.</span>
        </div>

        {/* View All Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onViewAllEdit}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#063D2E] hover:text-[#C9A24A] uppercase tracking-wider transition-colors"
          >
            <span>Explore Complete Capsule Edit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
