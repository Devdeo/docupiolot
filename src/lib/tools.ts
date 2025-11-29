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
  Wand2,
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
    id: 'image-editor',
    title: 'Edit Image',
    description: 'Apply filters, adjustments, and rotate your images.',
    icon: Wand2,
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


export const toolRoutes: Record<string, string> = {
  'image-resize': '/photo-kb-resize-online-Compressor',
  'image-editor': '/photo-editor-online',
  'pdf-compress': '/pdf-kb-resize-online-pdf-Compressor',
  'edit-pdf': '/edit-pdf-online',
  'pdf-to-image': '/pdf-to-photo-image-online-jpg-jpeg',
  'add-images-to-pdf': '/image-to-pdf-online-jpg-to-pdf-merge-online',
  'docx-to-pdf': '/word-to-pdf-doc-convertor-online',
  'excel-to-pdf': '/excel-csv-to-pdf-convertor-online',
  'ppt-to-pdf': '/pptx-to-pdf-convertor-online',
  'psd-to-pdf': '/psd-to-pdf-photoshop-pdf-online',
  'organize-pdf-pages': '/organize-pdf-pages', // User did not provide this
  'pdf-stamper': '/pdf-numbering-watermark-online',
  'pdf-to-word': '/pdf-to-word-convertor-online',
  'passport-photo': '/passport-size-photo-maker-online',
  'image-converter': '/image-converter-online-png-jpg-webm',
};
