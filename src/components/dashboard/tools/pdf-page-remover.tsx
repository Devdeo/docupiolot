'use client';
import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import Image from 'next/image';

interface ToolProps {
  onBack: () => void;
  title: string;
}

interface PagePreview {
  id: string;
  pageNumber: number;
  previewUrl: string;
}

export function PdfPageRemover({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Clean up object URLs when the component unmounts or file changes
    return () => {
      pages.forEach(page => URL.revokeObjectURL(page.previewUrl));
    };
  }, [pages]);

  const handleFileSelect = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoadingPdf(true);
    setPages([]);
    
    try {
      const pdfjs = await import('pdfjs-dist/build/pdf');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

      const pdfData = await selectedFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
      const pageCount = pdf.numPages;
      const pagePreviews: PagePreview[] = [];

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not create canvas context");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
        if (blob) {
            pagePreviews.push({
                id: `page-${i}`,
                pageNumber: i,
                previewUrl: URL.createObjectURL(blob),
            });
        }
      }
      setPages(pagePreviews);
      await pdf.destroy();
      
    } catch(error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Could not load PDF previews.";
        toast({
            variant: 'destructive',
            title: 'Error Loading PDF',
            description: errorMessage
        });
        setFile(null);
    } finally {
        setIsLoadingPdf(false);
    }
  }, [toast]);

  const handleClear = () => {
    setFile(null);
    setPages([]);
    setIsProcessing(false);
    setIsLoadingPdf(false);
  };
  
  const handleRemovePage = (id: string) => {
    setPages(currentPages => currentPages.filter(p => p.id !== id));
  }

  const handleSaveAndDownload = async () => {
    if (!file || pages.length === 0) {
      toast({ variant: 'destructive', title: 'No pages to save.' });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Processing PDF', description: 'Re-organizing your PDF...' });

    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const newPdfDoc = await PDFDocument.create();

      const originalPageIndices = pages.map(p => p.pageNumber - 1);
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, originalPageIndices);
      
      copiedPages.forEach(page => {
        newPdfDoc.addPage(page);
      });

      const pdfBytes = await newPdfDoc.save();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const originalName = file.name.replace(/\.pdf$/i, '') || 'document';
      link.download = `${originalName}-organized.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
        title: 'PDF Saved Successfully',
        description: `Your new PDF with ${pages.length} page(s) has been downloaded.`,
      });
      handleClear();
      
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Organize PDF Pages</CardTitle>
          <CardDescription>Drag and drop to reorder pages, or use the bin icon to delete them.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['application/pdf']} />
          ) : isLoadingPdf ? (
             <div className="flex flex-col items-center justify-center p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="font-medium">Loading PDF Previews...</p>
                <p className="text-sm text-muted-foreground">Please wait while the pages are being rendered.</p>
             </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pages ({pages.length}) - Drag to reorder
              </h3>
              <Reorder.Group
                axis="y"
                values={pages}
                onReorder={setPages}
                className="space-y-2"
              >
                <AnimatePresence>
                  {pages.map((page) => (
                    <Reorder.Item
                      key={page.id}
                      value={page}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                      className="relative group p-2 border rounded-md bg-muted/50 flex items-center gap-4"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <div className="relative w-24 h-32 aspect-[2/3] bg-white border">
                        <Image
                          src={page.previewUrl}
                          alt={`Page ${page.pageNumber}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="font-medium text-sm">
                        Page {page.pageNumber}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemovePage(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {pages.length > 0 && (
            <Button className="w-full" size="lg" disabled={isProcessing} onClick={handleSaveAndDownload}>
              {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save & Download PDF'}
            </Button>
          )}
          {file && (
            <Button variant="outline" className="w-full" onClick={handleClear} disabled={isProcessing}>
              Start Over
            </Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
