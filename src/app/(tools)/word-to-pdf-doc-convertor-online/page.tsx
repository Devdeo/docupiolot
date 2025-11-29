'use client';
import { DocxToPdf } from '@/components/dashboard/tools/docx-to-pdf';

export default function Page() {
  return <DocxToPdf onBack={() => {}} title="Word to PDF" />;
}
