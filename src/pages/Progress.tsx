import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Calendar, Tag, Target, ChevronDown } from 'lucide-react';
import { useAppContext, ChallengeData } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import { translations } from '../lib/i18n';

export function Progress() {
  const { progressNotes, addProgressNote, discipline, language } = useAppContext();
  const t = translations[language];
  const location = useLocation();
  const [newNote, setNewNote] = useState('');
  const [attachedChallenge, setAttachedChallenge] = useState<ChallengeData | null>(null);

  useEffect(() => {
    if (location.state?.prefill) {
      setNewNote(location.state.prefill);
    }
    if (location.state?.challenge) {
      setAttachedChallenge(location.state.challenge);
    }
    if (location.state?.prefill || location.state?.challenge) {
      // Clear the state so it doesn't prefill again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSave = () => {
    if (!newNote.trim()) return;
    addProgressNote({ content: newNote, discipline, challenge: attachedChallenge || undefined });
    setNewNote('');
    setAttachedChallenge(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-8"
    >
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">{t.progressTitle}</h1>
        <p className="text-stone-600 dark:text-stone-400">
          {t.progressSubtitle}
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 mb-10">
        <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">{t.newReflection}</h2>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={t.whatDidYouDiscover}
          className="w-full h-32 p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30 outline-none resize-none transition-all mb-4 text-stone-800 dark:text-stone-100"
        />
        
        {attachedChallenge && (
          <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Target className="w-4 h-4" />
                {t.attachedChallenge}
              </div>
              <p className="text-stone-800 dark:text-stone-200 text-sm font-medium">{attachedChallenge.title}</p>
            </div>
            <button
              onClick={() => setAttachedChallenge(null)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
            >
              <span className="sr-only">{t.close}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={!newNote.trim() && !attachedChallenge}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {t.saveNote}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-stone-800 dark:text-white">{t.history}</h2>
        
        {progressNotes.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400">{t.noNotesYet}</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-stone-200 dark:border-stone-800 ml-4 space-y-8 pb-8">
            {progressNotes.map((note) => (
              <div key={note.id} className="relative pl-8">
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-500" />
                
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-4 mb-3 text-sm text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(note.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <span className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                      <Tag className="w-3 h-3" />
                      {note.discipline}
                    </span>
                  </div>
                  <p className="text-stone-800 dark:text-stone-200 whitespace-pre-wrap mb-4">{note.content}</p>

                  {note.challenge && (
                    <details className="group bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                      <summary className="cursor-pointer p-4 font-medium text-stone-800 dark:text-stone-200 flex items-center justify-between select-none hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-indigo-500" />
                          <span>{t.challengePrefix} {note.challenge.title}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 pt-0 border-t border-stone-200 dark:border-stone-700 mt-2">
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
                          {note.challenge.type === 'visual' ? t.visualChallenge : t.conceptualChallenge}
                          {note.challenge.time && (
                            <>
                              <span className="text-stone-300 dark:text-stone-600">•</span>
                              <span className="text-stone-500 dark:text-stone-400">{note.challenge.time}</span>
                            </>
                          )}
                        </div>
                        <p className="text-stone-600 dark:text-stone-300 text-sm mb-4">{note.challenge.description}</p>
                        
                        {note.challenge.steps && note.challenge.steps.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-2">{t.steps}</h4>
                            <ul className="space-y-2">
                              {note.challenge.steps.map((step: string, idx: number) => (
                                <li key={idx} className="flex gap-2 text-sm text-stone-600 dark:text-stone-400">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {note.challenge.imageUrl && (
                          <img src={note.challenge.imageUrl} alt={t.challengeReference} className="w-full max-w-sm rounded-lg border border-stone-200 dark:border-stone-700 mt-4" />
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
