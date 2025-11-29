'use client';
import { PassportPhotoMaker } from '@/components/dashboard/tools/passport-photo-maker';
import Head from 'next/head';

export default function Page() {
  const title = "Passport Size Photo Maker — Create 35x45mm Photos Online (India)";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Make passport-size photos for Aadhaar, PAN, Visa, and job forms. Auto crop, background removal, and size adjustment." />
        <link rel="canonical" href="https://docupilot.app/passport-size-photo-maker-online" />
        <meta name="keywords" content="passport photo maker india, 35x45 photo online, passport size editor" />
        <meta property="og:title" content="Passport Size Photo Maker" />
        <meta property="og:description" content="Create passport-size photos online for India forms." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Passport Size Photo Maker",
          "url": "https://docupilot.app/passport-size-photo-maker-online",
          "applicationCategory": "ImageProcessing"
        }
        `}} />
      </Head>
      <PassportPhotoMaker onBack={() => {}} title={title} />
    </>
  );
}
