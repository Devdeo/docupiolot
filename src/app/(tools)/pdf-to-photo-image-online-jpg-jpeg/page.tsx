'use client';
import { PdfToImage } from '@/components/dashboard/tools/pdf-to-image';
import Head from 'next/head';

export default function Page() {
  const title = "PDF to JPG Converter Online — Convert PDF Pages to Images Free";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Convert PDF pages into high-quality JPG/JPEG images. Fast, free, and mobile-friendly." />
        <link rel="canonical" href="https://docupilot.app/pdf-to-photo-image-online-jpg-jpeg" />
        <meta name="keywords" content="pdf to jpg online, pdf to image converter, convert pdf to jpeg" />
        <meta property="og:title" content="PDF to Image Converter" />
        <meta property="og:description" content="Convert PDF pages to JPG/JPEG instantly online." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF to Image Converter",
          "url": "https://docupilot.app/pdf-to-photo-image-online-jpg-jpeg",
          "applicationCategory": "PDFUtility"
        }
        `}} />
      </Head>
      <PdfToImage onBack={() => {}} title={title} />
    </>
  );
}
