'use client';
import { ImageConverter } from '@/components/dashboard/tools/image-converter';
import Head from 'next/head';

export default function Page() {
  const title = "Image Converter Online — Convert PNG, JPG, JPEG, WebP Free";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Convert images between PNG, JPG, JPEG, and WebP instantly online. Free and fast tool for all users." />
        <link rel="canonical" href="https://docupilot.app/image-converter-online-png-jpg-webm" />
        <meta name="keywords" content="image converter, jpg to png, png to jpg, webp converter online" />
        <meta property="og:title" content="Image Converter Online" />
        <meta property="og:description" content="Convert PNG, JPG, JPEG, WebP images online for free." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Image Converter",
          "url": "https://docupilot.app/image-converter-online-png-jpg-webm",
          "applicationCategory": "ImageProcessing"
        }
        `}} />
      </Head>
      <ImageConverter onBack={() => {}} title={title} />
    </>
  );
}
