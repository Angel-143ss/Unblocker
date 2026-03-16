import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Square, Clock, CheckCircle2 } from 'lucide-react';
import { useAppContext, Discipline, Language } from '../context/AppContext';
import { translations } from '../lib/i18n';

const getExercisesByDiscipline = (lang: Language): Record<Discipline, { title: string; description: string; duration: number }[]> => ({
  Writing: [
    { 
      title: lang === 'es' ? 'Escritura Automática' : 'Automatic Writing', 
      description: lang === 'es' ? 'Escribe sin parar durante 5 minutos. No corrijas, no pienses, solo deja que las palabras fluyan.' : 'Write non-stop for 5 minutes. Do not correct, do not think, just let the words flow.', 
      duration: 5 
    },
    { 
      title: lang === 'es' ? 'Perspectiva Inversa' : 'Reverse Perspective', 
      description: lang === 'es' ? 'Describe tu escena actual desde el punto de vista de un objeto inanimado en la habitación.' : 'Describe your current scene from the point of view of an inanimate object in the room.', 
      duration: 10 
    },
  ],
  Drawing: [
    { 
      title: lang === 'es' ? 'Dibujo a Ciegas' : 'Blind Drawing', 
      description: lang === 'es' ? 'Dibuja un objeto frente a ti sin mirar el papel. Concéntrate solo en los contornos.' : 'Draw an object in front of you without looking at the paper. Focus only on the contours.', 
      duration: 3 
    },
    { 
      title: lang === 'es' ? 'Mano No Dominante' : 'Non-Dominant Hand', 
      description: lang === 'es' ? 'Intenta hacer un boceto rápido usando tu mano no dominante.' : 'Try to make a quick sketch using your non-dominant hand.', 
      duration: 5 
    },
  ],
  Music: [
    { 
      title: lang === 'es' ? 'Limitación de Notas' : 'Note Limitation', 
      description: lang === 'es' ? 'Compón una melodía corta usando solo 3 notas específicas.' : 'Compose a short melody using only 3 specific notes.', 
      duration: 10 
    },
    { 
      title: lang === 'es' ? 'Ritmo Encontrado' : 'Found Rhythm', 
      description: lang === 'es' ? 'Graba un sonido ambiental (tráfico, electrodoméstico) y úsalo como base rítmica.' : 'Record an ambient sound (traffic, appliance) and use it as a rhythmic base.', 
      duration: 15 
    },
  ],
  Sculpture: [
    { 
      title: lang === 'es' ? 'Material Inusual' : 'Unusual Material', 
      description: lang === 'es' ? 'Crea una forma pequeña usando solo materiales de oficina (clips, papel, cinta).' : 'Create a small shape using only office supplies (paperclips, paper, tape).', 
      duration: 10 
    },
    { 
      title: lang === 'es' ? 'Ojos Vendados' : 'Blindfolded', 
      description: lang === 'es' ? 'Modela arcilla o plastilina con los ojos cerrados, enfocándote en la textura.' : 'Model clay or playdough with your eyes closed, focusing on the texture.', 
      duration: 5 
    },
  ],
  Photography: [
    { 
      title: lang === 'es' ? 'Un Solo Color' : 'Single Color', 
      description: lang === 'es' ? 'Toma 5 fotos donde un color específico sea el protagonista absoluto.' : 'Take 5 photos where a specific color is the absolute protagonist.', 
      duration: 15 
    },
    { 
      title: lang === 'es' ? 'Ángulo Extremo' : 'Extreme Angle', 
      description: lang === 'es' ? 'Fotografía un objeto cotidiano desde un ángulo completamente inusual (muy desde abajo o arriba).' : 'Photograph an everyday object from a completely unusual angle (very from below or above).', 
      duration: 10 
    },
  ],
  General: [
    { 
      title: lang === 'es' ? 'Asociación Libre' : 'Free Association', 
      description: lang === 'es' ? 'Toma una palabra al azar y escribe/dibuja/toca lo primero que te venga a la mente.' : 'Take a random word and write/draw/play the first thing that comes to mind.', 
      duration: 5 
    },
    { 
      title: lang === 'es' ? 'Destrucción Creativa' : 'Creative Destruction', 
      description: lang === 'es' ? 'Toma una obra vieja que no te guste y destrúyela para crear algo nuevo con sus partes.' : 'Take an old piece you don\'t like and destroy it to create something new with its parts.', 
      duration: 15 
    },
  ],
});

export function Exercises() {
  const { discipline, language } = useAppContext();
  const t = translations[language];
  const exercisesByDiscipline = getExercisesByDiscipline(language);
  const exercises = exercisesByDiscipline[discipline] || exercisesByDiscipline.General;
  
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  React.useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play a sound or show notification here ideally
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startExercise = (index: number) => {
    setActiveExercise(index);
    setTimeLeft(exercises[index].duration * 60);
    setIsRunning(true);
  };

  const stopExercise = () => {
    setIsRunning(false);
    setActiveExercise(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-8"
    >
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">{t.exercisesTitle}</h1>
        <p className="text-stone-600 dark:text-stone-400">
          {t.exercisesSubtitle.replace('{discipline}', discipline.toLowerCase())}
        </p>
      </div>

      {activeExercise !== null ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-10 shadow-sm border border-indigo-100 dark:border-stone-800 text-center">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{exercises[activeExercise].title}</h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 mb-12 max-w-2xl mx-auto">
            {exercises[activeExercise].description}
          </p>
          
          <div className="text-7xl font-mono font-light text-indigo-600 dark:text-indigo-400 mb-12 tracking-tighter">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              {isRunning ? <Square className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
              {isRunning ? t.pause : t.resume}
            </button>
            <button
              onClick={stopExercise}
              className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 px-8 py-3 rounded-full font-medium transition-colors"
            >
              {t.finish}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {exercises.map((ex, idx) => (
            <div key={idx} className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">{ex.title}</h3>
                <span className="flex items-center gap-1 text-sm font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-md">
                  <Clock className="w-4 h-4" />
                  {ex.duration} {t.min}
                </span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 mb-6 min-h-[3rem]">
                {ex.description}
              </p>
              <button
                onClick={() => startExercise(idx)}
                className="w-full flex items-center justify-center gap-2 bg-stone-50 dark:bg-stone-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-stone-200 dark:border-stone-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 px-4 py-2.5 rounded-xl font-medium transition-colors"
              >
                <Play className="w-4 h-4" fill="currentColor" />
                {t.startExercise}
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
