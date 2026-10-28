import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveImageUrl, CATEGORY_FALLBACK_IMAGES, DEFAULT_LUXURY_IMAGE } from './image.ts';

test('resolveImageUrl converts /src/assets/images to /assets/images for Netlify production', () => {
  const input = '/src/assets/images/hero_amazaura_luxury_1792048038650.jpg';
  const resolved = resolveImageUrl(input);
  assert.equal(resolved, '/assets/images/hero_amazaura_luxury_1792048038650.jpg');
});

test('resolveImageUrl preserves external URLs and clean assets paths', () => {
  const external = 'https://m.media-amazon.com/images/I/71example.jpg';
  assert.equal(resolveImageUrl(external), external);

  const cleanLocal = '/assets/images/cat_womens_shoes_1792048039821.jpg';
  assert.equal(resolveImageUrl(cleanLocal), cleanLocal);
});

test('resolveImageUrl falls back to category fallback when empty', () => {
  assert.equal(resolveImageUrl('', 'handbags'), CATEGORY_FALLBACK_IMAGES.handbags);
  assert.equal(resolveImageUrl(undefined, 'shoes'), CATEGORY_FALLBACK_IMAGES.shoes);
  assert.equal(resolveImageUrl(undefined, undefined), DEFAULT_LUXURY_IMAGE);
});
