'use client';
import { DocxToPdf } from '@/components/dashboard/tools/docx-to-pdf';
import Head from 'next/head';

export default function Page() {
  const title = "Word to PDF Converter — DOC/DOCX to PDF Free";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Convert Word documents (DOC/DOCX) to PDF online for free. No watermark, no signup." />
        <link rel="canonical" href="https://docupilot.app/word-to-pdf-doc-convertor-online" />
        <meta name="keywords" content="word to pdf, doc to pdf, convert docx to pdf online" />
        <meta property="og:title" content="Word to PDF Converter" />
        <meta property="og:description" content="Convert Word documents to PDF online for free." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Word to PDF Converter",
          "url": "https://docupilot.app/word-to-pdf-doc-convertor-online",
          "applicationCategory": "DocumentConversion"
        }
        `}} />
      </Head>
      <DocxToPdf onBack={() => {}} title={title} />
    </>
  );
}
