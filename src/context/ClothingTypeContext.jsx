import { createContext, useContext, useState, useEffect } from 'react';

const ClothingTypeContext = createContext();

export function ClothingTypeProvider({ children }) {
  // Read from localStorage or default to 'TSHIRTS'
  const [clothingType, setClothingType] = useState(() => {
    return localStorage.getItem('stylehub_clothing_type') || 'TSHIRTS';
  });

  useEffect(() => {
    localStorage.setItem('stylehub_clothing_type', clothingType);
  }, [clothingType]);

  return (
    <ClothingTypeContext.Provider value={{ clothingType, setClothingType }}>
      {children}
    </ClothingTypeContext.Provider>
  );
}

export function useClothingType() {
  const context = useContext(ClothingTypeContext);
  if (!context) {
    throw new Error('useClothingType must be used within a ClothingTypeProvider');
  }
  return context;
}
