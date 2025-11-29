'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { tools as toolDefinitions, type Tool } from '@/lib/tools';
import { ToolGrid } from './tool-grid';
import { Logo } from '../logo';
import { ImageResize } from './tools/image-resize';
import { PdfCompress } from './tools/pdf-compress';
import { ConvertFromPdf } from './tools/convert-from-pdf';
import { ConvertToPdf } from './tools/convert-to-pdf';
import { MergeOrganizePdf } from './tools/merge-organize-pdf';
import { EditPdf } from './tools/edit-pdf';
import { PassportPhotoMaker } from './tools/passport-photo-maker';
import { ImageConverter } from './tools/image-converter';
import { PdfToImage } from './tools/pdf-to-image';
import { AddImagesToPdf } from './tools/add-images-to-pdf';
import { DocxToPdf } from './tools/docx-to-pdf';
import { ExcelToPdf } from './tools/excel-to-pdf';
import { PptToPdf } from './tools/ppt-to-pdf';
import { PsdToPdf } from './tools/psd-to-pdf';
import { PdfPageRemover } from './tools/pdf-page-remover';

type ToolWithComponent = Tool & {
  component: React.ComponentType<{ onBack: () => void; title: string }>;
};

const toolComponents: Record<
  string,
  React.ComponentType<{ onBack: () => void; title: string }>
> = {
  'image-resize': ImageResize,
  'pdf-compress': PdfCompress,
  'convert-from-pdf': ConvertFromPdf,
  'convert-to-pdf': ConvertToPdf,
  'merge-organize-pdf': MergeOrganizePdf,
  'edit-pdf': EditPdf,
  'passport-photo': PassportPhotoMaker,
  'image-converter': ImageConverter,
  'pdf-to-image': PdfToImage,
  'add-images-to-pdf': AddImagesToPdf,
  'docx-to-pdf': DocxToPdf,
  'excel-to-pdf': ExcelToPdf,
  'ppt-to-pdf': PptToPdf,
  'psd-to-pdf': PsdToPdf,
  'pdf-page-remover': PdfPageRemover,
};

const tools: ToolWithComponent[] = toolDefinitions.map((tool) => ({
  ...tool,
  component: toolComponents[tool.id],
}));

export function DocuPilotApp() {
  const [activeTool, setActiveTool] = useState<ToolWithComponent | null>(null);

  const handleToolSelect = (tool: Tool) => {
    const selectedTool = tools.find((t) => t.id === tool.id);
    if (selectedTool) {
      setActiveTool(selectedTool);
    }
  };

  const handleBack = () => {
    setActiveTool(null);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <AnimatePresence mode="wait">
        {activeTool ? (
          <motion.div
            key={activeTool.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <activeTool.component onBack={handleBack} title={activeTool.title} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <header className="py-12 md:py-16">
              <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Logo />
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">
                    DocuPilot
                  </h1>
                </div>
                <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
                  Your all-in-one document processing assistant. Resize, convert, and edit with professional-grade tools.
                </p>
              </div>
            </header>
            <main className="container mx-auto px-4 pb-16">
              <ToolGrid tools={tools} onToolSelect={handleToolSelect} />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
