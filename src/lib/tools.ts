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
    description: 'Resize images, adjust DPI, and optimize for web or print with a single click.',
    icon: Scaling,
  },
  {
    id: 'image-editor',
    title: 'Image Editor',
    description: 'Apply filters, enhance colors, crop, rotate, and fine-tune your images effortlessly.',
    icon: Wand2,
  },
  {
    id: 'pdf-compress',
    title: 'PDF Compressor',
    description: 'Reduce PDF file size without losing clarity — perfect for email, uploads, and storage.',
    icon: Shrink,
  },
  {
    id: 'edit-pdf',
    title: 'PDF Editor',
    description: 'Edit PDF text, add images, highlight content, and make real-time corrections.',
    icon: FilePenLine,
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image Converter',
    description: 'Export PDF pages as high-quality JPG, PNG, or WEBP images.',
    icon: Images,
  },
  {
    id: 'add-images-to-pdf',
    title: 'Add Images to PDF',
    description: 'Merge photos and PDFs into a single, neatly organized document.',
    icon: FileImage,
  },
  {
    id: 'docx-to-pdf',
    title: 'Word to PDF Converter',
    description: 'Turn DOCX files into professional-grade PDFs instantly.',
    icon: FileText,
  },
  {
    id: 'excel-to-pdf',
    title: 'Excel to PDF Converter',
    description: 'Convert CSV and XLSX spreadsheets into clean, ready-to-share PDF files.',
    icon: FileSpreadsheet,
  },
  {
    id: 'ppt-to-pdf',
    title: 'PowerPoint to PDF Converter',
    description: 'Transform presentations into polished PDF documents.',
    icon: Presentation,
  },
  {
    id: 'psd-to-pdf',
    title: 'PSD to PDF Converter',
    description: 'Export Photoshop (PSD) files as high-resolution PDFs.',
    icon: FileImage,
  },
  {
    id: 'organize-pdf-pages',
    title: 'PDF Page Organizer',
    description: 'Rearrange, rotate, delete, or reorder PDF pages with ease.',
    icon: LayoutGrid,
  },
  /* **Add page numbers, watermarks, or branding to your PDF documents.** */
  {
    id: 'pdf-stamper',
    title: 'PDF Stamper',
    description: 'Add page numbers, watermarks, or branding to your PDF documents.',
    icon: Stamp,
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word Converter',
    description: 'Convert any PDF into a fully editable Word document.',
    icon: FileText,
  },
  {
    id: 'passport-photo',
    title: 'Passport Photo Maker',
    description: 'Create accurate passport-size photos with automatic background cleanup and sizing.',
    icon: User,
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    description: 'Convert images to JPG, PNG, WEBP, HEIC, and more.',
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
  'organize-pdf-pages': '/organize-pdf-pages',
  'pdf-stamper': '/pdf-numbering-watermark-online',
  'pdf-to-word': '/pdf-to-word-convertor-online',
  'passport-photo': '/passport-size-photo-maker-online',
  'image-converter': '/image-converter-online-png-jpg-webm',
};
