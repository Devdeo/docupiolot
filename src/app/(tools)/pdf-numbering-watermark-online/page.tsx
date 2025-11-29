'use client';
import { PdfStamper } from '@/components/dashboard/tools/pdf-stamper';

export default function Page() {
  return <PdfStamper onBack={() => {}} title="PDF Stamper" />;
}
