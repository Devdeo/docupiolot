'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useInterstitialAd } from '@/hooks/use-interstitial-ad';
import { GoogleAdsense } from './google-adsense';

const COUNTDOWN_SECONDS = 5;

export function InterstitialAd() {
  const { isAdVisible, hideAd } = useInterstitialAd();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAdVisible) {
      setCountdown(COUNTDOWN_SECONDS);
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAdVisible]);
  
  useEffect(() => {
    if (isAdVisible && countdown === 0) {
      hideAd(true);
    }
  }, [isAdVisible, countdown, hideAd]);

  return (
    <AnimatePresence>
      {isAdVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl bg-card border rounded-xl shadow-2xl flex flex-col items-center p-6 text-center"
          >
            <h2 className="text-xl font-bold text-foreground">
              Preparing Your Download
            </h2>
            <p className="text-muted-foreground mt-2 mb-6">
              Your download will begin automatically after this short message from our sponsors.
            </p>
            
            <div className="w-full md:min-h-[400px] min-h-[250px] flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                <GoogleAdsense />
            </div>
            
            <div className="mt-6 flex items-center gap-3 text-lg font-medium text-primary">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Your download will start in {countdown} second(s)...</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
