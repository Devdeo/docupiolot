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
        <title>DocuPilot - Free & Private Document Processing Tools</title>
        <meta
            name="description"
            content="Your all-in-one document processing assistant. Resize images, compress PDFs, convert documents, and more. All tools run in your browser for maximum privacy."
        />
        <meta name="keywords" content="pdf tools, image resizer, document converter, compress pdf, edit pdf, passport photo" />
        <meta property="og:title" content="DocuPilot - Free & Private Document Processing Tools" />
        <meta property="og:description" content="Resize, convert, and edit documents with professional-grade tools that respect your privacy." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://docupilot.app" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DocuPilot - Free & Private Document Processing Tools" />
        <meta name="twitter:description" content="Your all-in-one document processing assistant. All tools run securely in your browser." />
        <meta name="twitter:image" content="/twitter-image.png" />
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
