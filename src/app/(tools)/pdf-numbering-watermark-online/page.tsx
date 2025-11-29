'use client';
import { PdfStamper } from '@/components/dashboard/tools/pdf-stamper';
import Head from 'next/head';

export default function Page() {
  const title = "PDF Numbering & Watermark Tool — Add Page Numbers or Watermarks";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Add page numbers or watermark text to your PDF online for free. Fast, easy, and secure." />
        <link rel="canonical" href="https://docupilot.app/pdf-numbering-watermark-online" />
        <meta name="keywords" content="add page numbers to pdf, pdf watermark online, number pdf pages" />
        <meta property="og:title" content="PDF Numbering & Watermark Tool" />
        <meta property="og:description" content="Add numbering or watermark to PDFs online." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF Numbering & Watermark Tool",
          "url": "https://docupilot.app/pdf-numbering-watermark-online",
          "applicationCategory": "PDFUtility"
        }
        `}} />
      </Head>
      <PdfStamper onBack={() => {}} title={title} />
    </>
  );
}
