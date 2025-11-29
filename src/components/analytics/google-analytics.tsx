'use client';

import Script from 'next/script';

// IMPORTANT: Replace with your own Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.warn('Google Analytics is not configured. Please add your Measurement ID.');
    return null;
  }
  
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
