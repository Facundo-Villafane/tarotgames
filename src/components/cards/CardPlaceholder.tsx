import { motion } from 'framer-motion';
import type { SpreadPosition } from '../../types/tarot';

interface CardPlaceholderProps {
  position: SpreadPosition;
  onClick?: () => void;
  isActive?: boolean;
  compact?: boolean;
}

export const CardPlaceholder: React.FC<CardPlaceholderProps> = ({
  position,
  onClick,
  isActive = false,
  compact = false,
}) => {
  const sizeClasses = compact
    ? 'w-20 h-30 md:w-24 md:h-36'
    : 'w-32 h-48 md:w-40 md:h-60';

  return (
    <motion.div
      className="relative w-full h-full cursor-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: position.id * 0.1 }}
      onClick={onClick}
      whileHover={{ scale: isActive ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Card Back */}
      <motion.div
        className="w-full h-full rounded-lg overflow-hidden relative"
        animate={
          isActive
            ? {
                boxShadow: [
                  '0 0 20px rgba(139, 92, 246, 0.5)',
                  '0 0 40px rgba(139, 92, 246, 0.8)',
                  '0 0 20px rgba(139, 92, 246, 0.5)',
                ],
              }
            : {}
        }
        transition={
          isActive
            ? {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      >
        <img
          src="/src/assets/Cards-png/CardBacks.png"
          alt="Card Back"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        {/* Active indicator overlay */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-pulse">✨</div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
