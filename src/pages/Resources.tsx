import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, BookOpen, Headphones, Video } from 'lucide-react';
import { useAppContext, Discipline, Language } from '../context/AppContext';
import { translations } from '../lib/i18n';

const getResourcesByDiscipline = (lang: Language): Record<Discipline, { category: string; icon: React.ElementType; items: { title: string; desc: string; link: string }[] }[]> => ({
  Writing: [
    {
      category: lang === 'es' ? 'Herramientas' : 'Tools', icon: BookOpen,
      items: [
        { title: 'The Most Dangerous Writing App', desc: lang === 'es' ? 'Si dejas de escribir, pierdes todo tu progreso.' : 'If you stop writing, you lose all your progress.', link: '#' },
        { title: lang === 'es' ? 'Generador de Prompts' : 'Prompt Generator', desc: lang === 'es' ? 'Miles de ideas para empezar tu próxima historia.' : 'Thousands of ideas to start your next story.', link: '#' },
      ]
    },
    {
      category: lang === 'es' ? 'Inspiración' : 'Inspiration', icon: Headphones,
      items: [
        { title: 'Playlist: Lo-Fi Focus', desc: lang === 'es' ? 'Música sin letras para mantener la concentración.' : 'Music without lyrics to maintain focus.', link: '#' },
      ]
    }
  ],
  Drawing: [
    {
      category: lang === 'es' ? 'Referencias' : 'References', icon: Video,
      items: [
        { title: 'Line of Action', desc: lang === 'es' ? 'Herramienta para practicar dibujo de gestos con temporizador.' : 'Tool to practice gesture drawing with a timer.', link: '#' },
        { title: 'Pinterest: Anatomía', desc: lang === 'es' ? 'Tableros curados para estudio de anatomía.' : 'Curated boards for anatomy study.', link: '#' },
      ]
    }
  ],
  Music: [
    {
      category: lang === 'es' ? 'Herramientas' : 'Tools', icon: Headphones,
      items: [
        { title: 'Oblique Strategies', desc: lang === 'es' ? 'Cartas digitales creadas por Brian Eno para romper bloqueos.' : 'Digital cards created by Brian Eno to break blocks.', link: '#' },
        { title: lang === 'es' ? 'Generador de Progresiones' : 'Progression Generator', desc: lang === 'es' ? 'Encuentra nuevas progresiones de acordes.' : 'Find new chord progressions.', link: '#' },
      ]
    }
  ],
  General: [
    {
      category: lang === 'es' ? 'Lecturas Recomendadas' : 'Recommended Readings', icon: BookOpen,
      items: [
        { title: 'El Camino del Artista', desc: lang === 'es' ? 'Julia Cameron - Un curso de 12 semanas para descubrir y rescatar tu creatividad.' : 'Julia Cameron - A 12-week course to discover and rescue your creativity.', link: '#' },
        { title: 'Roba como un artista', desc: lang === 'es' ? 'Austin Kleon - 10 cosas que nadie te dijo sobre ser creativo.' : 'Austin Kleon - 10 things nobody told you about being creative.', link: '#' },
      ]
    },
    {
      category: 'Podcasts', icon: Headphones,
      items: [
        { title: 'Creative Pep Talk', desc: lang === 'es' ? 'Consejos prácticos y ánimo para creativos.' : 'Practical advice and encouragement for creatives.', link: '#' },
      ]
    }
  ],
  Sculpture: [],
  Photography: []
});

export function Resources() {
  const { discipline, language } = useAppContext();
  const t = translations[language];
  const resourcesByDiscipline = getResourcesByDiscipline(language);
  
  // Merge general resources with discipline specific ones
  const resources = [
    ...(resourcesByDiscipline[discipline] || []),
    ...(discipline !== 'General' ? resourcesByDiscipline.General : [])
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-8"
    >
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">{t.resourcesTitle}</h1>
        <p className="text-stone-600 dark:text-stone-400">
          {t.resourcesSubtitle.replace('{discipline}', discipline.toLowerCase())}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {resources.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-stone-800 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
              <section.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2>{section.category}</h2>
            </div>
            
            <div className="space-y-4">
              {section.items.map((item, itemIdx) => (
                <a 
                  key={itemIdx}
                  href={item.link}
                  onClick={(e) => e.preventDefault()} // Prevent navigation for demo
                  className="block bg-white dark:bg-stone-900 rounded-xl p-5 shadow-sm border border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {item.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
