import { useSyncExternalStore, useCallback, useMemo } from 'react';
import { ExtractedMedia } from '@/app/api/extract/route';

const STORAGE_KEY = 'gosaveclip_history';

function getSnapshot(): string {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data || '[]';
  } catch {
    return '[]';
  }
}

function getServerSnapshot(): string {
  return '[]';
}

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', handleStorage);
  };
}

export function useHistory() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const history = useMemo<ExtractedMedia[]>(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [raw]);

  const saveToHistory = useCallback((media: ExtractedMedia) => {
    try {
      const currentRaw = getSnapshot();
      let currentList: ExtractedMedia[] = [];
      try {
        currentList = JSON.parse(currentRaw);
      } catch {
        currentList = [];
      }
      const filtered = currentList.filter((item) => item.id !== media.id);
      const updated = [media, ...filtered].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      notify();
    } catch {
      // storage unavailable
    }
  }, []);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      notify();
    } catch {
      // storage unavailable
    }
  }, []);

  return {
    history,
    saveToHistory,
    clearHistory,
  };
}
