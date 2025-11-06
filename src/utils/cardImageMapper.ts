import type { TarotCard } from '../types/tarot';

/**
 * Maps a tarot card to its corresponding image filename
 * Based on the Cards-png folder structure
 */
export function getCardImagePath(card: TarotCard): string {
  if (card.arcana === 'major') {
    // Major Arcana: 00-TheFool.png, 01-TheMagician.png, etc.
    const paddedNumber = card.number.toString().padStart(2, '0');
    const cardName = card.name.replace(/\s+/g, '');
    return `/src/assets/Cards-png/${paddedNumber}-${cardName}.png`;
  } else {
    // Minor Arcana: Cups01.png, Swords01.png, etc.
    const suit = card.suit!.charAt(0).toUpperCase() + card.suit!.slice(1);
    const paddedNumber = card.number.toString().padStart(2, '0');
    return `/src/assets/Cards-png/${suit}${paddedNumber}.png`;
  }
}
