export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'threatvex_theme';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch (err) {
    console.warn('Unable to access localStorage for theme:', err);
  }
  return 'dark'; // Dark Mode remains the default
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (err) {
    console.warn('Unable to persist theme to localStorage:', err);
  }

  // Notify any active listeners across components
  window.dispatchEvent(new CustomEvent('threatvex-theme-change', { detail: theme }));
}
