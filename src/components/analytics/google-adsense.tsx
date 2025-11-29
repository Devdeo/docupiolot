'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// IMPORTANT: Replace with your own Google Adsense Publisher ID
const GA_ADSENSE_ID = 'ca-pub-XXXXXXXXXXXXXXXX';

// IMPORTANT: Replace with your own Ad Slot ID
const AD_SLOT_ID = 'YYYYYYYYYY';

export function GoogleAdsense() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Failed to push to adsbygoogle:', err);
    }
  }, []);

  if (process.env.NODE_ENV !== 'production' || !GA_ADSENSE_ID || GA_ADSENSE_ID === 'ca-pub-XXXXXXXXXXXXXXXX') {
    if (GA_ADSENSE_ID === 'ca-pub-XXXXXXXXXXXXXXXX') {
        console.warn('Google Adsense is not configured. Please add your Publisher ID.');
    }
    return (
      <div className="flex items-center justify-center h-24 bg-muted rounded-lg text-muted-foreground text-sm">
        Advertisement
      </div>
    );
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GA_ADSENSE_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={GA_ADSENSE_ID}
        data-ad-slot={AD_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </>
  );
}
