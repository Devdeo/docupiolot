'use client';
import { PdfPageRemover } from '@/components/dashboard/tools/pdf-page-remover';
import Head from 'next/head';

export default function Page() {
  const title = "Organize PDF Pages Online India – Reorder, Rotate, Split & Delete PDF Pages Free";
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PdfPageRemover onBack={() => {}} title={title} />
    </>
  );
}
