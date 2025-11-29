'use client';
import { PptToPdf } from '@/components/dashboard/tools/ppt-to-pdf';
import Head from 'next/head';

export default function Page() {
  const title = "PowerPoint to PDF Converter — PPT/PPTX to PDF Free";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Convert PowerPoint presentations into PDF format online for free. Maintain formatting and quality." />
        <link rel="canonical" href="https://docupilot.app/pptx-to-pdf-convertor-online" />
        <meta name="keywords" content="ppt to pdf, pptx to pdf online, convert powerpoint to pdf" />
        <meta property="og:title" content="PowerPoint to PDF Converter" />
        <meta property="og:description" content="Convert PPT/PPTX to PDF online for free." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PowerPoint to PDF Converter",
          "url": "https://docupilot.app/pptx-to-pdf-convertor-online",
          "applicationCategory": "DocumentConversion"
        }
        `}} />
      </Head>
      <PptToPdf onBack={() => {}} title={title} />
    </>
  );
}
