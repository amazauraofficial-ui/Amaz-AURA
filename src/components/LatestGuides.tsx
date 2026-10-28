import React from 'react';
import type { Article } from '../types/index.ts';
import { ArrowRight, BookOpen } from 'lucide-react';
import { handleImageError } from '../utils/image.ts';

interface LatestGuidesProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onViewAllGuides: () => void;
}

export const LatestGuides: React.FC<LatestGuidesProps> = ({
  articles,
  onSelectArticle,
  onViewAllGuides,
}) => {
  const displayArticles = articles.slice(0, 3);

  return (
    <section className="w-full py-16 bg-[#FAF7F0] border-b border-[#F0E7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#063D2E] mb-1">
              <BookOpen className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Editorial Journal</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#063D2E]">
              Latest Guides & Styling Notes
            </h2>
          </div>
          <button
            onClick={onViewAllGuides}
            className="text-xs font-semibold uppercase tracking-wider text-[#063D2E] hover:text-[#C9A24A] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#F0E7D8] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={article.image}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => handleImageError(e, 'editorial')}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#063D2E] rounded-md uppercase tracking-wider">
                  {article.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-[#063D2E] group-hover:text-[#C9A24A] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 font-light leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#063D2E] group-hover:text-[#C9A24A] transition-colors">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
