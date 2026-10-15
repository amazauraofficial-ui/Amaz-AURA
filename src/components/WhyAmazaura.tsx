import React from 'react';
import { Compass, Sparkles, Eye, ShieldCheck } from 'lucide-react';

export const WhyAmazaura: React.FC = () => {
  const pillars = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#C9A24A]" />,
      title: 'Thoughtfully Selected Finds',
      description:
        'We filter through thousands of online listings to bring you only timeless silhouettes, cohesive palettes, and well-designed staples that stand the test of time.',
    },
    {
      icon: <Compass className="w-5 h-5 text-[#C9A24A]" />,
      title: 'Everyday Style & Practicality',
      description:
        'Fashion and home goods should serve real life. We prioritize lightweight bags, walkable arch support, and low-maintenance materials for modern routines.',
    },
    {
      icon: <Eye className="w-5 h-5 text-[#C9A24A]" />,
      title: 'Easy Product Discovery',
      description:
        'Skip the algorithmic clutter. Our editorial layout gives you clean comparisons, direct links, and clear pros & considerations to streamline your decisions.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C9A24A]" />,
      title: 'Transparent Affiliate Recommendations',
      description:
        'We never charge visitors for our curation. When you click through our Amazon Associate links and make a qualifying purchase, we may earn a modest commission at no extra cost to you.',
    },
  ];

  return (
    <section className="w-full py-16 bg-[#F0E7D8]/40 border-b border-[#F0E7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#063D2E]">
            Our Editorial Commitment
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#063D2E] mt-1">
            Why Amazaura?
          </h2>
          <p className="text-sm text-stone-600 mt-2 font-light">
            An independent perspective dedicated to helping you discover elevated everyday pieces with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#F0E7D8] shadow-xs flex flex-col space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#063D2E]/5 border border-[#C9A24A]/30 flex items-center justify-center">
                {pillar.icon}
              </div>
              <h3 className="font-editorial text-lg font-bold text-[#063D2E]">
                {pillar.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
