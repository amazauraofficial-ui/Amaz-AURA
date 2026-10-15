import React from 'react';
import type { Article } from '../types/index.ts';
import { X, Calendar, Clock, User, Sparkles } from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 md:p-6 backdrop-blur-xs"
    >
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#F0E7D8]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF7F0] border-b border-[#F0E7D8]">
          <div className="flex items-center gap-2 text-xs text-[#063D2E] font-semibold uppercase tracking-wider">
            <span>{article.category}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close article"
            className="p-1.5 text-stone-400 hover:text-[#063D2E] rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 space-y-6 text-left">
          {/* Headline & Meta */}
          <div className="space-y-3 pb-6 border-b border-[#F0E7D8]">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#063D2E] leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C9A24A]" /> {article.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C9A24A]" /> {article.readTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#C9A24A]" /> {article.author}
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 border border-[#F0E7D8]">
            <img
              src={article.image}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Excerpt Lead */}
          <p className="text-base text-stone-700 font-normal leading-relaxed italic bg-[#FAF7F0] p-4 rounded-xl border-l-2 border-[#C9A24A]">
            {article.excerpt}
          </p>

          {/* Body Sections */}
          <div className="space-y-8 pt-2">
            {article.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="font-editorial text-xl font-bold text-[#063D2E]">
                  {section.heading}
                </h2>
                <p className="text-sm text-stone-700 leading-relaxed font-light">
                  {section.body}
                </p>
                {section.tip && (
                  <div className="p-3 bg-[#FAF7F0] border border-[#C9A24A]/40 rounded-lg text-xs text-[#063D2E] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Editorial Stylist Tip:</strong> {section.tip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Editorial Signoff & Affiliate Disclosure */}
          <div className="pt-8 border-t border-[#F0E7D8] text-center space-y-2">
            <p className="text-xs text-stone-500 italic">
              Amazaura Editorial Desk curates honest styling notes independently.
            </p>
            <p className="text-[11px] text-stone-400">
              🌿 As an Amazon Associate I earn from qualifying purchases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
