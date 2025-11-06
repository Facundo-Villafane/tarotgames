/**
 * Preloads card images to improve performance
 */

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
  cardImages.push('/src/assets/Cards-png/CardBacks.png');

  // Major Arcana (0-21)
  const majorArcanaNames = [
    'TheFool',
    'TheMagician',
    'TheHighPriestess',
    'TheEmpress',
    'TheEmperor',
    'TheHierophant',
    'TheLovers',
    'TheChariot',
    'Strength',
    'TheHermit',
    'WheelofFortune',
    'Justice',
    'TheHangedMan',
    'Death',
    'Temperance',
    'TheDevil',
    'TheTower',
    'TheStar',
    'TheMoon',
    'TheSun',
    'Judgement',
    'TheWorld',
  ];

  majorArcanaNames.forEach((name, index) => {
    const paddedNumber = index.toString().padStart(2, '0');
    cardImages.push(`/src/assets/Cards-png/${paddedNumber}-${name}.png`);
  });

  // Minor Arcana (1-14 for each suit)
  const suits = ['Cups', 'Pentacles', 'Swords', 'Wands'];
  suits.forEach((suit) => {
    for (let i = 1; i <= 14; i++) {
      const paddedNumber = i.toString().padStart(2, '0');
      cardImages.push(`/src/assets/Cards-png/${suit}${paddedNumber}.png`);
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
