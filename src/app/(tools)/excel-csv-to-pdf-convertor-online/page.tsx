'use client';
import { ExcelToPdf } from '@/components/dashboard/tools/excel-to-pdf';

export default function Page() {
  return <ExcelToPdf onBack={() => {}} title="Excel to PDF" />;
}
