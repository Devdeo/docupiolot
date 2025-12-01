'use client';
import './globals.css';
import Script from 'next/script';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useAdblockDetector } from '@/hooks/use-adblock-detector';
import AdblockDetectedPage from './adblock-detected/page';
import { InterstitialAdProvider } from '@/hooks/use-interstitial-ad';
import { InterstitialAd } from '@/components/analytics/interstitial-ad';
import { InstallPrompt } from '@/components/analytics/install-prompt';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adblockDetected = useAdblockDetector();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>DocuPilot — Free Online PDF, Image & Document Tools | docupilot.co.in</title>
        <meta name="description" content="DocuPilot offers free online tools for PDF editing, image compression, converters, photo editing, passport photo creation, and more. Fast, secure, and perfect for India users. Visit docupilot.co.in" />
        <link rel="canonical" href="https://docupilot.co.in/" />
        <meta name="keywords" content="pdf tools india, image compressor india, online pdf editor, passport photo maker, photo to 50kb, convert pdf online, document tools india, docupilot, free pdf tools, pdf converter online, image to pdf, pdf to word" />
        <meta name="google-adsense-account" content="ca-pub-5651978142792714" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="apple-mobile-web-app-title" content="DocuPilot" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect fill='%233b82f6' width='180' height='180'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='90' font-weight='bold' fill='white' font-family='system-ui'>D</text></svg>" />

        <meta property="og:title" content="DocuPilot — Free Online PDF, Image & Document Tools | docupilot.co.in" />
        <meta property="og:description" content="Free tools for PDF, images, converters, and document editing. Fast, secure & 100% private. All processing happens in your browser." />
        <meta property="og:url" content="https://docupilot.co.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="DocuPilot" />
        <meta property="og:image" content="https://docupilot.co.in/og-image.png" />
        <meta property="og:locale" content="en_IN" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DocuPilot — Free Online PDF & Image Tools" />
        <meta name="twitter:description" content="Fast and free PDF & image editing tools. 100% private - files never leave your browser." />
        <meta name="twitter:image" content="https://docupilot.co.in/twitter-image.png" />
        <meta name="twitter:site" content="@docupilot" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "DocuPilot",
          "url": "https://docupilot.co.in/",
          "description": "Free online PDF, image and document processing tools. All processing happens in your browser for 100% privacy.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://docupilot.co.in/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
        `}} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "DocuPilot",
          "url": "https://docupilot.co.in/",
          "logo": "https://docupilot.co.in/logo.png",
          "sameAs": []
        }
        `}} />

        <meta name="robots" content={adblockDetected ? "noindex, nofollow" : "index, follow"} />
        <meta name="author" content="DocuPilot" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5651978142792714"
          crossOrigin="anonymous"
        />

        <script 
          async 
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        />

        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MFJSNB9T');`}
        </Script>
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-MFJSNB9T"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <div id="ad-banner-bait" style={{ height: '1px', width: '1px', position: 'absolute', left: '-9999px', top: '-9999px' }} />

        <amp-auto-ads type="adsense" data-ad-client="ca-pub-5651978142792714" />


        {adblockDetected ? (
          <AdblockDetectedPage />
        ) : (
          <InterstitialAdProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
            <InterstitialAd />
            <InstallPrompt />
          </InterstitialAdProvider>
        )}
      </body>
    </html>
  );
}
