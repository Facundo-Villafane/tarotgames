import { motion } from 'framer-motion';
import LiquidChrome from './LiquidChrome';
import logoImg from '../../assets/logo.png';

interface LoadingScreenProps {
  progress: number;
  total: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, total }) => {
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <LiquidChrome
          baseColor={[0.05, 0.0, 0.15]}
          speed={0.3}
          amplitude={0.6}
          interactive={false}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Loading Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center px-8 max-w-md w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative w-32 h-32 mx-auto">
            {/* Gradient overlay mask */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400"
              style={{
                WebkitMaskImage: `url(${logoImg})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: `url(${logoImg})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))'
              }}
            />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Preparando el Oráculo
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 mb-8"
        >
          Cargando las cartas del tarot...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full"
        >
          <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Percentage */}
          <div className="mt-4 flex items-center justify-center">
            <span className="text-violet-400 font-bold text-lg">
              {percentage}%
            </span>
          </div>
        </motion.div>

        {/* Mystical animation */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mt-8 text-4xl"
        >
          ✨
        </motion.div>
      </motion.div>
    </div>
  );
};
