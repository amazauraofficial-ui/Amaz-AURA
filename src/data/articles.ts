import type { Article } from '../types/index.ts';

export const articles: Article[] = [
  {
    id: 'guide-everyday-handbag',
    title: 'How to Choose an Everyday Handbag: Form, Function & Proportion',
    slug: 'how-to-choose-everyday-handbag',
    excerpt: 'A practical buying guide to evaluating leather weight, strap drop dimensions, interior dividers, and hardware longevity before clicking buy.',
    category: 'Handbags & Style',
    readTime: '5 min read',
    date: 'October 14, 2026',
    author: 'Amazaura Editorial Desk',
    image: '/src/assets/images/cat_handbags_purses_1792048038968.jpg',
    sections: [
      {
        heading: '1. The Weight-to-Volume Ratio',
        body: 'The most common regret with leather work totes is base weight. If an empty bag weighs over 2.2 pounds (1 kg), filling it with a laptop, charger, water bottle, and wallet quickly strains your trapezius muscles. Look for structured composite leathers or pebbled finishes that provide rigidity without dense leaden backing.',
        tip: 'Measure your daily laptop diagonally and add 1 inch to the bag’s interior base width for comfortable slide-in clearance.',
      },
      {
        heading: '2. Strap Drop: The Winter Coat Test',
        body: 'A tote strap with an 8-inch drop fits comfortably over a summer t-shirt, but binds uncomfortably when wearing a wool coat or down parka. Aim for a 9.5 to 11-inch handle drop, or insist on a secondary detachable crossbody strap with swivel clips.',
      },
      {
        heading: '3. Hardware Finishes That Endure',
        body: 'High-gloss yellow gold hardware often shows micro-scratches within weeks. Brushed brass or muted champagne gold finishes maintain their luxury lustre significantly longer and match a wider array of everyday jewelry.',
      },
    ],
  },
  {
    id: 'guide-versatile-shoe-collection',
    title: 'Building a Versatile Women’s Shoe Collection: 5 Core Silhouettes',
    slug: 'versatile-shoe-collection',
    excerpt: 'Streamline your footwear rotation down to five timeless anchors that navigate work meetings, travel days, and weekend dinners seamlessly.',
    category: 'Footwear & Wardrobe',
    readTime: '6 min read',
    date: 'October 12, 2026',
    author: 'Amazaura Editorial Desk',
    image: '/src/assets/images/cat_womens_shoes_1792048039821.jpg',
    sections: [
      {
        heading: '1. The Clean White Low-Profile Sneaker',
        body: 'Minimalist leather sneakers have permanently replaced stiff flats as the modern professional commute hero. Pair them with tailored ankle trousers, fluid wide-leg jeans, or silk midi skirts.',
        tip: 'Choose sneakers with removable leather insoles so you can swap in custom orthotics without altering the shoe size.',
      },
      {
        heading: '2. The Nude or Tan Block Heel Pump',
        body: 'Heels between 2.25 and 3 inches provide flattering leg elongation while keeping pressure off the balls of your feet. Neutral tones matching your skin tone or a warm camel work across every color wheel.',
      },
      {
        heading: '3. The Buttery Loafer with Cushioned Footbed',
        body: 'An almond or softly squared-toe loafer bridges the gap between formal oxford shoes and casual slippers, giving instant tailored polish to oversized knitwear.',
      },
    ],
  },
  {
    id: 'guide-beauty-essentials-comparing',
    title: 'Beauty Essentials Worth Comparing: Squalane, Ceramides & Peptides',
    slug: 'beauty-essentials-comparing',
    excerpt: 'Cutting through marketing buzzwords: what each ingredient actually does for skin elasticity, barrier health, and morning radiance.',
    category: 'Beauty & Skincare',
    readTime: '4 min read',
    date: 'October 10, 2026',
    author: 'Amazaura Editorial Desk',
    image: '/src/assets/images/cat_beauty_skincare_1792048040765.jpg',
    sections: [
      {
        heading: '1. Plant Squalane vs. Heavy Mineral Oils',
        body: 'Unlike heavy pore-clogging occlusives, sugarcane-derived squalane biomimics human skin sebum. It absorbs within 45 seconds, delivering a lit-from-within glow that locks in hydration without sheen.',
      },
      {
        heading: '2. Why Multi-Peptides Belong in Your 30s Routine',
        body: 'Peptides are short chains of amino acids that signal skin cells to produce collagen and elastin. When paired with ceramides, they repair environmental lipid damage caused by harsh weather and AC.',
        tip: 'Always apply active serums to slightly damp skin immediately after cleansing for 3x deeper absorption.',
      },
    ],
  },
];
