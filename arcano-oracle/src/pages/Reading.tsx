import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useReadingStore } from '../store/readingStore';
import { getSpreadById } from '../data/spreads';
import { SpreadLayout } from '../components/spreads/SpreadLayout';
import { InterpretationDisplay } from '../components/interpretation/InterpretationDisplay';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { getInterpretation } from '../services/groq.service';

export const Reading: React.FC = () => {
  const { spreadId } = useParams<{ spreadId: string }>();
  const navigate = useNavigate();
  const [showQuestionInput, setShowQuestionInput] = useState(true);

  const {
    currentSpread,
    drawnCards,
    question,
    interpretation,
    isLoadingInterpretation,
    setSpread,
    setQuestion,
    drawCard,
    setInterpretation,
    setLoadingInterpretation,
    saveReading,
    clearCurrentReading,
  } = useReadingStore();

  useEffect(() => {
    if (spreadId) {
      const spread = getSpreadById(spreadId);
      if (spread) {
        setSpread(spread);
      } else {
        navigate('/');
      }
    }
  }, [spreadId, navigate, setSpread]);

  const handleDrawCard = (positionId: number) => {
    drawCard(positionId);
  };

  const handleGetInterpretation = async () => {
    if (!currentSpread || drawnCards.length !== currentSpread.positions.length) {
      return;
    }

    setLoadingInterpretation(true);

    try {
      const result = await getInterpretation(currentSpread, drawnCards, question);
      setInterpretation(result);
    } catch (error) {
      console.error('Error getting interpretation:', error);
      setInterpretation(
        'Lo siento, hubo un error al obtener la interpretación. Por favor, verifica que tu API key de Groq esté configurada correctamente en el archivo .env'
      );
    } finally {
      setLoadingInterpretation(false);
    }
  };

  const handleSaveReading = () => {
    saveReading();
    alert('Lectura guardada en el historial');
  };

  const handleShare = () => {
    if (navigator.share && interpretation) {
      navigator
        .share({
          title: `Lectura de Tarot - ${currentSpread?.name}`,
          text: interpretation,
        })
        .catch(() => {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(interpretation);
          alert('Interpretación copiada al portapapeles');
        });
    } else if (interpretation) {
      navigator.clipboard.writeText(interpretation);
      alert('Interpretación copiada al portapapeles');
    }
  };

  const handleNewReading = () => {
    clearCurrentReading();
    navigate('/');
  };

  if (!currentSpread) {
    return <Loading text="Cargando tirada..." />;
  }

  const canGetInterpretation =
    drawnCards.length === currentSpread.positions.length && !interpretation;

  return (
    <div className="min-h-screen p-4 py-8">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <Button
          onClick={handleNewReading}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Nueva Lectura
        </Button>
      </div>

      {/* Question Input */}
      {showQuestionInput && drawnCards.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="bg-card-bg/80 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-accent mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text mb-2">
                  ¿Tienes una pregunta? (Opcional)
                </h3>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Escribe tu pregunta aquí para una lectura más personalizada..."
                  className="w-full bg-background/50 border border-primary/30 rounded-lg p-3 text-text placeholder-text/50 focus:outline-none focus:border-accent resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setShowQuestionInput(false)}
                variant="primary"
                size="sm"
              >
                Continuar
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Spread Layout */}
      {!showQuestionInput && !interpretation && (
        <SpreadLayout
          spread={currentSpread}
          drawnCards={drawnCards}
          onDrawCard={handleDrawCard}
          onGetInterpretation={handleGetInterpretation}
          canGetInterpretation={canGetInterpretation}
        />
      )}

      {/* Loading Interpretation */}
      {isLoadingInterpretation && (
        <div className="max-w-3xl mx-auto">
          <Loading text="Consultando el oráculo..." />
        </div>
      )}

      {/* Interpretation Display */}
      {interpretation && !isLoadingInterpretation && (
        <div className="space-y-8">
          {/* Show cards in a row */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {drawnCards.map((card) => {
              const position = currentSpread.positions.find(
                (p) => p.id === card.positionId
              );
              return (
                <div key={card.id} className="text-center">
                  <div className="w-24 h-36 md:w-32 md:h-48 mb-2">
                    <div className="w-full h-full">
                      <div
                        className={`bg-gradient-to-br ${
                          card.suit === 'wands'
                            ? 'from-orange-600 to-red-600'
                            : card.suit === 'cups'
                            ? 'from-blue-600 to-cyan-600'
                            : card.suit === 'swords'
                            ? 'from-gray-600 to-slate-600'
                            : card.suit === 'pentacles'
                            ? 'from-green-600 to-emerald-600'
                            : 'from-purple-600 to-violet-600'
                        } p-1 rounded-lg h-full`}
                      >
                        <div className="bg-card-bg rounded-lg p-2 h-full flex flex-col items-center justify-center">
                          <p className="text-xs font-bold text-text text-center">
                            {card.name}
                          </p>
                          {card.isReversed && (
                            <p className="text-xs text-accent mt-1">Invertida</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-text/60">{position?.name}</p>
                </div>
              );
            })}
          </div>

          <InterpretationDisplay
            interpretation={interpretation}
            onSave={handleSaveReading}
            onShare={handleShare}
          />

          <div className="flex justify-center mt-8">
            <Button onClick={handleNewReading} variant="secondary" size="lg">
              Nueva Lectura
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
