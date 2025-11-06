import { motion } from 'framer-motion';
import { TarotCard } from '../cards/TarotCard';
import { CardPlaceholder } from '../cards/CardPlaceholder';
import type { Spread, DrawnCard } from '../../types/tarot';
import { Button } from '../ui/Button';
import { translateCardName } from '../../utils/cardTranslations';

interface CelticCrossLayoutProps {
  spread: Spread;
  drawnCards: DrawnCard[];
  onDrawCard: (positionId: number) => void;
  onGetInterpretation: () => void;
  canGetInterpretation: boolean;
}

export const CelticCrossLayout: React.FC<CelticCrossLayoutProps> = ({
  spread,
  drawnCards,
  onDrawCard,
  onGetInterpretation,
  canGetInterpretation,
}) => {
  const getCardForPosition = (positionId: number): DrawnCard | undefined => {
    return drawnCards.find((card) => card.positionId === positionId);
  };

  const getNextPosition = (): number | null => {
    for (let i = 0; i < spread.positions.length; i++) {
      if (!getCardForPosition(i)) {
        return i;
      }
    }
    return null;
  };

  const nextPosition = getNextPosition();

  // Posiciones de la Cruz Celta - Layout mejorado sin superposiciones
  const positions = [
    { id: 0, name: 'Situación actual', gridArea: '2 / 2 / 3 / 3', zIndex: 1 }, // Centro
    { id: 1, name: 'El Desafío', gridArea: '2 / 3 / 3 / 4', zIndex: 1 }, // Derecha del centro
    { id: 2, name: 'Objetivos, deseos', gridArea: '1 / 2 / 2 / 3', zIndex: 1 }, // Arriba
    { id: 3, name: 'Pasado-consecuencias', gridArea: '3 / 2 / 4 / 3', zIndex: 1 }, // Abajo
    { id: 4, name: 'Pasado reciente', gridArea: '2 / 1 / 3 / 2', zIndex: 1 }, // Izquierda
    { id: 5, name: 'Futuro cercano', gridArea: '2 / 4 / 3 / 5', zIndex: 1 }, // Derecha
    { id: 6, name: 'Obstáculos', gridArea: '4 / 5 / 5 / 6', zIndex: 1 }, // Torre - abajo
    { id: 7, name: 'Entorno familiar', gridArea: '3 / 5 / 4 / 6', zIndex: 1 }, // Torre - medio-abajo
    { id: 8, name: 'Miedos y temores', gridArea: '2 / 5 / 3 / 6', zIndex: 1 }, // Torre - medio
    { id: 9, name: 'Conclusión, consejo', gridArea: '1 / 5 / 2 / 6', zIndex: 1 }, // Torre - arriba
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Spread Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {spread.name}
        </h2>
        <p className="text-white/70">{spread.description}</p>
      </motion.div>

      {/* Celtic Cross Layout */}
      <div className="relative mb-8 overflow-x-auto pb-32">
        <div
          className="grid mx-auto px-4"
          style={{
            gridTemplateColumns: 'repeat(5, 180px)',
            gridTemplateRows: 'repeat(4, 280px)',
            gap: '70px',
            justifyContent: 'center',
          }}
        >
          {positions.map((position) => {
            const card = getCardForPosition(position.id);
            const isActive = nextPosition === position.id;
            const spreadPosition = spread.positions[position.id];

            return (
              <div
                key={position.id}
                className="relative flex items-center justify-center"
                style={{
                  gridArea: position.gridArea,
                  zIndex: position.zIndex,
                }}
              >
                {card ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    {/* Nombre de la carta */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <h3 className="text-xs md:text-sm font-semibold text-white">
                        {translateCardName(card.name)}
                      </h3>
                      {card.isReversed && (
                        <p className="text-xs text-violet-400">Invertida</p>
                      )}
                    </motion.div>

                    <div className="w-40 h-[280px]" style={{ aspectRatio: '300/527' }}>
                      <TarotCard
                        card={card}
                        isRevealed={true}
                        isReversed={card.isReversed}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-40 h-[280px]" style={{ aspectRatio: '300/527' }}>
                      <CardPlaceholder
                        position={spreadPosition}
                        onClick={() => isActive && onDrawCard(position.id)}
                        isActive={isActive}
                        compact={false}
                      />
                    </div>
                  </div>
                )}
                {/* Position Label */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center w-40 px-2">
                  <p className="text-sm text-white/80 line-clamp-2 leading-tight">
                    {position.id + 1}. {position.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Get Interpretation Button */}
      {canGetInterpretation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mt-16"
        >
          <Button onClick={onGetInterpretation} size="lg" variant="primary">
            Obtener Interpretación
          </Button>
        </motion.div>
      )}

      {/* Instructions */}
      {nextPosition !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-16"
        >
          <p className="text-white/70 text-sm">
            Haz clic en el espacio brillante para sacar la siguiente carta
          </p>
        </motion.div>
      )}
    </div>
  );
};
