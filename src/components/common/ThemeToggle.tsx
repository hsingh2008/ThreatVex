import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getInitialTheme, applyTheme, Theme } from '../../services/theme';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Ensure the document element has the correct class on initial mount
    const current = getInitialTheme();
    setTheme(current);
    applyTheme(current);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<Theme>;
      if (customEvent.detail) {
        setTheme(customEvent.detail);
      } else {
        setTheme(getInitialTheme());
      }
    };

    window.addEventListener('threatvex-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    return () => {
      window.removeEventListener('threatvex-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const toggle = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${
        isDark
          ? 'bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-teal-neon border-navy-700/80 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-teal-600 border-slate-300 shadow-sm'
      }`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
