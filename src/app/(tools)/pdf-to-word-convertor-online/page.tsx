'use client';
import { PdfToWord } from '@/components/dashboard/tools/pdf-to-word';
import Head from 'next/head';

export default function Page() {
  const title = "PDF to Word Converter — Convert PDF to Editable DOC Free";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Convert PDF files to fully editable Word documents online. Preserve formatting. Free tool." />
        <link rel="canonical" href="https://docupilot.app/pdf-to-word-convertor-online" />
        <meta name="keywords" content="pdf to word, convert pdf to doc, editable pdf converter online" />
        <meta property="og:title" content="PDF to Word Converter" />
        <meta property="og:description" content="Convert PDFs to Word DOC files online." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF to Word Converter",
          "url": "https://docupilot.app/pdf-to-word-convertor-online",
          "applicationCategory": "DocumentConversion"
        }
        `}} />
      </Head>
      <PdfToWord onBack={() => {}} title={title} />
    </>
  );
}
