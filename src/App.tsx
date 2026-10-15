import React, { useState, useEffect } from 'react';
import type { CategoryId, Product, Article } from './types/index.ts';
import { categories } from './data/categories.ts';
import { products } from './data/products.ts';
import { articles } from './data/articles.ts';

// Components
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { CategoryCards } from './components/CategoryCards.tsx';
import { AmazauraEdit } from './components/AmazauraEdit.tsx';
import { CuratedCollections } from './components/CuratedCollections.tsx';
import { WhyAmazaura } from './components/WhyAmazaura.tsx';
import { LatestGuides } from './components/LatestGuides.tsx';
import { Footer } from './components/Footer.tsx';
import { CategoryPage } from './components/CategoryPage.tsx';
import { EditorialPages } from './components/EditorialPages.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { FavoritesDrawer } from './components/FavoritesDrawer.tsx';
import { ArticleModal } from './components/ArticleModal.tsx';
import { ThreeLuxuryViewer } from './components/ThreeLuxuryViewer.tsx';
import { MoodboardStudio } from './components/MoodboardStudio.tsx';
import { ArrowUp } from 'lucide-react';

type PageState =
  | 'home'
  | CategoryId
  | 'guides'
  | 'about'
  | 'disclosure'
  | 'contact'
  | 'privacy'
  | 'terms';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Modals & Drawers state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [isMoodboardOpen, setIsMoodboardOpen] = useState(false);

  // Saved favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('amazaura_favorites');
      return saved ? JSON.parse(saved) : ['amz-handbag-tote-01'];
    } catch {
      return ['amz-handbag-tote-01'];
    }
  });

  // Back to top visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleFavorite = (product: Product) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id];
      try {
        localStorage.setItem('amazaura_favorites', JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.filter((i) => i !== id);
      try {
        localStorage.setItem('amazaura_favorites', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleClearFavorites = () => {
    setFavoriteIds([]);
    try {
      localStorage.removeItem('amazaura_favorites');
    } catch {
      // ignore
    }
  };

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  const handleNavigate = (page: PageState) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active category if currently on category view
  const currentCategoryObj = categories.find((c) => c.id === currentPage);

  // Scroll to top button action
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#252525] selection:bg-[#063D2E] selection:text-[#C9A24A]">
      {/* Sticky Global Header */}
      <Header
        currentCategory={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpen3DViewer={() => setIs3DViewerOpen(true)}
        onOpenMoodboard={() => setIsMoodboardOpen(true)}
        favoritesCount={favoriteIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HOMEPAGE VIEW */}
        {currentPage === 'home' && (
          <>
            {/* Section A: Hero */}
            <Hero
              onExploreEdit={() => handleNavigate('edit')}
              onDiscoverFinds={() => {
                const editSection = document.getElementById('the-edit-section');
                if (editSection) {
                  editSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNavigate('handbags');
                }
              }}
            />

            {/* Section B: Shop by Category */}
            <CategoryCards onSelectCategory={(catId) => handleNavigate(catId)} />

            {/* Section C: The Amazaura Edit */}
            <div id="the-edit-section">
              <AmazauraEdit
                products={products}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onToggleFavorite={handleToggleFavorite}
                favorites={favoriteIds}
                onViewAllEdit={() => handleNavigate('edit')}
              />
            </div>

            {/* Section D: Curated Collections */}
            <CuratedCollections
              onSelectCollection={(catId) => handleNavigate(catId)}
            />

            {/* Section E: Why Amazaura? */}
            <WhyAmazaura />

            {/* Section F: Latest Editorial Guides */}
            <LatestGuides
              articles={articles}
              onSelectArticle={(art) => setSelectedArticle(art)}
              onViewAllGuides={() => handleNavigate('guides')}
            />
          </>
        )}

        {/* CATEGORY PAGE VIEW */}
        {currentCategoryObj && (
          <CategoryPage
            category={currentCategoryObj}
            products={products}
            articles={articles}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onToggleFavorite={handleToggleFavorite}
            favorites={favoriteIds}
            onSelectArticle={(art) => setSelectedArticle(art)}
            onSelectCategory={(catId) => handleNavigate(catId)}
          />
        )}

        {/* GUIDES JOURNAL VIEW */}
        {currentPage === 'guides' && (
          <div className="w-full bg-[#FAF7F0] min-h-screen py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
                  The Amazaura Journal
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#063D2E]">
                  Editorial Guides & Styling Notes
                </h1>
                <p className="text-sm text-stone-600 font-light">
                  Carefully researched buying advice, wardrobe proportion tips, and clean beauty ingredient breakdowns.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles.map((art) => (
                  <article
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#F0E7D8] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between text-left"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                      <img
                        src={art.image}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 text-[11px] font-semibold text-[#063D2E] rounded-md">
                        {art.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[11px] text-stone-400 block">{art.date} · {art.readTime}</span>
                        <h2 className="font-editorial text-lg font-bold text-[#063D2E] group-hover:text-[#C9A24A] transition-colors leading-snug">
                          {art.title}
                        </h2>
                        <p className="text-xs text-stone-600 line-clamp-3 font-light leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                      <div className="pt-3 text-xs font-semibold text-[#063D2E] group-hover:text-[#C9A24A]">
                        Read Article →
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EDITORIAL / TRUST / LEGAL PAGES */}
        {(currentPage === 'about' ||
          currentPage === 'disclosure' ||
          currentPage === 'contact' ||
          currentPage === 'privacy' ||
          currentPage === 'terms') && (
          <EditorialPages page={currentPage} onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Back to top floating button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 p-3 bg-[#063D2E] text-[#C9A24A] border border-[#C9A24A]/40 rounded-full shadow-lg hover:bg-[#042D22] transition-all transform hover:scale-105"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedProduct ? favoriteIds.includes(selectedProduct.id) : false}
        relatedProducts={products.filter((p) => p.id !== selectedProduct?.id && p.category === selectedProduct?.category)}
        onSelectRelated={(p) => setSelectedProduct(p)}
      />

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Saved Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteProducts}
        onRemoveFavorite={handleRemoveFavorite}
        onClearFavorites={handleClearFavorites}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Three.js 3D Luxury Product Viewer Modal */}
      <ThreeLuxuryViewer
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
      />

      {/* AI Moodboard Studio Modal (gemini-3-pro-image-preview & 1K/2K/4K) */}
      <MoodboardStudio
        isOpen={isMoodboardOpen}
        onClose={() => setIsMoodboardOpen(false)}
      />
    </div>
  );
}
