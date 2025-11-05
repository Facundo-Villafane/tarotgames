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

  // Posiciones según la imagen de la Cruz Celta
  const positions = [
    { id: 0, name: 'El Ser / La Esencia', gridArea: '2 / 2 / 3 / 3' }, // Centro izquierda (1)
    { id: 1, name: 'Hacer - El Desafío', gridArea: '2 / 2 / 3 / 3', rotated: true }, // Centro (2) - Cruz sobre 1
    { id: 2, name: 'Inconsciente / Lo Oculto', gridArea: '3 / 2 / 4 / 3' }, // Abajo centro (3)
    { id: 3, name: 'Consciente / A la vista', gridArea: '1 / 2 / 2 / 3' }, // Arriba centro (4)
    { id: 4, name: 'Pasado Reciente', gridArea: '2 / 1 / 3 / 2' }, // Izquierda (5)
    { id: 5, name: 'Futuro Próximo', gridArea: '2 / 3 / 3 / 4' }, // Derecha (6)
    { id: 6, name: 'Presente / Lo Actual', gridArea: '4 / 4 / 5 / 5' }, // Columna derecha abajo (7)
    { id: 7, name: 'Entorno / Ambiente', gridArea: '3 / 4 / 4 / 5' }, // Columna derecha medio-abajo (8)
    { id: 8, name: 'Esperanzas y Temores', gridArea: '2 / 4 / 3 / 5' }, // Columna derecha medio-arriba (9)
    { id: 9, name: 'Tendencia / Resultado', gridArea: '1 / 4 / 2 / 5' }, // Columna derecha arriba (10)
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
      <div className="relative mb-8">
        <div
          className="grid gap-4 md:gap-6 mx-auto"
          style={{
            gridTemplateColumns: 'repeat(4, minmax(120px, 160px))',
            gridTemplateRows: 'repeat(4, minmax(180px, 240px))',
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
                }}
              >
                {card ? (
                  <div
                    className="w-32 h-48 md:w-40 md:h-60"
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
                    />
                  </div>
                )}
                {/* Position Label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="text-xs text-white/60 whitespace-nowrap">
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
