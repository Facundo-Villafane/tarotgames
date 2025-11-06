import { motion } from 'framer-motion';
import { Sparkles, Share2, Save } from 'lucide-react';
import { Button } from '../ui/Button';

interface InterpretationDisplayProps {
  interpretation: string;
  onSave?: () => void;
  onShare?: () => void;
}

export const InterpretationDisplay: React.FC<InterpretationDisplayProps> = ({
  interpretation,
  onSave,
  onShare,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-card-bg/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-glow border border-primary/20">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-violet-400" />
          <h2 className="text-2xl font-bold text-white">Tu Interpretación</h2>
        </div>

        {/* Interpretation Text */}
        <div className="prose prose-invert max-w-none mb-8">
          <div className="text-text/90 leading-relaxed whitespace-pre-wrap">
            {interpretation.split('\n\n').map((paragraph, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="mb-4 text-base md:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Actions - Disabled for now, will be re-enabled with image export functionality */}
        {/*
        <div className="flex flex-wrap gap-4 justify-center">
          {onSave && (
            <Button onClick={onSave} variant="primary" size="md">
              <Save className="w-5 h-5" />
              Guardar Lectura
            </Button>
          )}
          {onShare && (
            <Button onClick={onShare} variant="outline" size="md">
              <Share2 className="w-5 h-5" />
              Compartir
            </Button>
          )}
        </div>
        */}

        {/* Mystical Border Effect */}
        <div className="absolute inset-0 rounded-xl pointer-events-none">
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent/30 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent/30 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-accent/30 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent/30 rounded-br-xl"></div>
        </div>
      </div>
    </motion.div>
  );
};
