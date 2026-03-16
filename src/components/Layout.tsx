import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Lightbulb, Dumbbell, LineChart, Users, Wrench, Wind, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { SettingsModal } from './SettingsModal';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/i18n';

export function Layout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { language } = useAppContext();
  const t = translations[language];

  const navItems = [
    { to: '/ideas', icon: Lightbulb, label: t.ideas },
    { to: '/exercises', icon: Dumbbell, label: t.exercises },
    { to: '/progress', icon: LineChart, label: t.progress },
    { to: '/community', icon: Users, label: t.community },
    { to: '/resources', icon: Wrench, label: t.resources },
    { to: '/mindfulness', icon: Wind, label: t.mindfulness },
  ];

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col transition-colors duration-200">
        <div className="p-6">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
            <Lightbulb className="w-6 h-6" />
            <span>Unblocker</span>
          </NavLink>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors",
                  isActive 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium" 
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
            {t.settings}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
