import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TarotCard, DrawnCard, Spread, Reading } from '../types/tarot';
import { allCards } from '../data/cards';

interface ReadingState {
  // Current reading state
  currentSpread: Spread | null;
  drawnCards: DrawnCard[];
  question: string;
  interpretation: string | null;
  isDrawing: boolean;
  isLoadingInterpretation: boolean;

  // Reading history
  readingHistory: Reading[];

  // Actions
  setSpread: (spread: Spread) => void;
  setQuestion: (question: string) => void;
  drawCard: (positionId: number) => void;
  setInterpretation: (interpretation: string) => void;
  setLoadingInterpretation: (loading: boolean) => void;
  saveReading: () => void;
  clearCurrentReading: () => void;
  deleteReading: (id: string) => void;
  getReadingById: (id: string) => Reading | undefined;
}

const shuffleDeck = (): TarotCard[] => {
  const deck = [...allCards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSpread: null,
      drawnCards: [],
      question: '',
      interpretation: null,
      isDrawing: false,
      isLoadingInterpretation: false,
      readingHistory: [],

      // Set the current spread
      setSpread: (spread: Spread) => {
        set({
          currentSpread: spread,
          drawnCards: [],
          interpretation: null,
          question: '',
        });
      },

      // Set the question for the reading
      setQuestion: (question: string) => {
        set({ question });
      },

      // Draw a card for a specific position
      drawCard: (positionId: number) => {
        const { drawnCards, currentSpread } = get();

        if (!currentSpread) return;

        // Check if card already drawn for this position
        if (drawnCards.some(card => card.positionId === positionId)) {
          return;
        }

        // Shuffle and get a random card not already drawn
        const availableCards = shuffleDeck().filter(
          card => !drawnCards.some(drawn => drawn.id === card.id)
        );

        if (availableCards.length === 0) return;

        const selectedCard = availableCards[0];

        // 50% chance of being reversed
        const isReversed = Math.random() < 0.5;

        const drawnCard: DrawnCard = {
          ...selectedCard,
          isReversed,
          positionId,
        };

        set({
          drawnCards: [...drawnCards, drawnCard],
        });
      },

      // Set the interpretation
      setInterpretation: (interpretation: string) => {
        set({ interpretation });
      },

      // Set loading state for interpretation
      setLoadingInterpretation: (loading: boolean) => {
        set({ isLoadingInterpretation: loading });
      },

      // Save current reading to history
      saveReading: () => {
        const { currentSpread, drawnCards, question, interpretation } = get();

        if (!currentSpread || drawnCards.length === 0) return;

        const newReading: Reading = {
          id: `reading-${Date.now()}`,
          spreadId: currentSpread.id,
          cards: drawnCards,
          question: question || undefined,
          interpretation: interpretation || undefined,
          date: new Date().toISOString(),
        };

        set(state => ({
          readingHistory: [newReading, ...state.readingHistory],
        }));
      },

      // Clear current reading
      clearCurrentReading: () => {
        set({
          currentSpread: null,
          drawnCards: [],
          question: '',
          interpretation: null,
        });
      },

      // Delete a reading from history
      deleteReading: (id: string) => {
        set(state => ({
          readingHistory: state.readingHistory.filter(reading => reading.id !== id),
        }));
      },

      // Get a reading by ID
      getReadingById: (id: string) => {
        return get().readingHistory.find(reading => reading.id === id);
      },
    }),
    {
      name: 'arcano-oracle-storage',
      partialize: (state) => ({
        readingHistory: state.readingHistory,
      }),
    }
  )
);
