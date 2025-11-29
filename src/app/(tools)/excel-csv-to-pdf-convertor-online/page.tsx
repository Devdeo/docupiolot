'use client';
import { ExcelToPdf } from '@/components/dashboard/tools/excel-to-pdf';
import Head from 'next/head';

export default function Page() {
  const title = "Excel to PDF Converter — XLS/XLSX/CSV to PDF Free";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Convert Excel or CSV files into print-ready PDF online. Works for XLS, XLSX, and CSV formats." />
        <link rel="canonical" href="https://docupilot.app/excel-csv-to-pdf-convertor-online" />
        <meta name="keywords" content="excel to pdf, csv to pdf, convert spreadsheet to pdf" />
        <meta property="og:title" content="Excel to PDF Converter" />
        <meta property="og:description" content="Convert Excel/CSV files to PDF instantly online." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Excel to PDF Converter",
          "url": "https://docupilot.app/excel-csv-to-pdf-convertor-online",
          "applicationCategory": "DocumentConversion"
        }
        `}} />
      </Head>
      <ExcelToPdf onBack={() => {}} title={title} />
    </>
  );
}
