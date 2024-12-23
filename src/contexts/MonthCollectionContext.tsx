import { createContext, useContext, ReactNode } from 'react';
import { useMonthCollections } from '@/hooks/useMonthCollections';
import type { MonthCollection } from '@/lib/types';

interface MonthCollectionContextType {
  collections: MonthCollection[];
  activeCollection: MonthCollection | null;
  loading: boolean;
  createCollection: (name: string, month: string, year: number) => Promise<void>;
  setActiveCollectionById: (id: string) => Promise<void>;
}

const MonthCollectionContext = createContext<MonthCollectionContextType | null>(null);

export function MonthCollectionProvider({ children }: { children: ReactNode }) {
  const monthCollections = useMonthCollections();

  return (
    <MonthCollectionContext.Provider value={monthCollections}>
      {children}
    </MonthCollectionContext.Provider>
  );
}

export function useMonthCollectionContext() {
  const context = useContext(MonthCollectionContext);
  if (!context) {
    throw new Error('useMonthCollectionContext must be used within MonthCollectionProvider');
  }
  return context;
}