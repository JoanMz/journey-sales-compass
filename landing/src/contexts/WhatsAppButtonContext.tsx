
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface WhatsAppButtonContextProps {
  isHeroButtonVisible: boolean;
  setIsHeroButtonVisible: (isVisible: boolean) => void;
}

const WhatsAppButtonContext = createContext<WhatsAppButtonContextProps | undefined>(undefined);

export const WhatsAppButtonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHeroButtonVisible, setIsHeroButtonVisible] = useState(false);

  return (
    <WhatsAppButtonContext.Provider value={{ isHeroButtonVisible, setIsHeroButtonVisible }}>
      {children}
    </WhatsAppButtonContext.Provider>
  );
};

export const useWhatsAppButton = () => {
  const context = useContext(WhatsAppButtonContext);
  if (context === undefined) {
    throw new Error('useWhatsAppButton must be used within a WhatsAppButtonProvider');
  }
  return context;
};
