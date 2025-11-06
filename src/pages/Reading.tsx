import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, AlertCircle, User, Edit2 } from 'lucide-react';
import { useReadingStore } from '../store/readingStore';
import { getSpreadById } from '../data/spreads';
import { SpreadLayout } from '../components/spreads/SpreadLayout';
import { CelticCrossLayout } from '../components/spreads/CelticCrossLayout';
import { TarotCard } from '../components/cards/TarotCard';
import { InterpretationDisplay } from '../components/interpretation/InterpretationDisplay';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import LiquidChrome from '../components/ui/LiquidChrome';
import { getInterpretation } from '../services/groq.service';
import { validateUserQuestion, type ValidationResult } from '../utils/inputValidation';
import { translateCardName } from '../utils/cardTranslations';

export const Reading: React.FC = () => {
  const { spreadId } = useParams<{ spreadId: string }>();
  const navigate = useNavigate();
  const [showQuestionInput, setShowQuestionInput] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true });
  const [name, setName] = useState(() => localStorage.getItem('tarot-user-name') || '');
  const [nameValidation, setNameValidation] = useState<ValidationResult>({ isValid: true });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(() => !!localStorage.getItem('tarot-user-name'));

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

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    // Validar en tiempo real
    const result = validateUserQuestion(value);
    setValidationResult(result);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Validar longitud del nombre
    if (value.length > 50) {
      setNameValidation({
        isValid: false,
        error: 'El linaje de tu nombre es demasiado extenso. Utiliza un apelativo más conciso (máximo 50 caracteres).',
      });
    } else {
      setNameValidation({ isValid: true });
    }
  };

  const handleSaveName = () => {
    if (nameValidation.isValid && name.trim()) {
      localStorage.setItem('tarot-user-name', name.trim());
      setNameSaved(true);
      setIsEditingName(false);
    } else if (!name.trim()) {
      localStorage.removeItem('tarot-user-name');
      setNameSaved(false);
      setIsEditingName(false);
    }
  };

  const handleGetInterpretation = async () => {
    if (!currentSpread || drawnCards.length !== currentSpread.positions.length) {
      return;
    }

    setLoadingInterpretation(true);

    try {
      const result = await getInterpretation(
        currentSpread,
        drawnCards,
        question,
        name.trim() || undefined
      );
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
    <div className="min-h-screen p-4 py-8 relative">
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
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={handleNewReading}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Nueva Lectura</span>
        </button>
      </div>

      {/* Name and Question Input */}
      {showQuestionInput && drawnCards.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl rounded-2xl p-8 border border-violet-500/20">
            {/* Name Input */}
            <div className="flex items-start gap-3 mb-8">
              <User className="w-5 h-5 text-violet-400 mt-1" strokeWidth={1.5} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Tu Nombre (Opcional)
                  </h3>
                  {nameSaved && !isEditingName && (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Cambiar
                    </button>
                  )}
                </div>

                {!nameSaved || isEditingName ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveName();
                        }
                      }}
                      placeholder="¿Cómo deseas ser llamado por el Oráculo?"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-violet-300/50 focus:outline-none transition-colors ${
                        !nameValidation.isValid
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-violet-500/30 focus:border-violet-400/50'
                      }`}
                      maxLength={50}
                    />

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex-1">
                        {!nameValidation.isValid && nameValidation.error && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-2 text-red-400 text-sm"
                          >
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{nameValidation.error}</span>
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-xs ml-4 flex-shrink-0 ${name.length > 40 ? 'text-amber-400' : 'text-gray-500'}`}>
                        {name.length}/50
                      </span>
                    </div>

                    {isEditingName && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={handleSaveName}
                          variant="primary"
                          size="sm"
                          disabled={!nameValidation.isValid}
                        >
                          Guardar
                        </Button>
                        <Button
                          onClick={() => {
                            setName(localStorage.getItem('tarot-user-name') || '');
                            setIsEditingName(false);
                            setNameValidation({ isValid: true });
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-violet-500/30 rounded-xl">
                    <p className="text-white font-medium">{name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Question Input */}
            <div className="flex items-start gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-violet-400 mt-1" strokeWidth={1.5} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-4">
                  ¿Tienes una pregunta? (Opcional)
                </h3>
                <div className="relative">
                  <textarea
                    value={question}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                    placeholder="Escribe tu pregunta aquí para una lectura más personalizada..."
                    className={`w-full bg-white/5 border rounded-xl p-4 text-white placeholder-violet-300/50 focus:outline-none resize-none transition-colors ${
                      !validationResult.isValid
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-violet-500/30 focus:border-violet-400/50'
                    }`}
                    rows={3}
                    maxLength={500}
                  />

                  {/* Contador de caracteres */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex-1">
                      {!validationResult.isValid && validationResult.error && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2 text-red-400 text-sm"
                        >
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{validationResult.error}</span>
                        </motion.div>
                      )}
                    </div>
                    <span
                      className={`text-xs ml-4 flex-shrink-0 ${
                        (validationResult.remainingChars ?? 500) < 50
                          ? 'text-amber-400'
                          : 'text-gray-500'
                      }`}
                    >
                      {question.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setQuestion('');
                  setValidationResult({ isValid: true });
                  setShowQuestionInput(false);
                }}
                variant="ghost"
                size="md"
              >
                Omitir pregunta
              </Button>
              <Button
                onClick={() => {
                  handleSaveName();
                  setShowQuestionInput(false);
                }}
                variant="primary"
                size="md"
                disabled={!validationResult.isValid || !nameValidation.isValid}
              >
                Continuar
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Spread Layout */}
      {!showQuestionInput && !interpretation && (
        currentSpread.id === 'celtic-cross' ? (
          <CelticCrossLayout
            spread={currentSpread}
            drawnCards={drawnCards}
            onDrawCard={handleDrawCard}
            onGetInterpretation={handleGetInterpretation}
            canGetInterpretation={canGetInterpretation}
          />
        ) : (
          <SpreadLayout
            spread={currentSpread}
            drawnCards={drawnCards}
            onDrawCard={handleDrawCard}
            onGetInterpretation={handleGetInterpretation}
            canGetInterpretation={canGetInterpretation}
          />
        )
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
          {/* Show cards in a row with real images */}
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            {drawnCards.map((card) => {
              const position = currentSpread.positions.find(
                (p) => p.id === card.positionId
              );
              return (
                <div key={card.id} className="text-center">
                  <div className="w-32 h-[180px] mb-3" style={{ aspectRatio: '300/527' }}>
                    <TarotCard
                      card={card}
                      isRevealed={true}
                      isReversed={card.isReversed}
                    />
                  </div>
                  <p className="text-sm text-white/80 font-medium">{translateCardName(card.name)}</p>
                  {card.isReversed && (
                    <p className="text-xs text-violet-400 mt-1">Invertida</p>
                  )}
                  <p className="text-xs text-white/60 mt-1">{position?.name}</p>
                </div>
              );
            })}
          </div>

          <InterpretationDisplay
            interpretation={interpretation}
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
