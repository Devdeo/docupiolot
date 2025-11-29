'use client';

import { useState, useEffect } from 'react';

// This is a more robust adblock detector that uses two common methods:
// 1. Network Request Bait: Tries to fetch a file that is commonly blocked.
// 2. DOM Element Bait: Checks if a "bait" DOM element has been hidden or modified.

export function useAdblockDetector() {
  const [adblockDetected, setAdblockDetected] = useState(false);

  useEffect(() => {
    // This check should only run on the client
    if (typeof window === 'undefined') {
      return;
    }
    
    let isCancelled = false;

    // The ID of the bait element that will be added to the DOM.
    const baitElementId = 'ad-banner-bait';

    async function checkAdBlock() {
      // --- 1. Network Request Check ---
      try {
        // The bait URL. This file should be in the /public directory.
        // Ad blockers will likely block a request to a file named 'ads.js'.
        const baitUrl = new URL('/ads.js', window.location.origin).toString();
        
        // We use `Request` with `cache: 'reload'` to ensure we aren't getting a cached result.
        await fetch(new Request(baitUrl, { cache: 'reload' }));
        
        // If the fetch succeeds, we move to the DOM check.
      } catch (error) {
        // If the fetch fails, it's very likely an ad blocker is at work.
        if (!isCancelled) {
          setAdblockDetected(true);
        }
        console.warn('Adblock detected via network request failure.', error);
        return; // An adblocker is found, no need to proceed.
      }

      // --- 2. DOM Element Check ---
      // This check runs after a short delay to give ad blockers time to act.
      setTimeout(() => {
        if (isCancelled) return;

        const baitElement = document.getElementById(baitElementId);
        
        // If the bait element is missing, or if its offsetHeight is 0 (meaning it's hidden),
        // we can be confident an ad blocker is active.
        if (!baitElement || baitElement.offsetHeight === 0) {
          if (!isCancelled) {
            setAdblockDetected(true);
          }
          console.warn('Adblock detected via DOM element modification.');
          return;
        }

        // If both checks pass, we assume no ad blocker is active.
        if (!isCancelled) {
          setAdblockDetected(false);
        }

      }, 100);
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
