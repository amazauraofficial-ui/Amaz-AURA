/**
 * Image resolution and fallback utilities for Amazaura.
 * Ensures 100% reliable image loading on Netlify, localhost, and production.
 */

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  handbags: '/assets/images/cat_handbags_purses_1792048038968.jpg',
  shoes: '/assets/images/cat_womens_shoes_1792048039821.jpg',
  beauty: '/assets/images/cat_beauty_skincare_1792048040765.jpg',
  accessories: '/assets/images/cat_accessories_jewelry_1792048040800.jpg',
  lifestyle: '/assets/images/cat_home_lifestyle_1792048041664.jpg',
  fashion: '/assets/images/hero_amazaura_luxury_1792048038650.jpg',
  gifts: '/assets/images/cat_home_lifestyle_1792048041664.jpg',
  edit: '/assets/images/hero_amazaura_luxury_1792048038650.jpg',
};

export const DEFAULT_LUXURY_IMAGE = '/assets/images/hero_amazaura_luxury_1792048038650.jpg';

/**
 * Normalizes an image path so it resolves seamlessly both in dev and Netlify production.
 */
export function resolveImageUrl(src?: string, category?: string): string {
  if (!src || src.trim() === '') {
    if (category && CATEGORY_FALLBACK_IMAGES[category]) {
      return CATEGORY_FALLBACK_IMAGES[category];
    }
    return DEFAULT_LUXURY_IMAGE;
  }

  // Convert old relative /src/assets/images/... to canonical /assets/images/...
  if (src.startsWith('/src/assets/images/')) {
    return src.replace('/src/assets/images/', '/assets/images/');
  }

  return src;
}

/**
 * Graceful image onError handler for <img> tags.
 * Replaces broken or blocked images with curated luxury category photography,
 * avoiding broken image placeholders entirely on Netlify.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  category?: string
): void {
  const target = event.currentTarget;
  if (target.dataset.hasFailedFallback === 'true') {
    return; // Prevent infinite fallback recursion
  }

  target.dataset.hasFailedFallback = 'true';
  const fallback = (category && CATEGORY_FALLBACK_IMAGES[category]) || DEFAULT_LUXURY_IMAGE;

  // If already at fallback, stop
  if (target.src.endsWith(fallback) || target.src === fallback) {
    return;
  }

  target.src = fallback;
}
