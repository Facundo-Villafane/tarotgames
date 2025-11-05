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
        <div className="w-full h-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-1">
          <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Mystical Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-violet-400 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-violet-400 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-violet-400 rotate-45">
                <div className="absolute inset-0 border-4 border-violet-400"></div>
              </div>
            </div>
            <div className="text-violet-400 font-bold text-xl z-10">★</div>
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
          <div className="w-full h-full bg-gray-900 rounded-lg p-4 flex flex-col justify-between">
            {/* Card Header */}
            <div className="text-center">
              <p className="text-xs text-violet-400 uppercase tracking-wider mb-1">
                {getArcanaLabel()}
              </p>
              <h3 className="text-base font-bold text-white">
                {card?.name || 'Unknown'}
              </h3>
              {card?.number !== undefined && (
                <p className="text-xs text-white/60 mt-1">
                  {card.arcana === 'major' ? `Arcano ${card.number}` : `Número ${card.number}`}
                </p>
              )}
            </div>

            {/* Card Image Placeholder */}
            <div className="flex-1 flex items-center justify-center my-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border-2 border-violet-400/30">
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
                        className="text-xs px-2 py-1 bg-violet-500/20 rounded-full text-white/80"
                      >
                        {keyword}
                      </span>
                    ))}
                </div>
                {isReversed && (
                  <p className="text-xs text-violet-400 font-semibold">Invertida</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
