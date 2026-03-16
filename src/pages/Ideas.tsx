import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, Loader2, Image as ImageIcon, ListChecks, Share2, Save, Zap, Edit3, Trophy } from 'lucide-react';
import { useAppContext, CreativeMode } from '../context/AppContext';
import { GoogleGenAI, Type } from '@google/genai';
import { useNavigate } from 'react-router-dom';
import { translations } from '../lib/i18n';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface IdeaData {
  type: 'text' | 'visual';
  title: string;
  description: string;
  time?: string;
  steps?: string[];
  imageUrl?: string;
}

export function Ideas() {
  const { discipline, language, creativeMode, setCreativeMode } = useAppContext();
  const t = translations[language];
  const navigate = useNavigate();
  const [idea, setIdea] = useState<IdeaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const modes: { id: CreativeMode; label: string; desc: string; icon: React.ElementType; color: string; bgColor: string }[] = [
    { id: 'Unlock', label: t.modeUnlock, desc: t.modeUnlockDesc, icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'Practice', label: t.modePractice, desc: t.modePracticeDesc, icon: Edit3, color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'Challenge', label: t.modeChallenge, desc: t.modeChallengeDesc, icon: Trophy, color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  const generateIdea = async () => {
    setLoading(true);
    setLoadingStep(t.thinkingIdea);
    try {
      const modeConfig = {
        Unlock: {
          goal: "Romper el bloqueo creativo rápidamente.",
          duration: "1 a 5 minutos",
          complexity: "Muy simple y sin presión.",
          elements: "Máximo 1-2 objetos o conceptos.",
          focus: "Explorar, jugar y producir algo rápido, no en la perfección.",
          examples: "Dibuja un objeto cotidiano usando una sola línea continua. Escribe 3 palabras que describan tu estado de ánimo. Crea un ritmo simple golpeando la mesa durante 30 segundos."
        },
        Practice: {
          goal: "Activar la creatividad y practicar habilidades básicas.",
          duration: "10 a 20 minutos",
          complexity: "Dificultad moderada.",
          elements: "2-4 elementos o conceptos.",
          focus: "Experimentar con técnicas o combinaciones creativas.",
          examples: "Dibuja un animal usando solo formas geométricas. Escribe un microcuento de 5 frases inspirado en la lluvia. Crea una melodía corta inspirada en la palabra 'noche'."
        },
        Challenge: {
          goal: "Profundizar en la creatividad cuando el bloqueo ya fue superado.",
          duration: "30 minutos o más",
          complexity: "Más complejo y elaborado.",
          elements: "Puede incluir escenas, combinaciones de conceptos o técnicas específicas.",
          focus: "Producir una obra más detallada y profunda.",
          examples: "Dibuja una escena donde un objeto cotidiano tenga vida. Escribe una historia corta donde el protagonista encuentre algo inesperado. Compón una melodía que transmita nostalgia."
        }
      };

      const currentConfig = modeConfig[creativeMode];

      const prompt = `Actúa como un coach de creatividad para un artista de la disciplina: ${discipline}.
      Genera un reto creativo para el MODO: ${creativeMode}.
      
      OBJETIVO: ${currentConfig.goal}
      DURACIÓN: ${currentConfig.duration}
      COMPLEJIDAD: ${currentConfig.complexity}
      ELEMENTOS: ${currentConfig.elements}
      ENFOQUE: ${currentConfig.focus}
      
      EJEMPLOS DE REFERENCIA: ${currentConfig.examples}
      
      REGLAS CRÍTICAS:
      - Instrucciones claras, simples y directas.
      - Si es visual, la imagen debe ser coherente con la complejidad del modo.
      - Prioriza la exploración y el juego.
      
      Tienes dos opciones (elige aleatoriamente):
      1. 'text': Un reto conceptual breve y muy inspirador.
      2. 'visual': Un reto concreto paso a paso basado en una imagen.
      
      IMPORTANTE PARA EL IMAGE PROMPT: Si eliges 'visual', el 'imagePrompt' (en inglés) debe describir una imagen coherente con el modo. Para 'Unlock' debe ser extremadamente minimalista. Para 'Challenge' puede ser más detallada.

      Devuelve un JSON con la estructura solicitada.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Debe ser 'text' o 'visual'" },
              title: { type: Type.STRING, description: "Título corto del reto" },
              description: { type: Type.STRING, description: "Descripción del reto" },
              time: { type: Type.STRING, description: "Tiempo sugerido (ej: '5 minutos', '10 minutos')" },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Pasos a seguir (opcional, útil para retos visuales)"
              },
              imagePrompt: { type: Type.STRING, description: "Prompt detallado en inglés para generar una imagen minimalista por IA que acompañe el reto (solo si type es 'visual')" }
            },
            required: ["type", "title", "description", "time"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}') as IdeaData & { imagePrompt?: string };

      if (data.type === 'visual' && data.imagePrompt) {
        setLoadingStep(language === 'es' ? 'Generando imagen de referencia...' : 'Generating reference image...');
        try {
          const imageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [{ text: data.imagePrompt }]
            },
            config: {
              imageConfig: { aspectRatio: "1:1" }
            }
          });

          for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              data.imageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        } catch (imgError) {
          console.error('Error generating image:', imgError);
          // Fallback to text if image fails
          data.type = 'text';
        }
      }

      setIdea(data);
    } catch (error) {
      console.error('Error generating idea:', error);
      setIdea({
        type: 'text',
        title: language === 'es' ? 'Error de conexión' : 'Connection error',
        description: language === 'es' ? 'Hubo un error al generar la idea. Por favor, intenta de nuevo.' : 'There was an error generating the idea. Please try again.'
      });
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-12"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">{t.ideasTitle}</h1>
        <p className="text-stone-600 dark:text-stone-400 mb-8">
          {t.ideasSubtitle} {discipline.toLowerCase()}.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {modes.map((mode) => {
            const isSelected = creativeMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setCreativeMode(mode.id)}
                className={`
                  flex flex-col items-center p-4 rounded-2xl border-2 transition-all text-left
                  ${isSelected 
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 ring-2 ring-indigo-500/20' 
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'}
                `}
              >
                <div className={`p-2 rounded-lg ${mode.bgColor} ${mode.color} mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-stone-900 dark:text-white text-sm mb-1">{mode.label}</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 text-center">{mode.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-sm border border-stone-200 dark:border-stone-800 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-amber-50 dark:bg-amber-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

        {loading ? (
          <div className="flex flex-col items-center text-indigo-600 dark:text-indigo-400 py-12">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-medium">{loadingStep}</p>
          </div>
        ) : idea ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 w-full"
          >
            {idea.type === 'visual' ? (
              <div className="grid md:grid-cols-2 gap-8 items-start text-left">
                <div>
                  <div className="flex items-center gap-2 text-amber-500 mb-4">
                    <ImageIcon className="w-6 h-6" />
                    <span className="font-bold uppercase tracking-wider text-sm">{t.visualChallenge}</span>
                    {idea.time && (
                      <>
                        <span className="text-stone-300 dark:text-stone-600">•</span>
                        <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{idea.time}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-3">{idea.title}</h2>
                  <p className="text-stone-600 dark:text-stone-300 mb-6">{idea.description}</p>
                  
                  {idea.steps && idea.steps.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold mb-2">
                        <ListChecks className="w-5 h-5 text-indigo-500" />
                        <h3>{t.stepsToFollow}</h3>
                      </div>
                      <ul className="space-y-3">
                        {idea.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-stone-600 dark:text-stone-400">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 aspect-square flex items-center justify-center">
                  {idea.imageUrl ? (
                    <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-stone-400 flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                      <span>{t.imageNotAvailable}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center items-center gap-2 mb-6">
                  <Sparkles className="w-8 h-8 text-amber-500" />
                  {idea.time && (
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                      {idea.time}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4">{idea.title}</h2>
                <p className="text-xl font-medium text-stone-700 dark:text-stone-300 leading-relaxed italic">
                  "{idea.description}"
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="z-10 text-stone-400 dark:text-stone-500 flex flex-col items-center py-12">
            <LightbulbIcon className="w-16 h-16 mb-4 opacity-50" />
            <p>{t.clickToGenerate}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={generateIdea}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-medium text-lg transition-transform active:scale-95 disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-indigo-200 dark:shadow-indigo-900/20"
        >
          {idea ? (
            <>
              <RefreshCw className="w-5 h-5" />
              {t.generateAnother}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {t.inspireMeNow}
            </>
          )}
        </button>

        {idea && (
          <>
            <button
              onClick={() => {
                navigate('/community', { 
                  state: { 
                    prefill: t.completedChallengeText.replace('{title}', idea.title),
                    challenge: idea
                  } 
                });
              }}
              className="flex items-center justify-center gap-2 bg-white dark:bg-stone-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-stone-700 hover:border-indigo-200 dark:hover:border-stone-600 px-6 py-4 rounded-full font-medium text-lg transition-transform active:scale-95 shadow-sm"
            >
              <Share2 className="w-5 h-5" />
              {t.shareProgress}
            </button>
            <button
              onClick={() => {
                navigate('/progress', { 
                  state: { 
                    prefill: t.completedChallengeText.replace('{title}', idea.title),
                    challenge: idea
                  } 
                });
              }}
              className="flex items-center justify-center gap-2 bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-100 dark:border-stone-700 hover:border-emerald-200 dark:hover:border-stone-600 px-6 py-4 rounded-full font-medium text-lg transition-transform active:scale-95 shadow-sm"
            >
              <Save className="w-5 h-5" />
              {t.saveToProgress}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function LightbulbIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
