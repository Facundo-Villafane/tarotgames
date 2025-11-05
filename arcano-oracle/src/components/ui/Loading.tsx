import { motion } from 'framer-motion';

interface LoadingProps {
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ text = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-primary/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-accent rounded-full border-t-transparent"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✨
          </motion.div>
        </div>
      </div>
      <p className="text-text/80 text-sm">{text}</p>
    </div>
  );
};
