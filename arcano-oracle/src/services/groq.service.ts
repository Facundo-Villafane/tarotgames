import Groq from 'groq-sdk';
import type { DrawnCard, Spread } from '../types/tarot';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Solo para desarrollo
});

export const generateInterpretationPrompt = (
  spread: Spread,
  cards: DrawnCard[],
  question?: string
): string => {
  const cardDescriptions = cards
    .map((card) => {
      const position = spread.positions.find(p => p.id === card.positionId);
      return `${position?.name}: ${card.name} ${card.isReversed ? '(Invertida)' : '(Derecha)'}`;
    })
    .join('\n  ');

  return `Como un experto lector de tarot místico y empático, interpreta esta tirada con sabiduría profunda y compasión:

Tipo de tirada: ${spread.name}
${question ? `Pregunta del consultante: "${question}"` : ''}

Cartas reveladas:
  ${cardDescriptions}

Proporciona una interpretación coherente y personalizada que:
1. Conecte todas las cartas en una narrativa fluida y cohesiva
2. Sea profundamente empática, compasiva y constructiva
3. Ofrezca consejos prácticos y accionables para la vida del consultante
4. Mantenga un tono místico, sabio y accesible
5. Sea de aproximadamente 3-4 párrafos bien desarrollados
6. Considere el significado de cada carta en su posición específica
7. Si hay cartas invertidas, incorpora sus significados alterados

No uses bullet points ni listas numeradas. Escribe en prosa elegante y fluida, como lo haría un lector de tarot profesional en una sesión real. La interpretación debe sentirse personal, reveladora y empoderadora.`;
};

export const getInterpretation = async (
  spread: Spread,
  cards: DrawnCard[],
  question?: string
): Promise<string> => {
  try {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      throw new Error('GROQ API key no está configurada. Por favor, configura VITE_GROQ_API_KEY en tu archivo .env');
    }

    const prompt = generateInterpretationPrompt(spread, cards, question);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un maestro lector de tarot con décadas de experiencia. Tu estilo es místico, sabio, empático y profundamente perspicaz. Ofreces guía que empodera y transforma a las personas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 800,
      top_p: 0.9,
    });

    const interpretation = completion.choices[0]?.message?.content;

    if (!interpretation) {
      throw new Error('No se pudo generar una interpretación. Por favor, intenta de nuevo.');
    }

    return interpretation;
  } catch (error) {
    console.error('Error al obtener interpretación:', error);

    if (error instanceof Error) {
      throw new Error(`Error al conectar con el oráculo: ${error.message}`);
    }

    throw new Error('Error desconocido al obtener la interpretación. Por favor, verifica tu conexión y la API key.');
  }
};

// Función de respaldo si Groq no está disponible
export const getFallbackInterpretation = (
  spread: Spread,
  cards: DrawnCard[],
  _question?: string
): string => {
  const cardList = cards
    .map((card) => {
      const position = spread.positions.find(p => p.id === card.positionId);
      return `En la posición de "${position?.name}", aparece ${card.name} ${
        card.isReversed ? 'invertida' : 'derecha'
      }.`;
    })
    .join(' ');

  return `Tu lectura de ${spread.name} revela un camino fascinante. ${cardList}

Esta combinación de energías sugiere un momento de reflexión profunda en tu vida. Las cartas te invitan a considerar tanto los aspectos visibles como los ocultos de tu situación actual.

Recuerda que el tarot es una herramienta de guía y autoconocimiento. Las cartas reflejan energías y posibilidades, pero tú siempre tienes el poder de elegir tu camino.

Para una interpretación más detallada y personalizada, por favor configura tu API key de Groq en el archivo .env`;
};
