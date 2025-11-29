'use client';
import { PsdToPdf } from '@/components/dashboard/tools/psd-to-pdf';
import Head from 'next/head';

export default function Page() {
  const title = "PSD to PDF Converter — Photoshop File to PDF Online";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Convert Photoshop PSD files into PDF format online without software. Works on mobile & desktop." />
        <link rel="canonical" href="https://docupilot.app/psd-to-pdf-photoshop-pdf-online" />
        <meta name="keywords" content="psd to pdf, photoshop to pdf, convert psd online" />
        <meta property="og:title" content="PSD to PDF Converter" />
        <meta property="og:description" content="Convert PSD files to PDF instantly online." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PSD to PDF Converter",
          "url": "https://docupilot.app/psd-to-pdf-photoshop-pdf-online",
          "applicationCategory": "ImageProcessing"
        }
        `}} />
      </Head>
      <PsdToPdf onBack={() => {}} title={title} />
    </>
  );
}
