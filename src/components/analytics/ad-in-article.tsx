'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const GA_ADSENSE_ID = 'ca-pub-5651978142792714';
const AD_SLOT = '7767084035';

export function AdInArticle() {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);
  const [hasAd, setHasAd] = useState(false);

  useEffect(() => {
    if (isAdLoaded.current) return;
    
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      }
    } catch (err) {
      console.error('Failed to push to adsbygoogle:', err);
    }
  }, []);

  useEffect(() => {
    if (!adRef.current) return;

    const observer = new MutationObserver(() => {
      if (adRef.current) {
        const hasContent = adRef.current.getAttribute('data-ad-status') === 'filled' ||
                          adRef.current.innerHTML.trim().length > 0 ||
                          adRef.current.querySelector('iframe') !== null;
        setHasAd(hasContent);
      }
    });

    observer.observe(adRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-ad-status']
    });

    const timer = setTimeout(() => {
      if (adRef.current) {
        const hasContent = adRef.current.getAttribute('data-ad-status') === 'filled' ||
                          adRef.current.innerHTML.trim().length > 0 ||
                          adRef.current.querySelector('iframe') !== null;
        setHasAd(hasContent);
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{
        display: hasAd ? 'block' : 'none',
        textAlign: 'center',
        minHeight: hasAd ? 'auto' : '0',
        overflow: 'hidden'
      }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client={GA_ADSENSE_ID}
      data-ad-slot={AD_SLOT}
    ></ins>
  );
}
