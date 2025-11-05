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
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: position.id * 0.1 }}
    >
      <motion.div
        className={`${sizeClasses} rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isActive
            ? 'border-violet-400 bg-violet-500/10 backdrop-blur-sm'
            : 'border-violet-500/30 bg-violet-500/5 hover:border-violet-400 hover:bg-violet-500/10'
        }`}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={
          isActive
            ? {
                boxShadow: [
                  '0 0 20px rgba(139, 92, 246, 0.3)',
                  '0 0 40px rgba(139, 92, 246, 0.6)',
                  '0 0 20px rgba(139, 92, 246, 0.3)',
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
        <div className={`text-center ${compact ? 'p-2' : 'p-4'}`}>
          <div className={`${compact ? 'text-2xl mb-1' : 'text-4xl mb-2'} opacity-50`}>
            {isActive ? '✨' : '?'}
          </div>
          {!compact && (
            <>
              <p className="text-sm font-semibold text-white/80">{position.name}</p>
              <p className="text-xs text-white/60 mt-2">{position.question}</p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
