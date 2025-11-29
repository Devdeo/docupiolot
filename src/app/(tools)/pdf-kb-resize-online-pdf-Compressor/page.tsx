'use client';
import { PdfCompress } from '@/components/dashboard/tools/pdf-compress';

export default function Page() {
  return <PdfCompress onBack={() => {}} title="PDF Compressor" />;
}
