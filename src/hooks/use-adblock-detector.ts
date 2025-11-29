'use client';

import { useState, useEffect } from 'react';

export function useAdblockDetector() {
  const [adblockDetected, setAdblockDetected] = useState(false);

  useEffect(() => {
    // This check should only run on the client
    if (typeof window === 'undefined') {
      return;
    }
    
    let isCancelled = false;

    async function checkAdBlock() {
      try {
        // The bait URL. This file should be created in the /public directory.
        // Ad blockers will likely block a request to a file named 'ads.js'.
        const baitUrl = new URL('/ads.js', window.location.origin).toString();
        
        // We use `Request` with `cache: 'reload'` to ensure we aren't getting a cached result.
        await fetch(new Request(baitUrl, { cache: 'reload' }));

        // If the fetch succeeds, no ad blocker is active (or it's not blocking our bait).
        if (!isCancelled) {
            setAdblockDetected(false);
        }
      } catch (error) {
        // If the fetch fails, it's very likely an ad blocker is at work.
        if (!isCancelled) {
            setAdblockDetected(true);
        }
        console.warn('Adblock detected or network error.', error);
      }
    }
    
    // We run the check on an interval to detect if the user enables/disables the adblocker
    // while on the site.
    const intervalId = setInterval(checkAdBlock, 3000);
    
    // Initial check
    checkAdBlock();

    // Cleanup function
    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return adblockDetected;
}
