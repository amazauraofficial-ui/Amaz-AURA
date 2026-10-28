import React, { useState } from 'react';
import type { Product } from '../types/index.ts';
import { getValidAffiliateUrl, formatPrice } from '../utils/catalog.ts';
import { handleImageError } from '../utils/image.ts';
import { X, ExternalLink, Heart, Check, AlertCircle, ShieldCheck, ArrowRight, Box } from 'lucide-react';
import type { Product3DModelId } from './ThreeLuxuryViewer.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
  relatedProducts: Product[];
  onSelectRelated: (product: Product) => void;
  onOpen3DViewer?: (modelId: Product3DModelId) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onToggleFavorite,
  isFavorite,
  relatedProducts,
  onSelectRelated,
  onOpen3DViewer,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const affiliate = getValidAffiliateUrl(product);

  const suggested3DModel: Product3DModelId =
    product.model3DId ||
    (product.category === 'handbags'
      ? 'tote'
      : product.category === 'shoes'
      ? 'sneaker'
      : product.category === 'accessories'
      ? product.title.toLowerCase().includes('watch')
        ? 'watch'
        : product.title.toLowerCase().includes('sun')
        ? 'sunglasses'
        : 'pearls'
      : product.category === 'lifestyle'
      ? 'candle'
      : product.category === 'beauty'
      ? 'skincare-jar'
      : 'flacon');

  const galleryImages = [
    product.image,
    ...(product.gallery || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 md:p-6 backdrop-blur-xs"
    >
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#F0E7D8]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF7F0] border-b border-[#F0E7D8]">
          <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider">
            <span className="font-semibold text-[#063D2E]">{product.category}</span>
            <span>/</span>
            <span className="truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close product view"
            className="p-1.5 text-stone-400 hover:text-[#063D2E] rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-[#F0E7D8]">
                <img
                  src={activeImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, product.category)}
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 text-[#063D2E] border border-[#C9A24A] text-xs font-bold rounded-md shadow-xs">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img ? 'border-[#063D2E] scale-105' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, product.category)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Purchase Column */}
            <div className="md:col-span-6 space-y-5 text-left">
              <div>
                <h1 className="font-editorial text-2xl md:text-3xl font-bold text-[#063D2E] leading-tight">
                  {product.title}
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Last verified on Amazon: {product.lastVerified}
                </p>
              </div>

              {/* Verified Price & Rating */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E7D8]">
                <div>
                  <span className="text-2xl font-bold text-[#063D2E]">
                    {formatPrice(product.verifiedPrice, product.currency)}
                  </span>
                  <span className="text-xs text-stone-400 block">Verified reference price</span>
                </div>

                {product.verifiedRating && (
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#063D2E]">
                      <span className="text-[#C9A24A]">★</span> {product.verifiedRating} / 5.0
                    </div>
                    <span className="text-[11px] text-stone-400">
                      ({product.verifiedRatingCount?.toLocaleString()} ratings)
                    </span>
                  </div>
                )}
              </div>

              {/* Editorial Note */}
              {product.editorialNote && (
                <div className="p-3.5 bg-[#FAF7F0] border-l-2 border-[#C9A24A] rounded-r-lg text-xs text-stone-700 italic leading-relaxed">
                  <span className="font-semibold text-[#063D2E] not-italic block mb-0.5">
                    Amazaura Editorial Note:
                  </span>
                  “{product.editorialNote}”
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Action Buttons: View on Amazon, 3D Mesh Inspection, and Favorite */}
              <div className="pt-2 space-y-3">
                {onOpen3DViewer && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpen3DViewer(suggested3DModel);
                    }}
                    className="w-full py-2.5 px-4 bg-[#F0E7D8]/80 hover:bg-[#C9A24A]/20 text-[#063D2E] font-semibold text-xs rounded-xl border border-[#C9A24A]/40 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <Box className="w-4 h-4 text-[#C9A24A]" />
                    <span>Inspect 3D Realistic Mesh & Finishes</span>
                  </button>
                )}

                <div className="flex items-center gap-3">
                  <a
                    href={affiliate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-6 bg-[#063D2E] hover:bg-[#042D22] text-[#FAF7F0] font-semibold text-sm rounded-xl border border-[#C9A24A] shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>View on Amazon</span>
                    <ExternalLink className="w-4 h-4 text-[#C9A24A]" />
                  </a>

                  <button
                    onClick={() => onToggleFavorite(product)}
                    aria-label={isFavorite ? 'Remove from saved' : 'Save find'}
                    className={`p-3 rounded-xl border transition-colors ${
                      isFavorite
                        ? 'bg-[#C9A24A]/10 border-[#C9A24A] text-[#063D2E]'
                        : 'border-[#F0E7D8] text-stone-500 hover:text-[#063D2E] hover:bg-stone-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#C9A24A] text-[#C9A24A]' : ''}`} />
                  </button>
                </div>

                {/* Affiliate Link Notice */}
                <p className="text-[11px] text-stone-400 text-center italic">
                  Opens directly to the official product listing on Amazon.com
                </p>
              </div>
            </div>
          </div>

          {/* Realism Specifications Sheet */}
          {(product.materials || product.dimensions) && (
            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#F0E7D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              {product.materials && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#063D2E] tracking-wider block">
                    Verified Materials & Finish
                  </span>
                  <span className="text-stone-700 font-medium">{product.materials}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#063D2E] tracking-wider block">
                    Dimensions & Sizing
                  </span>
                  <span className="text-stone-700 font-medium">{product.dimensions}</span>
                </div>
              )}
            </div>
          )}

          {/* Features, Pros & Considerations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#F0E7D8]">
            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#063D2E]">
                Verified Product Features
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#C9A24A] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros & Considerations */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#063D2E] mb-2">
                  Why We Recommend It
                </h3>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {product.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#063D2E] font-bold">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Things to Keep in Mind
                </h3>
                <ul className="space-y-1.5 text-xs text-stone-500">
                  {product.considerations.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-stone-400 font-bold">·</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related Recommendations */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-[#F0E7D8] space-y-4">
              <h3 className="font-editorial text-lg font-bold text-[#063D2E]">
                You May Also Like
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {relatedProducts.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectRelated(item)}
                    className="p-3 rounded-xl border border-[#F0E7D8] hover:border-[#C9A24A] transition-all cursor-pointer bg-[#FAF7F0]/40 group flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-white mb-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => handleImageError(e, item.category)}
                      />
                    </div>
                    <h4 className="text-xs font-bold text-[#063D2E] group-hover:text-[#C9A24A] transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-xs font-semibold text-stone-700 mt-1">
                      {formatPrice(item.verifiedPrice, item.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
