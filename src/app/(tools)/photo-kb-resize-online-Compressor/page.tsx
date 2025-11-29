'use client';
import { ImageResize } from '@/components/dashboard/tools/image-resize';
import Head from 'next/head';

export default function Page() {
  const title = "Image Size Reducer Online (KB Compressor) — Free Photo Resizer India";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Resize image size in KB online for free. Compress photos for passport, online forms, exams, job portals, and government websites. Works for JPG, PNG, WebP." />
        <link rel="canonical" href="https://docupilot.app/photo-kb-resize-online-Compressor" />
        <meta name="keywords" content="image kb resize online, image size reducer india, photo compressor online, reduce image kb, passport photo resize" />
        <meta property="og:title" content="Image Size Reducer (KB Compressor)" />
        <meta property="og:description" content="Free online tool to reduce image size in KB for documents & forms." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Image Size Reducer",
          "url": "https://docupilot.app/photo-kb-resize-online-Compressor",
          "applicationCategory": "ImageProcessing"
        }
        `}} />
      </Head>
      <ImageResize onBack={() => {}} title={title} />
    </>
  );
}
