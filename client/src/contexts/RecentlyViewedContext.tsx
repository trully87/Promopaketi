import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface RecentlyViewedContextType {
  recentlyViewed: string[];
  addRecentlyViewed: (packageId: string) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const RECENTLY_VIEWED_STORAGE_KEY = 'brainbox_recently_viewed';
const MAX_RECENTLY_VIEWED = 8;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed);
        }
      } catch (error) {
        console.error('Failed to parse recently viewed from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save recently viewed to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isLoaded]);

  const addRecentlyViewed = useCallback((packageId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== packageId);
      const updated = [packageId, ...filtered];
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewed,
      addRecentlyViewed,
      clearRecentlyViewed
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  }
  return context;
}
