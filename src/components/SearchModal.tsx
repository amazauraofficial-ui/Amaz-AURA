import React, { useState } from 'react';
import type { Product, CategoryId } from '../types/index.ts';
import { filterProducts, formatPrice } from '../utils/catalog.ts';
import { handleImageError } from '../utils/image.ts';
import { Search, X, ArrowRight, ExternalLink } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');

  if (!isOpen) return null;

  const results = filterProducts(products, {
    searchQuery: query,
    category: activeCategory,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Amazaura finds"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-3 sm:p-6 md:pt-16 backdrop-blur-xs"
    >
      <div className="relative flex flex-col w-full max-w-3xl bg-[#FAF7F0] rounded-2xl overflow-hidden shadow-2xl border border-[#C9A24A]/40 max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 bg-white border-b border-[#F0E7D8] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#063D2E] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search handbags, sneakers, serums, pearls, home..."
            className="w-full text-base bg-transparent border-none focus:outline-none text-[#252525] placeholder:text-stone-400 font-light"
            aria-label="Search catalog"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 text-stone-400 hover:text-[#063D2E] rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Categories */}
        <div className="px-5 py-3 bg-[#FAF7F0] border-b border-[#F0E7D8] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-stone-500 whitespace-nowrap">Filter:</span>
          {(['all', 'handbags', 'shoes', 'beauty', 'accessories', 'lifestyle'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#063D2E] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-[#F0E7D8]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 bg-white rounded-xl border border-[#F0E7D8] hover:border-[#C9A24A] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group text-left"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => handleImageError(e, product.category)}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#C9A24A] font-semibold block">
                      {product.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#063D2E] group-hover:text-[#C9A24A] transition-colors truncate">
                      {product.title}
                    </h4>
                    <span className="text-xs font-semibold text-stone-800">
                      {formatPrice(product.verifiedPrice, product.currency)}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#063D2E] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500 space-y-2">
              <p className="text-sm font-medium">No results found for “{query}”</p>
              <p className="text-xs text-stone-400">
                Try searching for “handbag”, “sneakers”, “pearls”, “serum”, or “candle”.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
