'use client';

import { useState, useEffect } from 'react';

// This is a more robust adblock detector that uses multiple common methods:
// 1. Network Request Bait (Local): Tries to fetch a local file that is commonly blocked.
// 2. Network Request Bait (Remote): Tries to fetch a resource from a known ad domain.
// 3. DOM Element Bait: Checks if a "bait" DOM element has been hidden or modified.

export function useAdblockDetector() {
  const [adblockDetected, setAdblockDetected] = useState(false);

  useEffect(() => {
    // This check should only run on the client
    if (typeof window === 'undefined') {
      return;
    }
    
    let isCancelled = false;

    const baitElementId = 'ad-banner-bait';
    const localBaitUrl = new URL('/ads.js', window.location.origin).toString();
    // A 1x1 pixel tracker from a major ad network. Very likely to be blocked.
    const remoteBaitUrl = 'https://googleads.g.doubleclick.net/pagead/viewthroughconversion/962940251/?backend=innocuous&val=1&allow_custom_scripts=true';


    async function checkAdBlock() {
      if (isCancelled) return;

      // --- Method 1: Remote Network Request Check ---
      try {
        await fetch(new Request(remoteBaitUrl, { mode: 'no-cors', cache: 'reload' }));
      } catch (error) {
        if (!isCancelled) setAdblockDetected(true);
        console.warn('Adblock detected via remote network request failure.');
        return;
      }

      // --- Method 2: Local Network Request Check ---
      try {
        await fetch(new Request(localBaitUrl, { cache: 'reload' }));
      } catch (error) {
        if (!isCancelled) setAdblockDetected(true);
        console.warn('Adblock detected via local network request failure.');
        return;
      }

      // --- Method 3: DOM Element Check (runs after a delay) ---
      setTimeout(() => {
        if (isCancelled) return;

        const baitElement = document.getElementById(baitElementId);
        
        if (!baitElement || baitElement.offsetHeight === 0 || window.getComputedStyle(baitElement).display === 'none') {
          if (!isCancelled) setAdblockDetected(true);
          console.warn('Adblock detected via DOM element modification.');
          return;
        }

        // If all checks pass, we assume no ad blocker is active for this cycle.
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
