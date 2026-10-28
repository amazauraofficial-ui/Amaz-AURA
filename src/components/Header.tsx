import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { Search, Heart, Menu, X, Sparkles, Box, PlusCircle } from 'lucide-react';
import type { CategoryId } from '../types/index.ts';

interface HeaderProps {
  currentCategory: CategoryId | 'home' | 'guides' | 'about' | 'disclosure' | 'contact' | 'privacy' | 'terms';
  onNavigate: (page: any) => void;
  onOpenSearch: () => void;
  onOpenFavorites: () => void;
  onOpen3DViewer: () => void;
  onOpenMoodboard: () => void;
  onOpenProductManager?: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onNavigate,
  onOpenSearch,
  onOpenFavorites,
  onOpen3DViewer,
  onOpenMoodboard,
  onOpenProductManager,
  favoritesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: Array<{ label: string; id: CategoryId | 'home' | 'guides' | 'about' }> = [
    { label: 'Home', id: 'home' },
    { label: 'Fashion', id: 'fashion' },
    { label: 'Handbags', id: 'handbags' },
    { label: 'Shoes', id: 'shoes' },
    { label: 'Beauty', id: 'beauty' },
    { label: 'Accessories', id: 'accessories' },
    { label: 'Lifestyle', id: 'lifestyle' },
    { label: 'The Edit', id: 'edit' },
    { label: 'Guides', id: 'guides' },
    { label: 'About', id: 'about' },
  ];

  const handleLinkClick = (id: CategoryId | 'home' | 'guides' | 'about') => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#F0E7D8] shadow-xs transition-all">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#042D22] text-[#FAF7F0] py-2 px-4 text-center border-b border-[#C9A24A]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs tracking-wider">
          <span className="hidden sm:inline-block w-8 h-[1px] bg-[#C9A24A]/60" />
          <span className="font-medium text-[#FAF7F0] italic">
            Thoughtfully curated finds for your everyday
          </span>
          <span className="hidden sm:inline-block w-8 h-[1px] bg-[#C9A24A]/60" />
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleLinkClick('home')}
            className="text-left focus:outline-none group transition-opacity"
            aria-label="Amazaura Home"
          >
            <BrandLogo variant="dark" size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentCategory === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-sm font-medium tracking-wide transition-all whitespace-nowrap shrink-0 relative py-1 ${
                    isActive
                      ? 'text-[#063D2E] font-semibold'
                      : 'text-[#252525]/75 hover:text-[#063D2E]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A24A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Suite: Search, 3D Studio, Moodboard, Saved, Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Add Product / Curation Hub Trigger */}
            {onOpenProductManager && (
              <button
                onClick={onOpenProductManager}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#042D22] bg-[#C9A24A]/25 hover:bg-[#C9A24A]/40 border border-[#C9A24A]/50 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                title="Add Daily Amazon Product & 3D Mesh"
                aria-label="Add Daily Amazon Product"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#063D2E]" />
                <span>+ Add Find</span>
              </button>
            )}

            {/* 3D Studio Trigger */}
            <button
              onClick={onOpen3DViewer}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#063D2E] bg-[#F0E7D8]/70 hover:bg-[#C9A24A]/20 border border-[#C9A24A]/30 rounded-lg transition-colors whitespace-nowrap"
              title="Inspect 3D Product Vault"
              aria-label="Open 3D Luxury Studio"
            >
              <Box className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>3D Studio</span>
            </button>

            {/* AI Moodboard Generator Trigger */}
            <button
              onClick={onOpenMoodboard}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#063D2E] bg-[#F0E7D8]/70 hover:bg-[#C9A24A]/20 border border-[#C9A24A]/30 rounded-lg transition-colors whitespace-nowrap"
              title="Generate Lookbooks & Moodboards"
              aria-label="Open AI Moodboard Studio"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>AI Lookbook</span>
            </button>

            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-[#252525] hover:text-[#063D2E] hover:bg-[#F0E7D8]/50 rounded-full transition-colors"
              aria-label="Search curated finds"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Saved Finds Drawer Trigger */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2.5 text-[#252525] hover:text-[#063D2E] hover:bg-[#F0E7D8]/50 rounded-full transition-colors"
              aria-label={`Saved items (${favoritesCount})`}
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-[#C9A24A] text-[#C9A24A]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#063D2E] text-[#C9A24A] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 text-[#252525] hover:text-[#063D2E] hover:bg-[#F0E7D8]/50 rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#F0E7D8] bg-[#FAF7F0] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-[#F0E7D8]">
            <button
              onClick={() => {
                onOpen3DViewer();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2 bg-[#F0E7D8] text-xs font-semibold text-[#063D2E] rounded-lg"
            >
              <Box className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>3D Studio</span>
            </button>
            <button
              onClick={() => {
                onOpenMoodboard();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2 bg-[#F0E7D8] text-xs font-semibold text-[#063D2E] rounded-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>AI Lookbook</span>
            </button>
            {onOpenProductManager && (
              <button
                onClick={() => {
                  onOpenProductManager();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2 bg-[#C9A24A]/30 text-xs font-semibold text-[#042D22] rounded-lg border border-[#C9A24A]/50"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#063D2E]" />
                <span>+ Daily Drop</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentCategory === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3 py-2 text-sm text-left font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#063D2E] text-white font-semibold'
                      : 'text-[#252525] hover:bg-[#F0E7D8]/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
