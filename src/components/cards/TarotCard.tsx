import { motion } from 'framer-motion';
import type { TarotCard as TarotCardType } from '../../types/tarot';

interface TarotCardProps {
  card?: TarotCardType;
  isRevealed?: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  card,
  isRevealed = false,
  isReversed = false,
  onClick,
  className = '',
}) => {
  const getSuitColor = (suit?: string) => {
    switch (suit) {
      case 'wands':
        return 'from-orange-600 to-red-600';
      case 'cups':
        return 'from-blue-600 to-cyan-600';
      case 'swords':
        return 'from-gray-600 to-slate-600';
      case 'pentacles':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-purple-600 to-violet-600'; // Major Arcana
    }
  };

  const getArcanaLabel = () => {
    if (!card) return '';
    if (card.arcana === 'major') return 'Arcano Mayor';
    return card.suit ? card.suit.charAt(0).toUpperCase() + card.suit.slice(1) : '';
  };

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ scale: onClick ? 1.05 : 1 }}
      whileTap={{ scale: onClick ? 0.95 : 1 }}
      initial={false}
      animate={{
        rotateY: isRevealed ? 180 : 0,
        rotateZ: isReversed && isRevealed ? 180 : 0,
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Card Back */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-primary p-1">
          <div className="w-full h-full bg-card-bg rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Mystical Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-accent rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-accent rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-accent rotate-45">
                <div className="absolute inset-0 border-4 border-accent"></div>
              </div>
            </div>
            <div className="text-accent font-bold text-xl z-10">★</div>
          </div>
        </div>
      </div>

      {/* Card Front */}
      <div
        className="rounded-lg overflow-hidden shadow-glow"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <div className={`w-full h-full bg-gradient-to-br ${getSuitColor(card?.suit)} p-1`}>
          <div className="w-full h-full bg-card-bg rounded-lg p-4 flex flex-col justify-between">
            {/* Card Header */}
            <div className="text-center">
              <p className="text-xs text-accent uppercase tracking-wider mb-1">
                {getArcanaLabel()}
              </p>
              <h3 className="text-base font-bold text-text">
                {card?.name || 'Unknown'}
              </h3>
              {card?.number !== undefined && (
                <p className="text-xs text-gray-400 mt-1">
                  {card.arcana === 'major' ? `Arcano ${card.number}` : `Número ${card.number}`}
                </p>
              )}
            </div>

            {/* Card Image Placeholder */}
            <div className="flex-1 flex items-center justify-center my-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center border-2 border-accent/30">
                <span className="text-4xl opacity-50">
                  {card?.suit === 'wands' && '🔥'}
                  {card?.suit === 'cups' && '🌊'}
                  {card?.suit === 'swords' && '⚔️'}
                  {card?.suit === 'pentacles' && '💎'}
                  {card?.arcana === 'major' && '✨'}
                </span>
              </div>
            </div>

            {/* Card Keywords */}
            {card && (
              <div className="text-center">
                <div className="flex flex-wrap gap-1 justify-center mb-2">
                  {(isReversed ? card.reversedKeywords : card.uprightKeywords)
                    .slice(0, 3)
                    .map((keyword, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-primary/20 rounded-full text-text/80"
                      >
                        {keyword}
                      </span>
                    ))}
                </div>
                {isReversed && (
                  <p className="text-xs text-accent font-semibold">Invertida</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
