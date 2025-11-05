import { motion } from 'framer-motion';
import type { SpreadPosition } from '../../types/tarot';

interface CardPlaceholderProps {
  position: SpreadPosition;
  onClick?: () => void;
  isActive?: boolean;
}

export const CardPlaceholder: React.FC<CardPlaceholderProps> = ({
  position,
  onClick,
  isActive = false,
}) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: position.id * 0.1 }}
    >
      <motion.div
        className={`w-32 h-48 md:w-40 md:h-60 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
          isActive
            ? 'border-accent bg-accent/10 shadow-glow'
            : 'border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/10'
        }`}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={
          isActive
            ? {
                boxShadow: [
                  '0 0 20px rgba(245, 158, 11, 0.3)',
                  '0 0 40px rgba(245, 158, 11, 0.6)',
                  '0 0 20px rgba(245, 158, 11, 0.3)',
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
        <div className="text-center p-4">
          <div className="text-4xl mb-2 opacity-50">
            {isActive ? '✨' : '?'}
          </div>
          <p className="text-sm font-semibold text-text/80">{position.name}</p>
          <p className="text-xs text-text/60 mt-2">{position.question}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
