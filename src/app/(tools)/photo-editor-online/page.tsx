'use client';
import { ImageEditor } from '@/components/dashboard/tools/image-editor';
import Head from 'next/head';

export default function Page() {
  const title = "Online Photo Editor — Crop, Rotate, Enhance Images Free";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Free online photo editor for cropping, resizing, filters, color correction, and enhancements. Works on mobile and desktop without downloading software." />
        <link rel="canonical" href="https://docupilot.app/photo-editor-online" />
        <meta name="keywords" content="photo editor online, crop image online, image editing tool, free image editor, online photoshop alternative" />
        <meta property="og:title" content="Free Online Photo Editor" />
        <meta property="og:description" content="Edit photos online — crop, resize, enhance, and filter images easily." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Online Photo Editor",
          "url": "https://docupilot.app/photo-editor-online",
          "applicationCategory": "ImageEditing"
        }
        `}} />
      </Head>
      <ImageEditor onBack={() => {}} title={title} />
    </>
  );
}
