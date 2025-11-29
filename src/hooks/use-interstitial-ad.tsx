'use client';

import { useState, createContext, useContext, useCallback, ReactNode } from 'react';

interface InterstitialAdContextType {
  isAdVisible: boolean;
  adData: any | null;
  showAd: (data?: any) => Promise<void>;
  hideAd: (resolved: boolean) => void;
}

const InterstitialAdContext = createContext<InterstitialAdContextType | undefined>(undefined);

export function InterstitialAdProvider({ children }: { children: ReactNode }) {
  const [isAdVisible, setIsAdVisible] = useState(false);
  const [adData, setAdData] = useState<any | null>(null);
  const [resolvePromise, setResolvePromise] = useState<(() => void) | null>(null);

  const showAd = useCallback((data?: any) => {
    setAdData(data || null);
    setIsAdVisible(true);
    return new Promise<void>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const hideAd = useCallback((resolved: boolean) => {
    if (resolved && resolvePromise) {
      resolvePromise();
    }
    setIsAdVisible(false);
    setAdData(null);
    setResolvePromise(null);
  }, [resolvePromise]);

  return (
    <InterstitialAdContext.Provider value={{ isAdVisible, adData, showAd, hideAd }}>
      {children}
    </InterstitialAdContext.Provider>
  );
}

export function useInterstitialAd() {
  const context = useContext(InterstitialAdContext);
  if (context === undefined) {
    throw new Error('useInterstitialAd must be used within a InterstitialAdProvider');
  }
  return context;
}
