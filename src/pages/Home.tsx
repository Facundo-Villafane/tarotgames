import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { allSpreads } from '../data/spreads';
import LiquidChrome from '../components/ui/LiquidChrome';
import { GSAPCard } from '../components/ui/GSAPCard';
import logoImg from '../assets/logo.png';
import diaImg from '../assets/dia.png';
import tresImg from '../assets/tres.png';
import destinoImg from '../assets/destino.png';
import cruzImg from '../assets/cruz.png';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const spreadIcons: Record<string, string> = {
    'daily': diaImg,
    'three-card': tresImg,
    'five-card': destinoImg,
    'celtic-cross': cruzImg,
  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center px-8 sm:px-12 lg:px-20 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-4xl z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.35 }}
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-8 sm:mb-10"
        >
          <div className="relative w-full h-full">
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

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold px-6 text-white title-font"
        >
          Arcano Oracle
        </motion.h1>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full max-w-7xl z-10 px-4 sm:px-6"
      >
        {/* Grid con altura uniforme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {allSpreads.map((spread, index) => (
            <motion.div
              key={spread.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="group relative"
            >
              <GSAPCard
                onClick={() => navigate(`/reading/${spread.id}`)}
                className="cursor-pointer"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative bg-gradient-to-br from-violet-400/90 via-purple-400/90 to-fuchsia-400/90 rounded-[32px] overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-violet-500/40 h-[500px]"
                >
                {/* Card Content */}
                <div className="relative h-full p-8 flex flex-col justify-between">

                  {/* Header Section - Fixed height */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-white/90">
                          {spread.positions.length}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 title-font leading-tight drop-shadow-lg min-h-[70px] flex items-center">
                      {spread.name}
                    </h3>

                    <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light line-clamp-3 min-h-[60px]">
                      {spread.description}
                    </p>
                  </div>

                  {/* Icon Section - Centered with fixed height */}
                  <div className="relative z-10 flex items-center justify-center h-[160px]">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 opacity-20 group-hover:opacity-30 transform group-hover:scale-110 transition-all duration-500 drop-shadow-2xl">
                      <img src={spreadIcons[spread.id]} alt={spread.name} className="w-full h-full object-contain filter brightness-0 invert" />
                    </div>
                  </div>

                  {/* Bottom Actions - Fixed height */}
                  <div className="relative z-10 flex items-center justify-between flex-shrink-0">
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-full bg-black/15 backdrop-blur-sm flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-white/90">
                      Comenzar
                    </span>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                  {/* Subtle Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px',
                    }}
                  />
                </div>
              </motion.div>
            </GSAPCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Liquid Chrome Background */}
      <div className="fixed inset-0 -z-10">
        <LiquidChrome
          baseColor={[0.05, 0.0, 0.15]} // Very dark with subtle violet tint
          speed={0.3}
          amplitude={0.6}
          interactive={true}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
    </div>
  );
};
