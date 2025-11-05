import type { Spread } from '../types/tarot';

export const dailySpread: Spread = {
  id: 'daily',
  name: 'Carta del Día',
  description: 'Una sola carta para guiar tu día con sabiduría y claridad.',
  positions: [
    {
      id: 0,
      name: 'Tu guía de hoy',
      question: '¿Qué energía me acompaña hoy?',
      x: 50,
      y: 50,
      rotation: 0
    }
  ]
};

export const threeCardSpread: Spread = {
  id: 'three-card',
  name: 'Pasado, Presente, Futuro',
  description: 'Una lectura clásica que revela el flujo del tiempo en tu situación.',
  positions: [
    {
      id: 0,
      name: 'Pasado',
      question: '¿Qué influencias del pasado me afectan?',
      x: 20,
      y: 50,
      rotation: 0
    },
    {
      id: 1,
      name: 'Presente',
      question: '¿Cuál es mi situación actual?',
      x: 50,
      y: 50,
      rotation: 0
    },
    {
      id: 2,
      name: 'Futuro',
      question: '¿Qué me espera si continúo este camino?',
      x: 80,
      y: 50,
      rotation: 0
    }
  ]
};

export const fiveCardSpread: Spread = {
  id: 'five-card',
  name: 'Decisión',
  description: 'Explora una decisión importante desde múltiples ángulos.',
  positions: [
    {
      id: 0,
      name: 'La Situación',
      question: '¿Cuál es la situación que enfrento?',
      x: 50,
      y: 20,
      rotation: 0
    },
    {
      id: 1,
      name: 'Opción A',
      question: '¿Qué sucede si elijo el primer camino?',
      x: 25,
      y: 50,
      rotation: -5
    },
    {
      id: 2,
      name: 'Opción B',
      question: '¿Qué sucede si elijo el segundo camino?',
      x: 75,
      y: 50,
      rotation: 5
    },
    {
      id: 3,
      name: 'Lo que necesitas saber',
      question: '¿Qué información importante debo considerar?',
      x: 35,
      y: 75,
      rotation: 0
    },
    {
      id: 4,
      name: 'Resultado Potencial',
      question: '¿Cuál es el resultado más probable?',
      x: 65,
      y: 75,
      rotation: 0
    }
  ]
};

export const celticCrossSpread: Spread = {
  id: 'celtic-cross',
  name: 'Cruz Celta',
  description: 'La lectura más completa y profunda, revelando todos los aspectos de tu situación.',
  positions: [
    {
      id: 0,
      name: 'Situación Actual',
      question: '¿Cuál es mi situación presente?',
      x: 40,
      y: 50,
      rotation: 0
    },
    {
      id: 1,
      name: 'Desafío',
      question: '¿Qué obstáculo o desafío cruza mi camino?',
      x: 40,
      y: 50,
      rotation: 90
    },
    {
      id: 2,
      name: 'Pasado Distante',
      question: '¿Qué fundamentos del pasado influyen aquí?',
      x: 25,
      y: 50,
      rotation: 0
    },
    {
      id: 3,
      name: 'Pasado Reciente',
      question: '¿Qué acaba de pasar?',
      x: 40,
      y: 65,
      rotation: 0
    },
    {
      id: 4,
      name: 'Mejor Resultado Posible',
      question: '¿Cuál es el mejor resultado que puedo lograr?',
      x: 40,
      y: 35,
      rotation: 0
    },
    {
      id: 5,
      name: 'Futuro Próximo',
      question: '¿Qué vendrá pronto?',
      x: 55,
      y: 50,
      rotation: 0
    },
    {
      id: 6,
      name: 'Tu Enfoque',
      question: '¿Cómo me veo a mí mismo en esta situación?',
      x: 75,
      y: 75,
      rotation: 0
    },
    {
      id: 7,
      name: 'Influencias Externas',
      question: '¿Qué fuerzas externas me afectan?',
      x: 75,
      y: 60,
      rotation: 0
    },
    {
      id: 8,
      name: 'Esperanzas y Miedos',
      question: '¿Qué espero y qué temo?',
      x: 75,
      y: 45,
      rotation: 0
    },
    {
      id: 9,
      name: 'Resultado',
      question: '¿Cuál es el resultado probable?',
      x: 75,
      y: 30,
      rotation: 0
    }
  ]
};

// Array de todos los spreads
export const allSpreads: Spread[] = [
  dailySpread,
  threeCardSpread,
  fiveCardSpread,
  celticCrossSpread
];

// Helper para obtener un spread por ID
export const getSpreadById = (id: string): Spread | undefined => {
  return allSpreads.find(spread => spread.id === id);
};
