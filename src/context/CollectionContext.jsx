import { createContext, useContext, useState, useEffect } from 'react';

const CollectionContext = createContext();

export function CollectionProvider({ children }) {
  // Read from localStorage or default to 'MEN'
  const [collection, setCollection] = useState(() => {
    return localStorage.getItem('stylehub_collection') || 'MEN';
  });

  useEffect(() => {
    localStorage.setItem('stylehub_collection', collection);
  }, [collection]);

  return (
    <CollectionContext.Provider value={{ collection, setCollection }}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
}
