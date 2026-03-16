import React, { createContext, useContext, useState, useEffect } from 'react';

export type Discipline = 'Music' | 'Sculpture' | 'Drawing' | 'Writing' | 'Photography' | 'General';
export type CreativeMode = 'Unlock' | 'Practice' | 'Challenge';
export type Theme = 'light' | 'dark';
export type Language = 'es' | 'en';

export interface ChallengeData {
  type: 'text' | 'visual';
  title: string;
  description: string;
  time?: string;
  steps?: string[];
  imageUrl?: string;
}

interface AppContextType {
  discipline: Discipline;
  setDiscipline: (d: Discipline) => void;
  creativeMode: CreativeMode;
  setCreativeMode: (m: CreativeMode) => void;
  progressNotes: ProgressNote[];
  addProgressNote: (note: Omit<ProgressNote, 'id' | 'date'>) => void;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

export interface ProgressNote {
  id: string;
  date: string;
  content: string;
  discipline: Discipline;
  challenge?: ChallengeData;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [discipline, setDisciplineState] = useState<Discipline>(() => {
    const saved = localStorage.getItem('creative_discipline');
    return (saved as Discipline) || 'General';
  });

  const [creativeMode, setCreativeModeState] = useState<CreativeMode>(() => {
    const saved = localStorage.getItem('creative_mode');
    return (saved as CreativeMode) || 'Unlock';
  });

  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>(() => {
    const saved = localStorage.getItem('creative_progress');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('creative_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('creative_language');
    return (saved as Language) || 'es';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setDiscipline = (d: Discipline) => {
    setDisciplineState(d);
    localStorage.setItem('creative_discipline', d);
  };

  const setCreativeMode = (m: CreativeMode) => {
    setCreativeModeState(m);
    localStorage.setItem('creative_mode', m);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    localStorage.setItem('creative_theme', newTheme);
  };

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    localStorage.setItem('creative_language', l);
  };

  const addProgressNote = (note: Omit<ProgressNote, 'id' | 'date'>) => {
    const id = typeof crypto.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2) + Date.now().toString(36);
      
    const newNote: ProgressNote = {
      ...note,
      id,
      date: new Date().toISOString(),
    };
    const updated = [newNote, ...progressNotes];
    setProgressNotes(updated);
    localStorage.setItem('creative_progress', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{ 
      discipline, 
      setDiscipline, 
      creativeMode, 
      setCreativeMode, 
      progressNotes, 
      addProgressNote, 
      theme, 
      toggleTheme, 
      language, 
      setLanguage 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
