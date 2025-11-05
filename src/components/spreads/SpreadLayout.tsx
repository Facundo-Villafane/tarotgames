import { motion } from 'framer-motion';
import { TarotCard } from '../cards/TarotCard';
import { CardPlaceholder } from '../cards/CardPlaceholder';
import type { Spread, DrawnCard } from '../../types/tarot';
import { Button } from '../ui/Button';
import { Sparkles } from 'lucide-react';

interface SpreadLayoutProps {
  spread: Spread;
  drawnCards: DrawnCard[];
  onDrawCard: (positionId: number) => void;
  onGetInterpretation: () => void;
  canGetInterpretation: boolean;
}

export const SpreadLayout: React.FC<SpreadLayoutProps> = ({
  spread,
  drawnCards,
  onDrawCard,
  onGetInterpretation,
  canGetInterpretation,
}) => {
  const getCardForPosition = (positionId: number): DrawnCard | undefined => {
    return drawnCards.find((card) => card.positionId === positionId);
  };

  const getNextPosition = (): number | null => {
    for (let i = 0; i < spread.positions.length; i++) {
      if (!getCardForPosition(i)) {
        return i;
      }
    }
    return null;
  };

  const nextPosition = getNextPosition();

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Spread Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {spread.name}
        </h2>
        <p className="text-white/70">{spread.description}</p>
      </motion.div>

      {/* Cards Layout */}
      <div className="relative min-h-[400px] flex items-center justify-center mb-8">
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {spread.positions.map((position) => {
            const card = getCardForPosition(position.id);
            const isActive = nextPosition === position.id;

            return (
              <div
                key={position.id}
                className="relative"
                style={{
                  transform: `rotate(${position.rotation || 0}deg)`,
                }}
              >
                {card ? (
                  <div className="w-32 h-48 md:w-40 md:h-60">
                    <TarotCard
                      card={card}
                      isRevealed={true}
                      isReversed={card.isReversed}
                    />
                  </div>
                ) : (
                  <CardPlaceholder
                    position={position}
                    onClick={() => isActive && onDrawCard(position.id)}
                    isActive={isActive}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Get Interpretation Button */}
      {canGetInterpretation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <Button onClick={onGetInterpretation} size="lg" variant="primary">
            <Sparkles className="w-5 h-5" />
            Obtener Interpretación
          </Button>
        </motion.div>
      )}

      {/* Instructions */}
      {nextPosition !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8"
        >
          <p className="text-white/70 text-sm">
            Haz clic en el espacio brillante para sacar la siguiente carta
          </p>
        </motion.div>
      )}
    </div>
  );
};
