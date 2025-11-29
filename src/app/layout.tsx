'use client';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { GoogleAds } from '@/components/analytics/google-ads';
import { useAdblockDetector } from '@/hooks/use-adblock-detector';
import AdblockDetectedPage from './adblock-detected/page';
import { InterstitialAdProvider } from '@/hooks/use-interstitial-ad';
import { InterstitialAd } from '@/components/analytics/interstitial-ad';
import Head from 'next/head';

// Metadata is now exported from a client component, which is not ideal for SEO.
// This is a tradeoff for the adblock detection logic residing in the root layout.
// A more advanced setup would involve a separate layout for the adblock page.
// export const metadata: Metadata = { ... };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adblockDetected = useAdblockDetector();

  // The 'suppressHydrationWarning' is used here because the 'adblockDetected'
  // value will cause a server-client mismatch. The server will always render
  // the app, but the client might render the adblock page. This is expected.
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>DocuPilot — Free Online PDF, Image & Document Tools (India)</title>
        <meta name="description" content="DocuPilot offers free online tools for PDF editing, image compression, converters, photo editing, passport photo creation, and more. Fast, secure, and perfect for India users." />
        <link rel="canonical" href="https://docupilot.app/" />
        <meta name="keywords" content="pdf tools india, image compressor india, online pdf editor, passport photo maker, photo to 50kb, convert pdf online, document tools india" />

        {/* Open Graph */}
        <meta property="og:title" content="DocuPilot — Free Online PDF, Image & Document Tools" />
        <meta property="og:description" content="Free tools for PDF, images, converters, and document editing. Fast & secure." />
        <meta property="og:url" content="https://docupilot.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DocuPilot — Free Online PDF & Image Tools" />
        <meta name="twitter:description" content="Fast and free PDF & image editing tools for India users." />
        <meta name="twitter:image" content="/twitter-image.png" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "DocuPilot",
          "url": "https://docupilot.app/"
        }
        `}} />

        <meta name="robots" content={adblockDetected ? "noindex, nofollow" : "index, follow"} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {!adblockDetected && <GoogleAnalytics />}
        {!adblockDetected && <GoogleAds />}
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {/* Bait element for adblock detection. It's visually hidden but should be in the DOM. */}
        <div id="ad-banner-bait" style={{ height: '1px', width: '1px', position: 'absolute', left: '-9999px', top: '-9999px' }} />

        {adblockDetected ? (
          <AdblockDetectedPage />
        ) : (
          <InterstitialAdProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
            <InterstitialAd />
          </InterstitialAdProvider>
        )}
      </body>
    </html>
  );
}
