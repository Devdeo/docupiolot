'use client';
import { PdfCompress } from '@/components/dashboard/tools/pdf-compress';
import Head from 'next/head';

export default function Page() {
  const title = "PDF Compressor Online — Reduce PDF Size in KB Free (India)";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Compress PDF size online to 100kb, 200kb, or 500kb for free. Perfect for college admissions, job forms, government portals, and email uploads." />
        <link rel="canonical" href="https://docupilot.app/pdf-kb-resize-online-pdf-Compressor" />
        <meta name="keywords" content="pdf compressor india, reduce pdf size online, pdf 100kb, compress pdf for online forms" />
        <meta property="og:title" content="PDF Compressor Online" />
        <meta property="og:description" content="Reduce PDF file size to KB quickly and for free." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF Compressor",
          "url": "https://docupilot.app/pdf-kb-resize-online-pdf-Compressor",
          "applicationCategory": "PDFUtility"
        }
        `}} />
      </Head>
      <PdfCompress onBack={() => {}} title={title} />
    </>
  );
}
