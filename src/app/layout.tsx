import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { GoogleAds } from '@/components/analytics/google-ads';

export const metadata: Metadata = {
  title: 'DocuPilot - Free & Private Document Processing Tools',
  description: 'Your all-in-one document processing assistant. Resize images, compress PDFs, convert documents, and more. All tools run in your browser for maximum privacy.',
  keywords: ['pdf tools', 'image resizer', 'document converter', 'compress pdf', 'edit pdf', 'passport photo'],
  openGraph: {
    title: 'DocuPilot - Free & Private Document Processing Tools',
    description: 'Resize, convert, and edit documents with professional-grade tools that respect your privacy.',
    type: 'website',
    url: 'https://docupilot.app', // Replace with your actual domain
    images: [
      {
        url: '/og-image.png', // You should create this image and place it in the /public folder
        width: 1200,
        height: 630,
        alt: 'DocuPilot - All-in-one Document Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocuPilot - Free & Private Document Processing Tools',
    description: 'Your all-in-one document processing assistant. All tools run securely in your browser.',
    images: ['/twitter-image.png'], // You should create this image and place it in the /public folder
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <GoogleAnalytics />
        <GoogleAds />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
