import React from 'react';
import type { Product } from '../types/index.ts';
import { getValidAffiliateUrl, formatPrice } from '../utils/catalog.ts';
import { X, Trash2, ExternalLink, Heart, ArrowRight } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (id: string) => void;
  onClearFavorites: () => void;
  onSelectProduct: (product: Product) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Saved curated favorites"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end"
    >
      <div className="relative w-full max-w-md bg-[#FAF7F0] h-full shadow-2xl flex flex-col border-l border-[#F0E7D8]">
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#F0E7D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#C9A24A] text-[#C9A24A]" />
            <h2 className="font-editorial text-lg font-bold text-[#063D2E]">
              Saved Finds ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close saved finds"
            className="p-1.5 text-stone-400 hover:text-[#063D2E] rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {favorites.length > 0 ? (
            <div className="space-y-3">
              {favorites.map((product) => {
                const affiliate = getValidAffiliateUrl(product);
                return (
                  <div
                    key={product.id}
                    className="p-3 bg-white rounded-xl border border-[#F0E7D8] shadow-xs flex items-center gap-3 group text-left"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0 cursor-pointer"
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-xs font-bold text-[#063D2E] truncate cursor-pointer hover:text-[#C9A24A] transition-colors"
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                      >
                        {product.title}
                      </h3>
                      <div className="text-xs font-semibold text-stone-800 mt-0.5">
                        {formatPrice(product.verifiedPrice, product.currency)}
                      </div>
                      <div className="pt-2 flex items-center gap-3">
                        <a
                          href={affiliate.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#063D2E] hover:text-[#C9A24A]"
                        >
                          <span>Amazon</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => onRemoveFavorite(product.id)}
                          className="text-[11px] text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-stone-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[#063D2E]">No saved finds yet</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Tap the heart icon on any curated product card to build your personal capsule collection.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-4 bg-white border-t border-[#F0E7D8] flex items-center justify-between">
            <button
              onClick={onClearFavorites}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#063D2E] text-white text-xs font-semibold rounded-lg hover:bg-[#042D22] transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
