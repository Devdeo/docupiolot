import {
  ArrowRightLeft,
  Combine,
  FileImage,
  FilePenLine,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Images,
  Presentation,
  Scaling,
  User,
  Shrink,
  FileMinus,
  LayoutGrid,
  Stamp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Tool = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const tools: Tool[] = [
  {
    id: 'image-resize',
    title: 'Image Resizer',
    description: 'Adjust image size and DPI with ease.',
    icon: Scaling,
  },
  {
    id: 'pdf-compress',
    title: 'PDF Compressor',
    description: 'Reduce PDF file size while optimizing for quality.',
    icon: Shrink,
  },
  {
    id: 'edit-pdf',
    title: 'Edit PDF',
    description: 'Make direct edits to your PDF files.',
    icon: FilePenLine,
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image',
    description: 'Convert each page of a PDF into an image.',
    icon: Images,
  },
  {
    id: 'add-images-to-pdf',
    title: 'Add Images to PDF',
    description: 'Combine images and PDFs into a single file.',
    icon: FileImage,
  },
  {
    id: 'docx-to-pdf',
    title: 'Word to PDF',
    description: 'Convert DOCX files to PDF documents.',
    icon: FileText,
  },
  {
    id: 'excel-to-pdf',
    title: 'Excel to PDF',
    description: 'Convert CSV and XLSX files to PDF.',
    icon: FileSpreadsheet,
  },
  {
    id: 'ppt-to-pdf',
    title: 'PowerPoint to PDF',
    description: 'Convert PPTX files to PDF documents.',
    icon: Presentation,
  },
  {
    id: 'psd-to-pdf',
    title: 'PSD to PDF',
    description: 'Convert Photoshop files to PDF.',
    icon: FileImage,
  },
  {
    id: 'organize-pdf-pages',
    title: 'Organize PDF Pages',
    description: 'Reorder, rotate, and delete pages from a PDF.',
    icon: LayoutGrid,
  },
  {
    id: 'pdf-stamper',
    title: 'PDF Stamper',
    description: 'Add page numbers and watermarks to your PDF.',
    icon: Stamp,
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF files to editable DOCX documents.',
    icon: FileText,
  },
  {
    id: 'convert-from-pdf',
    title: 'Convert from PDF',
    description: 'Turn PDFs into JPG, DOCX, XLS, and more.',
    icon: ArrowRightLeft,
  },
  {
    id: 'convert-to-pdf',
    title: 'Convert to PDF',
    description: 'Convert DOCX, PPT, PSD, and others to PDF.',
    icon: Combine,
  },
  {
    id: 'merge-organize-pdf',
    title: 'Merge & Organize PDF',
    description: 'Combine PDFs, delete pages, or add images.',
    icon: Combine,
  },
  {
    id: 'passport-photo',
    title: 'Passport Photo Maker',
    description: 'Create perfect passport photos from any image.',
    icon: User,
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    description: 'Convert images to various formats like PNG, WEBP, etc.',
    icon: ImageIcon,
  },
];
