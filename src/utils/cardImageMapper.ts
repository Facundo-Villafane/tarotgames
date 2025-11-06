import type { TarotCard } from '../types/tarot';

/**
 * Maps a tarot card to its corresponding image filename
 * Uses dynamic imports for proper bundling with Vite
 */
export function getCardImagePath(card: TarotCard): string {
  if (card.arcana === 'major') {
    // Major Arcana: 00-TheFool.png, 01-TheMagician.png, etc.
    const paddedNumber = card.number.toString().padStart(2, '0');
    const cardName = card.name.replace(/\s+/g, '');
    // Use template URL that Vite can resolve at build time
    return new URL(`../assets/Cards-png/${paddedNumber}-${cardName}.png`, import.meta.url).href;
  } else {
    // Minor Arcana: Cups01.png, Swords01.png, etc.
    const suit = card.suit!.charAt(0).toUpperCase() + card.suit!.slice(1);
    const paddedNumber = card.number.toString().padStart(2, '0');
    return new URL(`../assets/Cards-png/${suit}${paddedNumber}.png`, import.meta.url).href;
  }
}
