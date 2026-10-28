import React, { useState } from 'react';
import type { Category, Product, CategoryId, SortOption, Article } from '../types/index.ts';
import { filterProducts, sortProducts, formatPrice } from '../utils/catalog.ts';
import { handleImageError } from '../utils/image.ts';
import { SlidersHorizontal, ArrowUpDown, Heart, ExternalLink, ArrowRight, Sparkles, Box } from 'lucide-react';
import type { Product3DModelId } from './ThreeLuxuryViewer.tsx';

interface CategoryPageProps {
  category: Category;
  products: Product[];
  articles: Article[];
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: string[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (catId: CategoryId) => void;
  onOpen3DViewer?: (modelId: Product3DModelId) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  products,
  articles,
  onSelectProduct,
  onToggleFavorite,
  favorites,
  onSelectArticle,
  onSelectCategory,
  onOpen3DViewer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  // Extract all unique tags for this category
  const categoryProducts = products.filter((p) => {
    if (category.id === 'edit') return p.isFeaturedInEdit;
    if (category.id === 'gifts') return p.tags.includes('Thoughtful Gifts') || p.category === 'accessories';
    return p.category === category.id;
  });

  const allTags = Array.from(new Set(categoryProducts.flatMap((p) => p.tags)));

  // Filter and sort
  const filtered = filterProducts(categoryProducts, {
    searchQuery,
    selectedTag,
  });
  const sorted = sortProducts(filtered, sortBy);

  // Related category articles
  const relatedArticles = articles.filter(
    (a) => a.category.toLowerCase().includes(category.name.toLowerCase().split(' ')[0]) || a.category.toLowerCase().includes('style')
  );

  return (
    <div className="w-full bg-[#FAF7F0] min-h-screen pb-16">
      {/* Category Hero */}
      <section className="relative w-full bg-[#063D2E] text-white py-12 md:py-16 border-b border-[#C9A24A]/30 overflow-hidden">
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#C9A24A]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Amazaura Curation</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#FAF7F0] leading-tight">
                {category.name}
              </h1>
              <p className="text-base sm:text-lg text-[#FAF7F0]/85 font-light leading-relaxed max-w-xl">
                {category.tagline}
              </p>
              <p className="text-xs sm:text-sm text-[#FAF7F0]/70 font-light max-w-xl">
                {category.description}
              </p>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-[#C9A24A]/40 shadow-xl aspect-[4/3] bg-[#042D22]">
                <img
                  src={category.image}
                  alt={category.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, category.id)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter, Search & Sort Control Strip */}
      <section className="sticky top-20 z-30 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#F0E7D8] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tag Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedTag(undefined)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === undefined
                  ? 'bg-[#063D2E] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-[#F0E7D8]'
              }`}
            >
              All ({categoryProducts.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? undefined : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-[#063D2E] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-[#F0E7D8]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <input
              type="text"
              placeholder={`Search ${category.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs px-3 py-1.5 bg-white border border-[#F0E7D8] rounded-lg focus:outline-none focus:border-[#C9A24A] w-full sm:w-48"
              aria-label={`Search ${category.name}`}
            />

            <div className="flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs bg-white border border-[#F0E7D8] rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none focus:border-[#C9A24A]"
                aria-label="Sort products"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name-asc">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((product) => {
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
                  className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#F0E7D8] shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left"
                >
                  {/* Image */}
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
                    {product.badge && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-[#063D2E] border border-[#C9A24A] text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs pointer-events-none">
                        {product.badge}
                      </div>
                    )}
                    {onOpen3DViewer && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen3DViewer(model3D);
                        }}
                        title="Inspect 3D Realistic Mesh"
                        className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#063D2E]/90 hover:bg-[#063D2E] text-[#C9A24A] text-[10px] font-bold rounded-md shadow-sm border border-[#C9A24A]/40 flex items-center gap-1 transition-transform active:scale-95"
                      >
                        <Box className="w-3 h-3" />
                        <span>3D Mesh</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(product);
                      }}
                      aria-label={isFav ? 'Remove from saved' : 'Save to favorites'}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-stone-500 hover:text-[#063D2E] rounded-full shadow-xs transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-[#C9A24A] text-[#C9A24A]' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-1.5 cursor-pointer" onClick={() => onSelectProduct(product)}>
                      <h3 className="font-editorial text-base font-bold text-[#063D2E] group-hover:text-[#C9A24A] transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 font-light">
                        {product.description}
                      </p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-sm font-bold text-[#063D2E]">
                          {formatPrice(product.verifiedPrice, product.currency)}
                        </span>
                        {product.verifiedRating && (
                          <span className="text-xs text-stone-500">
                            ★ {product.verifiedRating}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Product CTA & 3D button */}
                    <div className="flex items-center gap-2">
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
                        className="flex-1 py-2.5 px-4 bg-[#063D2E] hover:bg-[#042D22] text-[#FAF7F0] text-xs font-semibold rounded-full border border-[#C9A24A]/40 transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
                      >
                        <span>View Details & Buy</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#C9A24A]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#F0E7D8] p-8 max-w-lg mx-auto">
            <h3 className="font-editorial text-xl font-bold text-[#063D2E]">
              No products found
            </h3>
            <p className="text-xs text-stone-500 mt-2">
              Try clearing your search query or selecting a different tag filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag(undefined);
              }}
              className="mt-4 px-4 py-2 bg-[#063D2E] text-white text-xs font-medium rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Section Affiliate Disclosure */}
        <div className="mt-12 text-center text-xs text-stone-500 font-normal flex items-center justify-center gap-1.5">
          <span>🌿</span>
          <span className="italic">As an Amazon Associate I earn from qualifying purchases.</span>
        </div>
      </section>

      {/* Editorial Guide Section for this Category */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#F0E7D8]">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A24A]">
              Related Styling Notes
            </span>
            <h3 className="font-editorial text-2xl font-bold text-[#063D2E] mt-0.5">
              Curator’s Guide to {category.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.slice(0, 2).map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="p-5 bg-white rounded-xl border border-[#F0E7D8] hover:border-[#C9A24A] shadow-xs flex items-center gap-4 cursor-pointer group text-left"
              >
                <img
                  src={art.image}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-lg object-cover bg-stone-100 shrink-0 group-hover:scale-105 transition-transform"
                  onError={(e) => handleImageError(e, 'editorial')}
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[11px] text-stone-400">{art.readTime}</span>
                  <h4 className="font-editorial text-sm font-bold text-[#063D2E] group-hover:text-[#C9A24A] transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 font-light">
                    {art.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
