import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, GitBranch, Grid3x3, Star, ArrowRight } from 'lucide-react';
import { allSpreads } from '../data/spreads';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const spreadIcons: Record<string, React.ReactNode> = {
    'daily': <Sparkles className="w-6 h-6" strokeWidth={1.5} />,
    'three-card': <Layers className="w-6 h-6" strokeWidth={1.5} />,
    'five-card': <GitBranch className="w-6 h-6" strokeWidth={1.5} />,
    'celtic-cross': <Grid3x3 className="w-6 h-6" strokeWidth={1.5} />,
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
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-8 sm:mb-10 relative"
        >
          <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" strokeWidth={0} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-6"
        >
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent title-font">
            Arcano Oracle
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          
          className="text-base sm:text-lg md:text-xl text-gray-400 mb-5 sm:mb-6 font-light max-w-2xl mx-auto leading-relaxed px-6"
        >
          Descubre tu destino con lecturas de tarot potenciadas por inteligencia artificial
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-amber-500/5 border border-amber-500/20"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
          <span className="text-xs sm:text-sm text-amber-400/90 font-medium">Del universo Arcano Ascendant</span>
        </motion.div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full max-w-7xl z-10 px-4 sm:px-6"
      >
        {/* 2. GRID: Aumento del gap entre tarjetas (gap-8, lg:gap-10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {allSpreads.map((spread, index) => (
            <motion.div
              key={spread.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              onClick={() => navigate(`/reading/${spread.id}`)}
              className="group relative cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-gradient-to-br from-violet-400/90 via-purple-400/90 to-fuchsia-400/90 rounded-[32px] overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-violet-500/40"
              >
                {/* Card Content */}
                <div className="relative aspect-[3/4] p-8 flex flex-col">
                  
                  {/* Header Section */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-white/90">
                          {spread.positions.length}
                        </span>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-lg leading-none">⋯</span>
                      </button>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 title-font leading-tight drop-shadow-lg">
                      {spread.name}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
                      {spread.description}
                    </p>
                  </div>

                  {/* Icon Section - Centered */}
                  <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="text-white/20 transform scale-[3.5] group-hover:scale-[4] transition-all duration-500 drop-shadow-2xl">
                      {spreadIcons[spread.id]}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="relative z-10 flex items-center justify-between">
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
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-12 sm:mt-16 lg:mt-20 text-center z-10"
      >
        <div className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/30">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          <p className="text-xs text-gray-500">
            Powered by <span className="text-gray-400 font-medium">Llama 3.3</span>
          </p>
        </div>
      </motion.div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Large Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-fuchsia-500/5 rounded-full blur-3xl"></div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>
    </div>
  );
};