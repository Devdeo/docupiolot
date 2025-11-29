'use client';
import { EditPdf } from '@/components/dashboard/tools/edit-pdf';
import Head from 'next/head';

export default function Page() {
  const title = "Edit PDF Online — Add Text, Images, Signatures Free";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Edit PDF documents online for free. Add text, images, signatures, stamps, pages, and annotations without installing software." />
        <link rel="canonical" href="https://docupilot.app/edit-pdf-online" />
        <meta name="keywords" content="edit pdf online, add text to pdf, free pdf editor, online pdf annotator" />

        <meta property="og:title" content="Edit PDF Online" />
        <meta property="og:description" content="Free and simple online tool to edit PDF files." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Edit PDF Online",
          "url": "https://docupilot.app/edit-pdf-online",
          "applicationCategory": "PDFUtility"
        }
        `}} />
      </Head>
      <EditPdf onBack={() => {}} title={title} />
    </>
  );
}
