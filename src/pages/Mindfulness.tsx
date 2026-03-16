import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Play, Square } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/i18n';

export function Mindfulness() {
  const { language } = useAppContext();
  const t = translations[language];
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    let timeout: number;
    if (isActive) {
      if (phase === 'inhale') {
        timeout = window.setTimeout(() => setPhase('hold'), 4000); // 4s inhale
      } else if (phase === 'hold') {
        timeout = window.setTimeout(() => setPhase('exhale'), 4000); // 4s hold
      } else if (phase === 'exhale') {
        timeout = window.setTimeout(() => setPhase('inhale'), 6000); // 6s exhale
      }
    }
    return () => clearTimeout(timeout);
  }, [isActive, phase]);

  const toggleSession = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('inhale');
    } else {
      setIsActive(true);
      setPhase('inhale');
    }
  };

  const getInstruction = () => {
    if (!isActive) return t.pressStart;
    switch (phase) {
      case 'inhale': return t.breatheIn;
      case 'hold': return t.hold;
      case 'exhale': return t.breatheOut;
    }
  };

  const getScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 1;
    }
  };

  const getDuration = () => {
    switch (phase) {
      case 'inhale': return 4;
      case 'hold': return 4;
      case 'exhale': return 6;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-8 text-center"
    >
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">{t.mindfulnessTitle}</h1>
        <p className="text-stone-600 dark:text-stone-400">
          {t.mindfulnessSubtitle}
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 shadow-sm border border-stone-200 dark:border-stone-800 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Breathing Circle */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-12">
          <motion.div
            animate={{ scale: getScale() }}
            transition={{ duration: getDuration(), ease: "easeInOut" }}
            className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/40 rounded-full opacity-50"
          />
          <motion.div
            animate={{ scale: getScale() * 0.8 }}
            transition={{ duration: getDuration(), ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-full h-full bg-indigo-200 dark:bg-indigo-800/40 rounded-full opacity-60"
          />
          <motion.div
            animate={{ scale: getScale() * 0.6 }}
            transition={{ duration: getDuration(), ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-full h-full bg-indigo-500 dark:bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
          >
            <Wind className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={getInstruction()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl font-medium text-stone-700 dark:text-stone-200 h-8 mb-12"
          >
            {getInstruction()}
          </motion.p>
        </AnimatePresence>

        <button
          onClick={toggleSession}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-medium text-lg transition-all shadow-md ${
            isActive 
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-indigo-900/20'
          }`}
        >
          {isActive ? (
            <>
              <Square className="w-5 h-5" fill="currentColor" />
              {t.stop}
            </>
          ) : (
            <>
              <Play className="w-5 h-5" fill="currentColor" />
              {t.startBreathing}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
