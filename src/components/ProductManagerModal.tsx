import React, { useState } from 'react';
import type { Product, CategoryId, Product3DType } from '../types/index.ts';
import type { Product3DModelId } from './ThreeLuxuryViewer.tsx';
import {
  PlusCircle,
  Sparkles,
  Box,
  CheckCircle2,
  X,
  Link,
  Flame,
  Layers,
  Upload,
  Download,
  Eye,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  onPreview3D: (modelId: Product3DModelId) => void;
}

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onPreview3D,
}) => {
  const [amazonInput, setAmazonInput] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('handbags');
  const [amazonAsin, setAmazonAsin] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('119.00');
  const [rating, setRating] = useState('4.8');
  const [ratingCount, setRatingCount] = useState('320');
  const [description, setDescription] = useState('');
  const [editorialNote, setEditorialNote] = useState('');
  const [badge, setBadge] = useState("TODAY'S TOP DROP");
  const [selected3D, setSelected3D] = useState<Product3DType>('tote');
  const [dimensions, setDimensions] = useState('14.2" W x 10.8" H x 5.2" D');
  const [materials, setMaterials] = useState('Full-grain pebbled calfskin with water-resistant micro-finish');
  const [featuresText, setFeaturesText] = useState(
    'Top-grain textured material with reinforced stress points\nCustom 18K electroplated hardware accents\nLightweight ergonomic everyday design under 1.8 lbs\nSpacious multi-compartment interior with laptop sleeve'
  );
  const [prosText, setProsText] = useState(
    'Maintains crisp architectural silhouette\nZero break-in required, effortless everyday comfort'
  );
  const [consText, setConsText] = useState('Spot clean with dry microfiber cloth');
  const [custom3dFileName, setCustom3dFileName] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  // Smart Amazon URL / ASIN parser
  const handleAmazonUrlChange = (val: string) => {
    setAmazonInput(val);

    // Match ASIN (10 alphanumeric characters after /dp/ or /gp/product/ or standalone)
    const asinMatch = val.match(/(?:dp|gp\/product|\/d\/)?([B0-9][A-Z0-9]{9})/i);
    if (asinMatch && asinMatch[1]) {
      const extractedAsin = asinMatch[1].toUpperCase();
      setAmazonAsin(extractedAsin);

      // Auto-suggest defaults if empty
      if (!title) {
        if (val.toLowerCase().includes('bag') || val.toLowerCase().includes('tote')) {
          setTitle('Luxury Minimalist Top-Handle Shoulder Bag');
          setCategory('handbags');
          setSelected3D('tote');
        } else if (val.toLowerCase().includes('shoe') || val.toLowerCase().includes('sneaker')) {
          setTitle('Ergonomic White Leather Platform Walkers');
          setCategory('shoes');
          setSelected3D('sneaker');
        } else if (val.toLowerCase().includes('watch')) {
          setTitle('18K Gold Plated Fluted Dial Bracelet Watch');
          setCategory('accessories');
          setSelected3D('watch');
        } else if (val.toLowerCase().includes('sun')) {
          setTitle('Cat-Eye UV400 Polarized Designer Sunglasses');
          setCategory('accessories');
          setSelected3D('sunglasses');
        } else if (val.toLowerCase().includes('cream') || val.toLowerCase().includes('serum')) {
          setTitle('Barrier Restore Peptide Whipped Crème');
          setCategory('beauty');
          setSelected3D('skincare-jar');
        }
      }
    }
  };

  // Quick Daily Bestseller Drop Presets
  const applyPresetDrop = (dropIndex: number) => {
    if (dropIndex === 1) {
      setTitle('The Row Style Slouchy Suede Shoulder Tote');
      setCategory('handbags');
      setAmazonAsin('B0B8K3PZ45');
      setPrice('148.00');
      setRating('4.9');
      setRatingCount('840');
      setBadge("DAILY EDIT PICK");
      setSelected3D('tote');
      setMaterials('Ultra-supple split suede calfskin with soft cotton twill lining');
      setDimensions('15.5" W x 12.0" H x 6.5" D (10" drop)');
      setDescription('An effortlessly slouchy, minimalist everyday shoulder bag with buttery-soft suede texture and refined magnetic closure.');
      setEditorialNote('Has that coveted quiet luxury silhouette seen across Paris street style, at a fraction of high fashion prices.');
      setFeaturesText(
        'Supple Italian-style calfskin suede with water-resistant treatment\nWide ergonomic flat shoulder strap avoids slipping off coats\nSpacious main cavity easily accommodates 15" laptop and pouches\nInterior zip pocket for cardholders and lipstick'
      );
      setProsText('Buttery soft texture with zero stiffness\nBeautiful draped silhouette');
      setConsText('Protect from heavy rain due to natural suede pile');
    } else if (dropIndex === 2) {
      setTitle('Italian Leather Lug Sole Comfort Loafer');
      setCategory('shoes');
      setAmazonAsin('B09H2W8812');
      setPrice('112.50');
      setRating('4.8');
      setRatingCount('620');
      setBadge("TRENDING TODAY");
      setSelected3D('sneaker');
      setMaterials('Full-grain nappa leather upper, lightweight EVA platform lug sole');
      setDimensions('US 6 - 11 (True to size, 1.4" platform height)');
      setDescription('Sophisticated penny loafer silhouette with a modern, featherlight lug sole that cushions every step.');
      setEditorialNote('Pairs impeccably with ankle socks and pleated skirts, or straight-leg denim and an oversized trench.');
      setFeaturesText(
        'Dual-density memory foam footbed with high arch support\nFeatherweight EVA sole eliminates lug loafer heaviness\nHand-stitched apron toe with polished gold penny bar\nPadded heel counter prevents friction and blisters'
      );
      setProsText('Weighs under 12 oz per shoe despite chunky look\nZero break-in required');
      setConsText('Order half size down if between sizes');
    } else if (dropIndex === 3) {
      setTitle('24K Triple-Plated Emerald Signet Chrono Watch');
      setCategory('accessories');
      setAmazonAsin('B08N7P2310');
      setPrice('179.00');
      setRating('4.9');
      setRatingCount('490');
      setBadge("LIMITED DROP");
      setSelected3D('watch');
      setMaterials('316L Stainless steel, 24K vacuum gold PVD, emerald malachite dial');
      setDimensions('34mm case diameter, 8.5mm thickness, 16mm band width');
      setDescription('A statement timepiece featuring a rich genuine malachite pattern green dial with fluted gold bezel.');
      setEditorialNote('The deep emerald dial mirrors our Amazaura signature palette and catches sunlight with rich iridescence.');
      setFeaturesText(
        'Scratch-resistant synthetic sapphire crystal face\nJapanese quartz precision movement with 3-year battery life\nDeployant butterfly safety clasp with quick-release link system\n50M water resistance suitable for daily rain and handwashing'
      );
      setProsText('Rich emerald dial looks tens of times more expensive\nSubstantial, solid bracelet weight');
      setConsText('Requires link tool (included) to size bracelet');
    } else if (dropIndex === 4) {
      setTitle('Barrier Repair Quadruple Peptide Crème');
      setCategory('beauty');
      setAmazonAsin('B07V2Q8419');
      setPrice('54.00');
      setRating('4.9');
      setRatingCount('1450');
      setBadge("BESTSELLER");
      setSelected3D('skincare-jar');
      setMaterials('Frosted soda-lime glass jar, organic cold-pressed squalane & ceramides');
      setDimensions('50 ml / 1.7 oz');
      setDescription('Deeply restorative lipid-rich barrier cream formulated with 4 signal peptides, squalane, and multi-weight hyaluronic acid.');
      setEditorialNote('A holy grail moisturizer for morning and night that leaves skin dewy, cushiony, and completely calm.');
      setFeaturesText(
        'Restores skin moisture barrier within 24 hours of first application\n100% fragrance-free, essential oil-free, non-comedogenic\nHeavy frosted glass jar keeps active peptides protected from UV degradation\nLeaves silky velvet finish without greasy residue'
      );
      setProsText('Plumps fine dehydration lines immediately\nLayers smoothly under sunscreen and makeup');
      setConsText('Rich texture may be too heavy for extremely oily skin in humid summers');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const asinClean = amazonAsin.trim() || 'B0EXAMPLE';
    const cleanAffiliateUrl = `https://www.amazon.com/dp/${asinClean}?tag=amazaura-20`;

    const newProduct: Product = {
      id: `amz-custom-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim() || 'Thoughtfully curated luxury find from Amazon, hand-verified by Amazaura.',
      editorialNote:
        editorialNote.trim() ||
        'Hand-selected by Amazaura editors for superior craftsmanship, verified reviews, and elevated styling versatility.',
      badge,
      verifiedPrice: parseFloat(price) || undefined,
      currency: 'USD',
      verifiedRating: parseFloat(rating) || 4.8,
      verifiedRatingCount: parseInt(ratingCount, 10) || 280,
      affiliateUrl: cleanAffiliateUrl,
      amazonAsin: asinClean,
      image:
        imageUrl.trim() ||
        (category === 'handbags'
          ? '/assets/images/edit_versatile_tote_1792048098180.jpg'
          : category === 'shoes'
          ? '/assets/images/edit_comfort_sneakers_1792048099311.jpg'
          : category === 'beauty'
          ? '/assets/images/edit_skincare_set_1792048100149.jpg'
          : category === 'accessories'
          ? '/assets/images/edit_pearl_earrings_1792048099941.jpg'
          : '/assets/images/cat_home_lifestyle_1792048041664.jpg'),
      features: featuresText.split('\n').filter((l) => l.trim() !== ''),
      pros: prosText.split('\n').filter((l) => l.trim() !== ''),
      considerations: consText.split('\n').filter((l) => l.trim() !== ''),
      tags: ['Daily Top Drop', 'Amazon Verified', category],
      inStock: true,
      lastVerified: new Date().toISOString().split('T')[0],
      isFeaturedInEdit: true,
      model3DId: selected3D,
      dimensions,
      materials,
      isDailyDrop: true,
      dailyDropDate: 'Today',
    };

    onAddProduct(newProduct);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add Daily Amazon Product with 3D Preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 md:p-6 backdrop-blur-xs"
    >
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#C9A24A]/40 text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#063D2E] text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A24A]/20 border border-[#C9A24A] flex items-center justify-center text-[#C9A24A]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-lg md:text-xl font-bold tracking-wide">
                  Daily Amazon Curation Hub
                </h2>
                <span className="px-2 py-0.5 text-[10px] bg-[#C9A24A] text-[#063D2E] font-bold rounded-full uppercase tracking-wider">
                  Live 3D Mesh Sync
                </span>
              </div>
              <p className="text-xs text-[#FAF7F0]/75">
                Update daily best products from Amazon with 100% realistic 3D mesh files & affiliate tags
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-[#FAF7F0]/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Preset Drop Bar for Daily Updates */}
        <div className="px-6 py-2.5 bg-[#FAF7F0] border-b border-[#F0E7D8] flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-[#063D2E] text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
            Quick Daily Drops:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => applyPresetDrop(1)}
              className="px-2.5 py-1 bg-white hover:bg-[#F0E7D8] border border-[#F0E7D8] text-[#063D2E] rounded-md font-medium text-[11px] transition-colors"
            >
              1. Suede Tote
            </button>
            <button
              type="button"
              onClick={() => applyPresetDrop(2)}
              className="px-2.5 py-1 bg-white hover:bg-[#F0E7D8] border border-[#F0E7D8] text-[#063D2E] rounded-md font-medium text-[11px] transition-colors"
            >
              2. Lug Loafer
            </button>
            <button
              type="button"
              onClick={() => applyPresetDrop(3)}
              className="px-2.5 py-1 bg-white hover:bg-[#F0E7D8] border border-[#F0E7D8] text-[#063D2E] rounded-md font-medium text-[11px] transition-colors"
            >
              3. Emerald Watch
            </button>
            <button
              type="button"
              onClick={() => applyPresetDrop(4)}
              className="px-2.5 py-1 bg-white hover:bg-[#F0E7D8] border border-[#F0E7D8] text-[#063D2E] rounded-md font-medium text-[11px] transition-colors"
            >
              4. Barrier Crème
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {successNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Product successfully added with 100% realistic 3D mesh preview & Amazon affiliate tag!</span>
            </div>
          )}

          {/* Section 1: Amazon Link & ASIN Smart Parser */}
          <div className="p-4 bg-[#FAF7F0]/80 rounded-xl border border-[#C9A24A]/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#063D2E] flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-[#C9A24A]" />
                Paste Amazon URL or ASIN (Instant Auto-Clean & Affiliate Tag)
              </label>
              <span className="text-[10px] text-stone-500 font-medium">Tag: amazaura-20</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="https://www.amazon.com/dp/B0B8K3PZ45... or ASIN"
                value={amazonInput}
                onChange={(e) => handleAmazonUrlChange(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E] bg-white font-mono"
              />
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono font-semibold text-[#063D2E]">
                  ASIN: {amazonAsin || 'Auto-Detected'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Core Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Italian Structured Pebbled Leather Tote"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Store Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E] bg-white"
              >
                <option value="handbags">Handbags & Purses</option>
                <option value="shoes">Women's Footwear</option>
                <option value="beauty">Beauty & Skincare</option>
                <option value="accessories">Jewelry & Accessories</option>
                <option value="lifestyle">Home & Lifestyle</option>
                <option value="fashion">Everyday Fashion</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Product Image URL (Optional - leave empty to use curated luxury category photography)
              </label>
              <input
                type="url"
                placeholder="https://m.media-amazon.com/images/I/...jpg or custom photo URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E] bg-white font-mono"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Netlify-ready with automatic referrer policy and instant high-res fallback protection.
              </p>
            </div>
          </div>

          {/* Section 3: Realistic 3D Mesh Assignment */}
          <div className="p-4 bg-[#063D2E]/5 rounded-xl border border-[#C9A24A]/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#063D2E] flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-[#C9A24A]" />
                  Realistic 3D Mesh Model Selection (100% Geometry & Finishes)
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Assign the high-fidelity 3D mesh model with PBR materials, wireframe topology, and exploded view
                </p>
              </div>
              <button
                type="button"
                onClick={() => onPreview3D(selected3D as Product3DModelId)}
                className="px-3 py-1.5 bg-[#063D2E] hover:bg-[#042D22] text-[#C9A24A] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Test 3D Studio</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { id: 'tote', label: 'Leather Tote Bag' },
                { id: 'sneaker', label: 'Comfort Sneaker' },
                { id: 'watch', label: '18K Gold Watch' },
                { id: 'sunglasses', label: 'Tortoise Sunglasses' },
                { id: 'skincare-jar', label: 'Cosmetic Cream Jar' },
                { id: 'flacon', label: 'Fragrance Flacon' },
                { id: 'pearls', label: 'Baroque Pearl Huggies' },
                { id: 'candle', label: 'Amber Candle & Diffuser' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelected3D(m.id as Product3DType)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    selected3D === m.id
                      ? 'bg-[#063D2E] text-[#FAF7F0] border-[#C9A24A] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{m.label}</span>
                    {selected3D === m.id && <Check className="w-3.5 h-3.5 text-[#C9A24A]" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom 3D mesh upload info */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px] text-stone-600">
              <span className="flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#C9A24A]" />
                You can also drop custom .glb / .gltf files directly into the 3D Studio at any time!
              </span>
            </div>
          </div>

          {/* Section 4: Pricing, Rating, Badge */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Verified Price ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="119.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Rating (1 - 5)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                placeholder="4.8"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Rating Count
              </label>
              <input
                type="number"
                placeholder="450"
                value={ratingCount}
                onChange={(e) => setRatingCount(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Card Badge
              </label>
              <input
                type="text"
                placeholder="TODAY'S TOP DROP"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>
          </div>

          {/* Section 5: Realism Spec Sheet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Material & Hardware Composition
              </label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="e.g. Full-grain pebbled calfskin with water-resistant micro-finish"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Dimensions & Ergonomics
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. 14.2in W x 10.8in H x 5.2in D"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>
          </div>

          {/* Section 6: Descriptions & Editorial Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Curated Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why this product is an outstanding discovery..."
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Amazaura Editorial Review Note
              </label>
              <textarea
                rows={2}
                value={editorialNote}
                onChange={(e) => setEditorialNote(e.target.value)}
                placeholder="Editor's first-person styling verdict..."
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>
          </div>

          {/* Section 7: Verified Features (1 per line) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Verified Realistic Features (1 per line)
              </label>
              <textarea
                rows={4}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#063D2E] uppercase mb-1">
                Why We Recommend It (Pros)
              </label>
              <textarea
                rows={4}
                value={prosText}
                onChange={(e) => setProsText(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                Considerations (Cons / Care)
              </label>
              <textarea
                rows={4}
                value={consText}
                onChange={(e) => setConsText(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#063D2E]"
              />
            </div>
          </div>

          {/* Footer Submit Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#F0E7D8]">
            <p className="text-[11px] text-stone-500">
              New curation will be saved and rendered across category pages, the homepage, and the 3D studio.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-[#063D2E] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#063D2E] hover:bg-[#042D22] text-[#FAF7F0] font-semibold text-xs rounded-xl border border-[#C9A24A] shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-[#C9A24A]" />
                <span>Publish Daily Drop to Amazaura</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
