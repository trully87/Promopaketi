import { createContext, useContext, useState, useEffect } from 'react';
import type { Package } from '@shared/schema';

interface ComparisonContextType {
  comparisonList: Package[];
  addToComparison: (pkg: Package) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
  maxComparisons: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const maxComparisons = 4;
  const [comparisonList, setComparisonList] = useState<Package[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('brainbox_comparison');
    if (saved) {
      try {
        setComparisonList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse comparison list', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('brainbox_comparison', JSON.stringify(comparisonList));
  }, [comparisonList]);

  const addToComparison = (pkg: Package) => {
    setComparisonList(prev => {
      // Check if already exists
      if (prev.some(p => p.id === pkg.id)) {
        return prev;
      }
      
      // Check max limit
      if (prev.length >= maxComparisons) {
        return prev;
      }
      
      return [...prev, pkg];
    });
  };

  const removeFromComparison = (id: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== id));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isInComparison = (id: string) => {
    return comparisonList.some(p => p.id === id);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        maxComparisons,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
}
