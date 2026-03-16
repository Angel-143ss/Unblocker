import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Music, PenTool, Edit3, Camera, LayoutGrid, Palette } from 'lucide-react';
import { useAppContext, Discipline, Language } from '../context/AppContext';
import { translations } from '../lib/i18n';

const getDisciplines = (lang: Language): { id: Discipline; label: string; icon: React.ElementType; color: string }[] => [
  { id: 'Music', label: lang === 'es' ? 'Música' : 'Music', icon: Music, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: 'Drawing', label: lang === 'es' ? 'Dibujo/Pintura' : 'Drawing/Painting', icon: Palette, color: 'bg-pink-100 text-pink-600 border-pink-200' },
  { id: 'Writing', label: lang === 'es' ? 'Escritura' : 'Writing', icon: Edit3, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  { id: 'Sculpture', label: lang === 'es' ? 'Escultura' : 'Sculpture', icon: PenTool, color: 'bg-amber-100 text-amber-600 border-amber-200' },
  { id: 'Photography', label: lang === 'es' ? 'Fotografía' : 'Photography', icon: Camera, color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { id: 'General', label: lang === 'es' ? 'General / Otro' : 'General / Other', icon: LayoutGrid, color: 'bg-stone-100 text-stone-600 border-stone-200' },
];

export function Home() {
  const { discipline, setDiscipline, language } = useAppContext();
  const t = translations[language];
  const disciplines = getDisciplines(language);
  const navigate = useNavigate();

  const handleSelect = (d: Discipline) => {
    setDiscipline(d);
    navigate('/ideas');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto mt-12 text-center"
    >
      <h1 className="text-4xl font-bold text-stone-900 dark:text-white mb-4">
        {t.homeTitle}
      </h1>
      <p className="text-lg text-stone-600 dark:text-stone-400 mb-12">
        {t.homeSubtitle}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {disciplines.map((d) => {
          const isSelected = discipline === d.id;
          return (
            <button
              key={d.id}
              onClick={() => handleSelect(d.id)}
              className={`
                flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all
                hover:scale-105 hover:shadow-md
                ${isSelected ? 'border-indigo-500 shadow-md ring-4 ring-indigo-50 dark:ring-indigo-500/20 dark:bg-stone-800' : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'}
              `}
            >
              <div className={`p-4 rounded-full mb-4 ${d.color} dark:bg-opacity-20`}>
                <d.icon className="w-8 h-8" />
              </div>
              <span className="font-medium text-stone-800 dark:text-stone-200">{d.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
