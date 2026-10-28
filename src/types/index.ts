export type CategoryId =
  | 'fashion'
  | 'handbags'
  | 'shoes'
  | 'beauty'
  | 'accessories'
  | 'lifestyle'
  | 'gifts'
  | 'edit';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  heroHeadline: string;
}

export type Product3DType =
  | 'flacon'
  | 'tote'
  | 'pearls'
  | 'candle'
  | 'sneaker'
  | 'sunglasses'
  | 'watch'
  | 'skincare-jar';

export interface Product {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  editorialNote: string;
  badge?: string;
  verifiedPrice?: number;
  currency?: string;
  verifiedRating?: number;
  verifiedRatingCount?: number;
  affiliateUrl: string;
  amazonAsin?: string;
  image: string;
  gallery?: string[];
  features: string[];
  pros: string[];
  considerations: string[];
  tags: string[];
  inStock: boolean;
  lastVerified: string;
  isFeaturedInEdit?: boolean;
  collection?: string;
  model3DId?: Product3DType;
  custom3dUrl?: string;
  dimensions?: string;
  materials?: string;
  weight?: string;
  isDailyDrop?: boolean;
  dailyDropDate?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  sections: {
    heading: string;
    body: string;
    tip?: string;
  }[];
  relatedProducts?: string[];
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc';

export interface CatalogFilterState {
  searchQuery: string;
  category: CategoryId | 'all';
  sortBy: SortOption;
  selectedTag?: string;
  minPrice?: number;
  maxPrice?: number;
}
