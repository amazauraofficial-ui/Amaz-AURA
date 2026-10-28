import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreEdit: () => void;
  onDiscoverFinds: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreEdit, onDiscoverFinds }) => {
  return (
    <section className="relative w-full bg-[#063D2E] text-white overflow-hidden border-b border-[#C9A24A]/30">
      {/* Background subtle gold ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#042D22] rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & CTAs */}
          <div className="lg:col-span-5 space-y-6 z-10 text-left">
            {/* Elegant Botanical Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A24A]">
              <svg className="w-4 h-4 text-[#C9A24A]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 4C14.2 4 16.2 4.9 17.7 6.3C16.2 8.3 14 11 12 11C10 11 7.8 8.3 6.3 6.3C7.8 4.9 9.8 4 12 4ZM4 12C4 10.3 4.5 8.7 5.4 7.4C7.1 9.7 9.5 12.6 11.5 12.9C11.3 14.5 10.8 17.3 10.4 19.8C6.8 18.7 4 15.7 4 12ZM12 20C12.3 18.4 12.8 15.6 13 13.9C15 13.6 17.4 10.7 19.1 8.4C19.7 9.5 20 10.7 20 12C20 16.4 16.4 20 12 20Z" />
              </svg>
              <span>Thoughtfully Selected For You</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-[#FAF7F0]">
              CURATED FINDS.
              <span className="block mt-1 text-[#C9A24A] font-normal italic">
                ELEVATED EVERYDAY LIVING.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#FAF7F0]/80 font-light leading-relaxed max-w-lg">
              Discover thoughtfully selected style, beauty, and lifestyle favorites for the way you live.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreEdit}
                className="px-6 py-3.5 bg-[#042D22] text-[#FAF7F0] hover:bg-[#084b39] active:scale-[0.98] border border-[#C9A24A] rounded-full text-sm font-semibold tracking-wide flex items-center gap-2.5 shadow-lg shadow-black/20 transition-all group"
              >
                <span>Explore the Edit</span>
                <ArrowRight className="w-4 h-4 text-[#C9A24A] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onDiscoverFinds}
                className="px-5 py-3 text-sm font-medium text-[#FAF7F0]/90 hover:text-white hover:underline underline-offset-4 transition-colors"
              >
                Discover Top Finds
              </button>
            </div>

            {/* Subtle Trust Micro-Feature */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-4 text-xs text-[#FAF7F0]/60">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" /> Editorial curation
              </span>
              <span>·</span>
              <span>Vetted silhouettes</span>
              <span>·</span>
              <span>Direct Amazon links</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Matching Uploaded Reference */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#C9A24A]/40 shadow-2xl bg-[#042D22]">
              <img
                src="/assets/images/hero_amazaura_luxury_1792048038650.jpg"
                alt="Amazaura curated lifestyle collection: leather handbag, nude pumps, white sneakers, perfume bottle and hydrangeas"
                className="w-full h-auto object-cover max-h-[460px] transform hover:scale-[1.02] transition-transform duration-700"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              {/* Bottom Subtle Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#063D2E]/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
