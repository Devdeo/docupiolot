import {
  ArrowRightLeft,
  Combine,
  FilePenLine,
  FileText,
  Image as ImageIcon,
  Images,
  Scaling,
  User,
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
    id: 'pdf-resize',
    title: 'PDF Resizer',
    description: 'Change PDF dimensions and quality.',
    icon: FileText,
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image',
    description: 'Convert each page of a PDF into an image.',
    icon: Images,
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
    id: 'edit-pdf',
    title: 'Edit PDF',
    description: 'Make direct edits to your PDF files.',
    icon: FilePenLine,
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
