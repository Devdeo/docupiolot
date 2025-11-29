'use client';
import { AddImagesToPdf } from '@/components/dashboard/tools/add-images-to-pdf';
import Head from 'next/head';

export default function Page() {
  const title = "Image to PDF Converter — Merge JPG & PNG to PDF Online";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Convert and merge multiple images into a single PDF. Supports JPG, PNG, WebP. Fast and easy-to-use." />
        <link rel="canonical" href="https://docupilot.app/image-to-pdf-online-jpg-to-pdf-merge-online" />
        <meta name="keywords" content="image to pdf, jpg to pdf online, merge images to pdf" />
        <meta property="og:title" content="Image to PDF Converter" />
        <meta property="og:description" content="Merge JPG/PNG into a single PDF online for free." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Image to PDF Converter",
          "url": "https://docupilot.app/image-to-pdf-online-jpg-to-pdf-merge-online",
          "applicationCategory": "PDFUtility"
        }
        `}} />
      </Head>
      <AddImagesToPdf onBack={() => {}} title={title} />
    </>
  );
}
