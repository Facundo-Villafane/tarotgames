import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TarotCard as TarotCardType } from '../../types/tarot';
import { getCardImagePath } from '../../utils/cardImageMapper';
import { isImageCached } from '../../utils/imagePreloader';

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
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className={`relative w-full h-full cursor-pointer ${className}`}
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
        <img
          src="/src/assets/Cards-png/CardBacks.png"
          alt="Card Back"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Card Front */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden shadow-glow"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        {card && !imageError ? (
          <img
            src={getCardImagePath(card)}
            alt={card.name}
            className="w-full h-full object-cover object-center"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Fallback if image fails to load */
          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-violet-900 flex items-center justify-center p-4">
            <h3 className="text-sm md:text-base font-bold text-white text-center">
              {card?.name || 'Unknown Card'}
            </h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};
