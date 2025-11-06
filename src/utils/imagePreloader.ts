/**
 * Preloads card images to improve performance
 */

import { allCards } from '../data/cards';
import { getCardImagePath } from './cardImageMapper';
import cardBackImg from '../assets/Cards-png/CardBacks.png';

const imageCache = new Map<string, HTMLImageElement>();

export function preloadImage(src: string): Promise<void> {
  // Check if already cached
  if (imageCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

/**
 * Preload all tarot card images
 * Returns a promise that resolves when all images are loaded
 */
export async function preloadAllCards(
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const cardImages: string[] = [];

  // Card back
  cardImages.push(cardBackImg);

  // Get all card image paths
  allCards.forEach(card => {
    try {
      const imagePath = getCardImagePath(card);
      cardImages.push(imagePath);
    } catch (error) {
      console.warn(`Failed to get image path for card: ${card.name}`, error);
    }
  });

  // Load images with progress tracking
  let loaded = 0;
  const total = cardImages.length;

  for (const imageSrc of cardImages) {
    try {
      await preloadImage(imageSrc);
      loaded++;
      if (onProgress) {
        onProgress(loaded, total);
      }
    } catch (error) {
      console.warn(`Failed to preload image: ${imageSrc}`, error);
      loaded++;
      if (onProgress) {
        onProgress(loaded, total);
      }
    }
  }
}

export function isImageCached(src: string): boolean {
  return imageCache.has(src);
}
