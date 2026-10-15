import type { Product, CatalogFilterState, SortOption } from '../types/index.ts';

/**
 * Validates and formats an Amazon affiliate link with the configured affiliate tag.
 */
export function getValidAffiliateUrl(product: Product, affiliateTag = 'amazaura-20'): { url: string; isValid: boolean } {
  if (!product.affiliateUrl || product.affiliateUrl.trim() === '') {
    return {
      url: `https://www.amazon.com/dp/${product.amazonAsin || 'B0EXAMPLE'}?tag=${affiliateTag}`,
      isValid: true,
    };
  }

  try {
    const url = new URL(product.affiliateUrl);
    if (!url.searchParams.has('tag')) {
      url.searchParams.set('tag', affiliateTag);
    }
    return { url: url.toString(), isValid: true };
  } catch {
    return {
      url: `https://www.amazon.com/dp/${product.amazonAsin || 'B0EXAMPLE'}?tag=${affiliateTag}`,
      isValid: true,
    };
  }
}

/**
 * Formats a verified numerical price into a clean localized currency string.
 */
export function formatPrice(price?: number, currency = 'USD'): string {
  if (price === undefined || price === null || isNaN(price)) {
    return 'Check Amazon';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

/**
 * Filters the product catalog based on search query, category, tag, and price bounds.
 */
export function filterProducts(products: Product[], filter: Partial<CatalogFilterState>): Product[] {
  return products.filter((product) => {
    // Category match
    if (filter.category && filter.category !== 'all' && filter.category !== 'edit') {
      if (product.category !== filter.category) return false;
    }

    // Special "edit" filter
    if (filter.category === 'edit' && !product.isFeaturedInEdit) {
      return false;
    }

    // Tag match
    if (filter.selectedTag && !product.tags.includes(filter.selectedTag)) {
      return false;
    }

    // Search query match
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase().trim();
      const inTitle = product.title.toLowerCase().includes(q);
      const inDesc = product.description.toLowerCase().includes(q);
      const inNote = product.editorialNote.toLowerCase().includes(q);
      const inTags = product.tags.some((t) => t.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inNote && !inTags) return false;
    }

    // Price filtering
    if (filter.minPrice !== undefined && (product.verifiedPrice === undefined || product.verifiedPrice < filter.minPrice)) {
      return false;
    }
    if (filter.maxPrice !== undefined && (product.verifiedPrice === undefined || product.verifiedPrice > filter.maxPrice)) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts products deterministically by specified criteria.
 */
export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const list = [...products];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => (a.verifiedPrice ?? 0) - (b.verifiedPrice ?? 0));
    case 'price-desc':
      return list.sort((a, b) => (b.verifiedPrice ?? 0) - (a.verifiedPrice ?? 0));
    case 'rating':
      return list.sort((a, b) => (b.verifiedRating ?? 0) - (a.verifiedRating ?? 0));
    case 'name-asc':
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'featured':
    default:
      return list.sort((a, b) => {
        if (a.isFeaturedInEdit && !b.isFeaturedInEdit) return -1;
        if (!a.isFeaturedInEdit && b.isFeaturedInEdit) return 1;
        return 0;
      });
  }
}
