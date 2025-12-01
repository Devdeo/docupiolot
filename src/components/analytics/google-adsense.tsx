'use client';

import { useEffect, useRef } from 'react';

const GA_ADSENSE_ID = 'ca-pub-5651978142792714';

export function GoogleAdsense() {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    if (isAdLoaded.current) return;
    
    try {
      // @ts-ignore
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      }
    } catch (err) {
      console.error('Failed to push to adsbygoogle:', err);
    }
  }, []);

  return (
    <div ref={adRef} className="ad-container my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '100px' }}
        data-ad-client={GA_ADSENSE_ID}
        data-ad-format="autorelaxed"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
