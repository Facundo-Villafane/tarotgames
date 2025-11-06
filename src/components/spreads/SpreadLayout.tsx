import { motion } from 'framer-motion';
import { TarotCard } from '../cards/TarotCard';
import { CardPlaceholder } from '../cards/CardPlaceholder';
import type { Spread, DrawnCard } from '../../types/tarot';
import { Button } from '../ui/Button';
import { Sparkles } from 'lucide-react';
import { translateCardName } from '../../utils/cardTranslations';

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
                className="relative flex flex-col items-center gap-3"
                style={{
                  transform: `rotate(${position.rotation || 0}deg)`,
                }}
              >
                {card ? (
                  <>
                    {/* Nombre de la carta */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <h3 className="text-sm md:text-base font-semibold text-white">
                        {translateCardName(card.name)}
                      </h3>
                      {card.isReversed && (
                        <p className="text-xs text-violet-400 mt-1">Invertida</p>
                      )}
                    </motion.div>

                    {/* Carta */}
                    <div className="w-40 h-60 md:w-48 md:h-72" style={{ aspectRatio: '300/527' }}>
                      <TarotCard
                        card={card}
                        isRevealed={true}
                        isReversed={card.isReversed}
                      />
                    </div>
                  </>
                ) : (
                  <div className="w-40 h-60 md:w-48 md:h-72" style={{ aspectRatio: '300/527' }}>
                    <CardPlaceholder
                      position={position}
                      onClick={() => isActive && onDrawCard(position.id)}
                      isActive={isActive}
                      compact={false}
                    />
                  </div>
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
