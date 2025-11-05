/**
 * @file inputValidation.ts
 * @description Utilidades de validación de input del usuario para prevenir prompt injection
 */

export const MAX_QUESTION_LENGTH = 500;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  remainingChars?: number;
}

/**
 * Valida el input del usuario en tiempo real
 * Detecta patrones de prompt injection antes de enviar al backend
 */
export const validateUserQuestion = (question: string): ValidationResult => {
  // Validación de longitud vacía está OK (la pregunta es opcional)
  if (!question || question.trim().length === 0) {
    return {
      isValid: true,
      remainingChars: MAX_QUESTION_LENGTH
    };
  }

  const trimmedQuestion = question.trim();

  // 1. Validar longitud máxima
  if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
    return {
      isValid: false,
      error: `Tu pregunta es demasiado extensa. Máximo ${MAX_QUESTION_LENGTH} caracteres.`,
      remainingChars: MAX_QUESTION_LENGTH - trimmedQuestion.length,
    };
  }

  // 2. Patrones de inyección sofisticados - CON CONTEXTO para evitar falsos positivos
  const injectionPatterns: Array<{ pattern: RegExp; message: string }> = [
    // Solo detecta "ignore/ignora" cuando va seguido de palabras de sistema/instrucciones
    {
      pattern: /\b(ignore|ignora|disregard|forget|olvida)\s+(all|todo|todas|previous|previo|previas|anteriores?|your|tu|tus|the|las?|los?)\s+(instructions?|instrucciones?|prompts?|rules?|reglas?|commands?|comandos?)/i,
      message: 'Tu pregunta contiene palabras que sugieren un intento de modificar el comportamiento del oráculo.',
    },
    // Detecta cambios de rol directos
    {
      pattern: /\b(you are|eres|you're|ahora eres|now you are|from now|ahora)\s+(a|an|un|una)?\s*(teacher|profesor|profesora|developer|desarrollador|engineer|ingeniero|assistant|asistente|expert|experto)/i,
      message: 'Evita instrucciones de cambio de rol. Formula tu pregunta sobre el tarot directamente.',
    },
    // "act as" / "actúa como" siempre es sospechoso
    {
      pattern: /\b(act as|actúa como|actua como|pretend to be|finge ser|simulate|simula|behave as|compórtate como)\b/i,
      message: 'Evita instrucciones de cambio de rol. Formula tu pregunta sobre el tarot directamente.',
    },
    // Referencias al sistema
    {
      pattern: /\b(system|sistema)\s+(mode|modo|prompt|instruction|instrucción)/i,
      message: 'Tu pregunta contiene referencias técnicas no permitidas.',
    },
    // "prompt" o "instruction" como sustantivo (no como verbo)
    {
      pattern: /\b(the|your|tu|tus|show|muestra|reveal|revela)\s+(prompt|instruction|instrucción|system prompt|rule|regla)/i,
      message: 'Evita referencias a instrucciones del sistema. Haz tu pregunta de tarot directamente.',
    },
    {
      pattern: /```|<\|.*?\|>|<system>|<\/system>|<prompt>|<\/prompt>/i,
      message: 'Tu pregunta contiene caracteres o delimitadores no permitidos.',
    },
    {
      pattern: /&#\d+;|%[0-9A-Fa-f]{2}|\\u[0-9A-Fa-f]{4}|\\x[0-9A-Fa-f]{2}/i,
      message: 'Caracteres codificados no están permitidos. Usa solo texto normal.',
    },
    {
      pattern: /\$\{.*\}|\$\(.*\)|`.*`/,
      message: 'Tu pregunta contiene sintaxis de comando que no está permitida.',
    },
    {
      pattern: /\b(jailbreak|bypass|override|sobrescribe|sobrescribir|hack|hackea|exploit|explotar)\b/i,
      message: 'Palabras sospechosas detectadas. Reformula tu pregunta de manera natural.',
    },
    {
      pattern: /\bnew task|nueva tarea|additional instruction|instrucción adicional\b/i,
      message: 'Evita instrucciones múltiples. Haz una sola pregunta sobre el tarot.',
    },
    // Detecta solicitudes técnicas (explica cómo programar, enseña matemáticas, etc.)
    {
      pattern: /\b(explain|explica|teach|enseña|tutorial|how to code|cómo programar|como programar)\b.*(code|código|program|programming|programación|python|javascript|java|c\+\+)/i,
      message: 'Esta pregunta parece solicitar información técnica. Enfócate en tu consulta sobre el tarot.',
    },
    // "rol:" siempre es sospechoso (formato de prompt injection común)
    {
      pattern: /\brol\s*:/i,
      message: 'No uses "rol:" en tu pregunta. Formula tu consulta de tarot directamente.',
    },
    // "role:" en inglés
    {
      pattern: /\brole\s*:/i,
      message: 'No uses "role:" en tu pregunta. Formula tu consulta de tarot directamente.',
    },
  ];

  // Verificar cada patrón
  for (const { pattern, message } of injectionPatterns) {
    if (pattern.test(trimmedQuestion)) {
      return {
        isValid: false,
        error: message,
        remainingChars: MAX_QUESTION_LENGTH - trimmedQuestion.length,
      };
    }
  }

  // 3. Detectar ratio sospechoso de caracteres especiales
  const specialCharsCount = (
    trimmedQuestion.match(/[^a-zA-Z0-9\s\u00C0-\u017F¿?¡!.,;:áéíóúñÁÉÍÓÚÑ]/g) || []
  ).length;
  const specialCharsRatio = specialCharsCount / trimmedQuestion.length;

  if (specialCharsRatio > 0.2) {
    return {
      isValid: false,
      error: 'Tu pregunta contiene demasiados símbolos especiales. Usa palabras naturales.',
      remainingChars: MAX_QUESTION_LENGTH - trimmedQuestion.length,
    };
  }

  // 4. Detectar exceso de signos de puntuación repetidos (posible ofuscación)
  if (/(.)\1{4,}/.test(trimmedQuestion)) {
    return {
      isValid: false,
      error: 'Evita repetir el mismo carácter muchas veces. Escribe con claridad.',
      remainingChars: MAX_QUESTION_LENGTH - trimmedQuestion.length,
    };
  }

  // Todo bien
  return {
    isValid: true,
    remainingChars: MAX_QUESTION_LENGTH - trimmedQuestion.length,
  };
};

/**
 * Sanitiza el texto para mostrarlo de forma segura
 * Normaliza espacios múltiples y trim
 */
export const sanitizeForDisplay = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ');
};
