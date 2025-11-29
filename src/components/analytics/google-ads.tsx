'use client';

import Script from 'next/script';

// IMPORTANT: Replace with your own Google Ads Conversion ID
const AW_CONVERSION_ID = 'AW-YYYYYYYYY';

export function GoogleAds() {
  if (!AW_CONVERSION_ID || AW_CONVERSION_ID === 'AW-YYYYYYYYY') {
    console.warn('Google Ads is not configured. Please add your Conversion ID.');
    return null;
  }

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${AW_CONVERSION_ID}`}
      strategy="afterInteractive"
    />
  );
}
