# 🔮 Arcano Oracle - Tarot Reading App

Una aplicación web interactiva de lectura de tarot con interpretaciones generadas por IA, parte del universo transmedia de **Arcano Ascendant**.

## ✨ Características

- 🎴 **Mazo Completo**: 78 cartas del tarot (22 Arcanos Mayores + 56 Arcanos Menores)
- 🔄 **Cartas Invertidas**: Cada carta puede aparecer derecha o invertida (50% probabilidad)
- 📊 **4 Tipos de Tiradas**:
  - Carta del Día (1 carta)
  - Pasado, Presente, Futuro (3 cartas)
  - Decisión (5 cartas)
  - Cruz Celta (10 cartas)
- 🤖 **Interpretaciones con IA**: Powered by Groq API (Mixtral-8x7b)
- 💫 **Animaciones Místicas**: Flip cards, efectos de brillo, y fondo animado
- 💾 **Historial Local**: Guarda tus lecturas en localStorage
- 📱 **Mobile-First**: Diseño responsive optimizado para móviles

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
cd arcano-oracle
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar API Key de Groq**

   Crea un archivo `.env` en la raíz del proyecto:
```bash
VITE_GROQ_API_KEY=tu_api_key_aqui
```

   Obtén tu API key gratis en: [https://console.groq.com/keys](https://console.groq.com/keys)

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
```

## 🛠️ Stack Tecnológico

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **AI Integration**: Groq SDK (Mixtral-8x7b-32768)
- **Icons**: Lucide React

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── cards/
│   │   ├── TarotCard.tsx          # Componente de carta con animación flip
│   │   └── CardPlaceholder.tsx    # Placeholder para posiciones vacías
│   ├── spreads/
│   │   └── SpreadLayout.tsx       # Layout genérico para tiradas
│   ├── ui/
│   │   ├── Button.tsx             # Botón reutilizable
│   │   ├── Loading.tsx            # Indicador de carga
│   │   └── Background.tsx         # Fondo animado místico
│   └── interpretation/
│       └── InterpretationDisplay.tsx # Muestra la interpretación
├── data/
│   ├── cards.ts                   # Datos de las 78 cartas
│   └── spreads.ts                 # Configuraciones de tiradas
├── services/
│   └── groq.service.ts           # Integración con Groq API
├── store/
│   └── readingStore.ts           # Estado global con Zustand
├── pages/
│   ├── Home.tsx                   # Página de inicio/selección
│   └── Reading.tsx                # Página de lectura
└── types/
    └── tarot.ts                   # Tipos TypeScript
```

## 🎨 Paleta de Colores

```css
--primary: #6B46C1      /* Púrpura místico */
--secondary: #9333EA    /* Violeta brillante */
--background: #0F0F23   /* Negro azulado */
--card-bg: #1a1a2e      /* Gris oscuro */
--text: #E5E5E7         /* Blanco suave */
--accent: #F59E0B       /* Dorado */
```

## 🎯 Uso

1. **Selecciona una tirada** en la página de inicio
2. **(Opcional)** Escribe una pregunta para personalizar la lectura
3. **Haz clic en los espacios brillantes** para sacar cartas una por una
4. **Obtén tu interpretación** cuando todas las cartas estén reveladas
5. **Guarda o comparte** tu lectura

## 🔮 Tipos de Tiradas

### Carta del Día
Una sola carta para guiar tu día con sabiduría y claridad.

### Pasado, Presente, Futuro
- **Pasado**: Influencias que te afectan
- **Presente**: Tu situación actual
- **Futuro**: Lo que te espera

### Decisión (5 cartas)
- La Situación
- Opción A
- Opción B
- Lo que necesitas saber
- Resultado Potencial

### Cruz Celta (10 cartas)
La lectura más completa:
1. Situación Actual
2. Desafío
3. Pasado Distante
4. Pasado Reciente
5. Mejor Resultado Posible
6. Futuro Próximo
7. Tu Enfoque
8. Influencias Externas
9. Esperanzas y Miedos
10. Resultado

## 🤖 Sobre la IA

Las interpretaciones son generadas por el modelo **Mixtral-8x7b-32768** a través de Groq API, diseñado para:
- Conectar todas las cartas en una narrativa coherente
- Proporcionar consejos prácticos y accionables
- Mantener un tono empático, místico y accesible
- Considerar posiciones específicas y cartas invertidas

## 📝 Notas

- Las cartas actualmente usan **placeholders visuales**. Las imágenes finales del arte de Arcano Ascendant se agregarán en futuras versiones.
- El historial de lecturas se guarda en **localStorage** del navegador.
- La API de Groq tiene un tier gratuito generoso perfecto para desarrollo y uso personal.

## 🌟 Roadmap Futuro

- [ ] Agregar imágenes reales de las cartas (arte de Arcano Ascendant)
- [ ] Modo historia conectado con el lore del juego
- [ ] Daily card con notificaciones
- [ ] Estadísticas personales
- [ ] Música ambiental opcional
- [ ] Más tipos de tiradas
- [ ] Sistema de favoritos

## 📜 Licencia

Este proyecto es parte del universo transmedia de **Arcano Ascendant**.

---

**¡Que el oráculo ilumine tu camino!** ✨🔮✨
