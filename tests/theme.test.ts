import { describe, it, expect, beforeEach, vi } from 'vitest';

// Lightweight browser mock for Node environment in unit tests
const mockStore: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => mockStore[key] || null,
  setItem: (key: string, val: string) => { mockStore[key] = val; },
  removeItem: (key: string) => { delete mockStore[key]; },
  clear: () => { Object.keys(mockStore).forEach(k => delete mockStore[k]); }
};

const classListSet = new Set<string>();
const mockDocument = {
  documentElement: {
    classList: {
      add: (c: string) => classListSet.add(c),
      remove: (c: string) => classListSet.delete(c),
      contains: (c: string) => classListSet.has(c),
    },
    className: ''
  }
};

const listeners: Record<string, Function[]> = {};
const mockWindow = {
  dispatchEvent: (event: any) => {
    const list = listeners[event.type] || [];
    list.forEach(fn => fn(event));
    return true;
  },
  addEventListener: (type: string, fn: Function) => {
    listeners[type] = listeners[type] || [];
    listeners[type].push(fn);
  },
  removeEventListener: (type: string, fn: Function) => {
    listeners[type] = (listeners[type] || []).filter(f => f !== fn);
  }
};

// Assign globals if missing in Node
(globalThis as any).localStorage = mockLocalStorage;
(globalThis as any).document = mockDocument;
(globalThis as any).window = mockWindow;

import { getInitialTheme, applyTheme, THEME_STORAGE_KEY } from '../src/services/theme';

describe('Theme Service & State Management', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    classListSet.clear();
  });

  it('should default to dark mode when no theme is in localStorage', () => {
    expect(getInitialTheme()).toBe('dark');
  });

  it('should read existing light theme from localStorage', () => {
    mockLocalStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(getInitialTheme()).toBe('light');
  });

  it('should read existing dark theme from localStorage', () => {
    mockLocalStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(getInitialTheme()).toBe('dark');
  });

  it('should apply light theme: add light class, remove dark class, save to localStorage and dispatch event', () => {
    let dispatchedTheme: string | null = null;
    mockWindow.addEventListener('threatvex-theme-change', (e: any) => {
      dispatchedTheme = e.detail;
    });

    applyTheme('light');

    expect(mockDocument.documentElement.classList.contains('light')).toBe(true);
    expect(mockDocument.documentElement.classList.contains('dark')).toBe(false);
    expect(mockLocalStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(dispatchedTheme).toBe('light');
  });

  it('should apply dark theme: add dark class, remove light class, save to localStorage and dispatch event', () => {
    let dispatchedTheme: string | null = null;
    mockWindow.addEventListener('threatvex-theme-change', (e: any) => {
      dispatchedTheme = e.detail;
    });

    applyTheme('dark');

    expect(mockDocument.documentElement.classList.contains('dark')).toBe(true);
    expect(mockDocument.documentElement.classList.contains('light')).toBe(false);
    expect(mockLocalStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(dispatchedTheme).toBe('dark');
  });
});
