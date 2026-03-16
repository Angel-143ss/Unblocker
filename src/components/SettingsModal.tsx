import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Sun, Globe, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/i18n';

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { theme, toggleTheme, language, setLanguage } = useAppContext();
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-xl z-50 overflow-hidden border border-stone-200 dark:border-stone-800"
          >
            <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
              <h2 className="text-xl font-bold text-stone-900 dark:text-white">{t.settings}</h2>
              <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Language */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                  <Globe className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium">{t.language}</span>
                </div>
                <div className="flex bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage('es')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${language === 'es' ? 'bg-white dark:bg-stone-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                  >
                    ES
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${language === 'en' ? 'bg-white dark:bg-stone-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <span className="font-medium">{theme === 'dark' ? t.darkMode : t.lightMode}</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Version */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                  <Info className="w-5 h-5 text-stone-400" />
                  <span className="font-medium">{t.version}</span>
                </div>
                <span className="text-sm text-stone-500 dark:text-stone-400 font-mono">v1.0.0</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
