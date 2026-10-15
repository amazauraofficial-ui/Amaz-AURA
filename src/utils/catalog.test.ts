import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts, sortProducts, formatPrice, getValidAffiliateUrl } from './catalog.ts';
import type { Product } from '../types/index.ts';

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Chic Pebbled Tote Bag',
    category: 'handbags',
    description: 'A versatile everyday tote.',
    editorialNote: 'Our top daily carry pick.',
    badge: 'EVERYDAY STYLE',
    verifiedPrice: 128.5,
    verifiedRating: 4.8,
    verifiedRatingCount: 340,
    affiliateUrl: 'https://www.amazon.com/dp/B08XYZ1234',
    amazonAsin: 'B08XYZ1234',
    image: '/src/assets/images/edit_versatile_tote_1792048098180.jpg',
    features: ['Genuine pebble grain', 'Fits 14-inch laptop'],
    pros: ['Spacious', 'Sturdy handles'],
    considerations: ['Spot clean only'],
    tags: ['Everyday', 'Workwear', 'Leather'],
    inStock: true,
    lastVerified: '2026-10-14',
    isFeaturedInEdit: true,
  },
  {
    id: 'prod-2',
    title: 'White Leather Comfort Sneaker',
    category: 'shoes',
    description: 'Clean luxury minimalist sneaker.',
    editorialNote: 'Subtle gold heel trim.',
    verifiedPrice: 94.0,
    verifiedRating: 4.6,
    verifiedRatingCount: 190,
    affiliateUrl: 'https://www.amazon.com/dp/B07ABC9999?tag=amazaura-20',
    amazonAsin: 'B07ABC9999',
    image: '/src/assets/images/edit_comfort_sneakers_1792048099311.jpg',
    features: ['Orthopedic foam', 'Italian calfskin'],
    pros: ['Zero break-in', 'Versatile with dresses or denim'],
    considerations: ['Sizes run slightly narrow'],
    tags: ['Sneakers', 'Travel', 'Everyday'],
    inStock: true,
    lastVerified: '2026-10-14',
    isFeaturedInEdit: false,
  },
];

test('formatPrice formats numerical price as USD currency correctly', () => {
  assert.equal(formatPrice(128.5), '$128.50');
  assert.equal(formatPrice(undefined), 'Check Amazon');
});

test('getValidAffiliateUrl appends affiliate tag when missing', () => {
  const res = getValidAffiliateUrl(mockProducts[0], 'amazaura-20');
  assert.equal(res.isValid, true);
  assert.ok(res.url.includes('tag=amazaura-20'));
});

test('filterProducts filters by category correctly', () => {
  const handbagsOnly = filterProducts(mockProducts, { category: 'handbags' });
  assert.equal(handbagsOnly.length, 1);
  assert.equal(handbagsOnly[0].id, 'prod-1');

  const shoesOnly = filterProducts(mockProducts, { category: 'shoes' });
  assert.equal(shoesOnly.length, 1);
  assert.equal(shoesOnly[0].id, 'prod-2');
});

test('filterProducts searches title and tags by keyword query', () => {
  const searchTote = filterProducts(mockProducts, { searchQuery: 'pebbled' });
  assert.equal(searchTote.length, 1);
  assert.equal(searchTote[0].id, 'prod-1');

  const searchTravel = filterProducts(mockProducts, { searchQuery: 'Travel' });
  assert.equal(searchTravel.length, 1);
  assert.equal(searchTravel[0].id, 'prod-2');
});

test('sortProducts sorts by price asc and desc', () => {
  const asc = sortProducts(mockProducts, 'price-asc');
  assert.equal(asc[0].id, 'prod-2'); // 94.00 < 128.50

  const desc = sortProducts(mockProducts, 'price-desc');
  assert.equal(desc[0].id, 'prod-1'); // 128.50 > 94.00
});
