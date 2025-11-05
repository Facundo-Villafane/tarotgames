import { motion } from 'framer-motion';
import { TarotCard } from '../cards/TarotCard';
import { CardPlaceholder } from '../cards/CardPlaceholder';
import type { Spread, DrawnCard } from '../../types/tarot';
import { Button } from '../ui/Button';
import { Sparkles } from 'lucide-react';

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

  // Posiciones según la imagen de la Cruz Celta tradicional
  const positions = [
    { id: 0, name: 'Situación actual', gridArea: '3 / 2 / 4 / 3', zIndex: 1 }, // (1) Centro
    { id: 1, name: 'El Desafío', gridArea: '3 / 2 / 4 / 3', rotated: true, zIndex: 2 }, // (2) Cruz horizontal sobre 1
    { id: 2, name: 'Objetivos, deseos', gridArea: '1 / 2 / 2 / 3', zIndex: 1 }, // (3) Arriba
    { id: 3, name: 'Pasado-consecuencias', gridArea: '5 / 2 / 6 / 3', zIndex: 1 }, // (4) Abajo
    { id: 4, name: 'Pasado reciente', gridArea: '3 / 1 / 4 / 2', zIndex: 1 }, // (5) Izquierda
    { id: 5, name: 'Futuro cercano', gridArea: '3 / 3 / 4 / 4', zIndex: 1 }, // (6) Derecha
    { id: 6, name: 'Obstáculos', gridArea: '5 / 4 / 6 / 5', zIndex: 1 }, // (7) Torre - abajo
    { id: 7, name: 'Entorno familiar', gridArea: '4 / 4 / 5 / 5', zIndex: 1 }, // (8) Torre - medio-abajo
    { id: 8, name: 'Miedos y temores', gridArea: '3 / 4 / 4 / 5', zIndex: 1 }, // (9) Torre - medio
    { id: 9, name: 'Conclusión, consejo', gridArea: '2 / 4 / 3 / 5', zIndex: 1 }, // (10) Torre - arriba
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
      <div className="relative mb-8 overflow-x-auto pb-16 md:pb-20">
        <div
          className="grid gap-3 md:gap-4 lg:gap-6 mx-auto"
          style={{
            gridTemplateColumns: 'repeat(4, minmax(120px, 160px))',
            gridTemplateRows: 'repeat(5, minmax(180px, 240px))',
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
                  <div
                    className="w-28 h-40 md:w-32 md:h-48 lg:w-36 lg:h-52"
                    style={{
                      transform: position.rotated ? 'rotate(90deg)' : 'none',
                    }}
                  >
                    <TarotCard
                      card={card}
                      isRevealed={true}
                      isReversed={card.isReversed}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      transform: position.rotated ? 'rotate(90deg)' : 'none',
                    }}
                  >
                    <CardPlaceholder
                      position={spreadPosition}
                      onClick={() => isActive && onDrawCard(position.id)}
                      isActive={isActive}
                      compact={true}
                    />
                  </div>
                )}
                {/* Position Label */}
                <div className="absolute -bottom-10 md:-bottom-12 left-1/2 transform -translate-x-1/2 text-center w-full px-1">
                  <p className="text-xs md:text-sm text-white/70 whitespace-nowrap text-ellipsis overflow-hidden">
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
            <Sparkles className="w-5 h-5" />
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
