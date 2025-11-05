export interface TarotCard {
  id: string;
  name: string;
  number: number;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  imageUrl: string;
  uprightKeywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  description: string; // Lore del juego Arcano Ascendant
}

export interface DrawnCard extends TarotCard {
  isReversed: boolean;
  positionId: number;
}

export interface SpreadPosition {
  id: number;
  name: string;
  question: string; // Qué representa esta posición
  x: number; // Posición CSS (porcentaje o px)
  y: number;
  rotation?: number;
}

export interface Spread {
  id: string;
  name: string;
  positions: SpreadPosition[];
  description: string;
}

export interface Reading {
  id: string;
  spreadId: string;
  cards: DrawnCard[];
  question?: string;
  interpretation?: string;
  date: string;
}
