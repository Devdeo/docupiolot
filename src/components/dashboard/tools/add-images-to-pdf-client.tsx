'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Loader2, Trash2, GripVertical, File as FileIcon } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ToolProps {
  onBack: () => void;
  title: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

export default function AddImagesToPdfClient({ onBack, title }: ToolProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const generatePreviews = useCallback(async (file: File): Promise<string> => {
    if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
    }
    if (file.type === 'application/pdf') {
        // For PDFs, we'll try to render the first page as a preview.
        try {
            const pdfjs = await import('pdfjs-dist/build/pdf');
            pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;
            const pdfData = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if(!context) throw new Error("Could not create canvas context");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            const blob = await new Promise<Blob|null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.5));
            await pdf.destroy();
            if (blob) {
                return URL.createObjectURL(blob);
            }
        } catch (e) {
            console.error("Failed to generate PDF preview:", e);
        }
    }
    // Fallback for non-previewable types or errors
    return '';
  }, []);

  const handleFileSelect = useCallback(async (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = [];
    for (const file of newFiles) {
        const preview = await generatePreviews(file);
        uploadedFiles.push({
            file,
            preview,
            id: `${file.name}-${Date.now()}-${Math.random()}`,
        });
    }
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  }, [generatePreviews]);
  
  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find(f => f.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter((f) => f.id !== id);
    });
  };

  const handleClearAll = () => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
  }

  const handleCreatePdf = async () => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Files Selected',
        description: 'Please upload at least one image or PDF.',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const uploadedFile of files) {
        if (uploadedFile.file.type.startsWith('image/')) {
            const imageBytes = await uploadedFile.file.arrayBuffer();
            let pdfImage;

            if (uploadedFile.file.type === 'image/png') {
                pdfImage = await pdfDoc.embedPng(imageBytes);
            } else if (uploadedFile.file.type === 'image/jpeg') {
                pdfImage = await pdfDoc.embedJpg(imageBytes);
            } else {
                // Basic fallback for other types by drawing to canvas first
                const image = new window.Image();
                image.src = uploadedFile.preview;
                await new Promise(resolve => { image.onload = resolve; });
                
                const canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                const ctx = canvas.getContext('2d');
                if(!ctx) throw new Error("Could not create canvas");
                ctx.drawImage(image, 0, 0);

                const pngBytes = await new Promise<ArrayBuffer>((resolve) => {
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            resolve(await blob.arrayBuffer());
                        }
                    }, 'image/png');
                });
                pdfImage = await pdfDoc.embedPng(pngBytes);
            }

            const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
            page.drawImage(pdfImage, {
              x: 0,
              y: 0,
              width: pdfImage.width,
              height: pdfImage.height,
            });
        } else if (uploadedFile.file.type === 'application/pdf') {
            const pdfToMergeBytes = await uploadedFile.file.arrayBuffer();
            const pdfToMerge = await PDFDocument.load(pdfToMergeBytes);
            const copiedPages = await pdfDoc.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
            copiedPages.forEach(page => pdfDoc.addPage(page));
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'combined-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
          title: 'PDF Created Successfully',
          description: `Your PDF with ${files.length} file(s) is ready.`,
      })
      handleClearAll();

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
            variant: 'destructive',
            title: 'Error Creating PDF',
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
          <CardTitle>Combine Images and PDFs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload 
            onFileSelect={handleFileSelect} 
            acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'application/pdf']}
            multiple={true}
          />
          
          {files.length > 0 && (
            <div className='space-y-2'>
              <h3 className="text-sm font-medium text-muted-foreground">Uploaded Files ({files.length}) - Drag to reorder</h3>
              <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-2">
                <AnimatePresence>
                  {files.map((uploadedFile, index) => (
                    <Reorder.Item
                      key={uploadedFile.id}
                      value={uploadedFile}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="relative group p-2 pr-8 border rounded-md bg-muted/50 flex items-center gap-4"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <div className='relative w-16 h-16 aspect-square flex items-center justify-center bg-background border rounded-sm'>
                        {uploadedFile.file.type.startsWith('image/') && uploadedFile.preview ? (
                            <Image
                              src={uploadedFile.preview}
                              alt={uploadedFile.file.name}
                              fill
                              className="object-cover"
                            />
                        ) : uploadedFile.file.type === 'application/pdf' && uploadedFile.preview ? (
                             <Image
                              src={uploadedFile.preview}
                              alt={`Preview of ${uploadedFile.file.name}`}
                              fill
                              className="object-contain"
                            />
                        ) : (
                           <FileIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className='flex-1 truncate text-sm'>
                          <p className="font-medium">{uploadedFile.file.name}</p>
                          <p className="text-muted-foreground">{Math.round(uploadedFile.file.size / 1024)} KB</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-destructive'
                        onClick={() => handleRemoveFile(uploadedFile.id)}
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
            <Button className="w-full" size="lg" disabled={isProcessing || files.length === 0} onClick={handleCreatePdf}>
                {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating PDF...</> : `Create PDF from ${files.length} File(s)`}
            </Button>
            {files.length > 0 && (
                <Button variant="outline" className="w-full" onClick={handleClearAll} disabled={isProcessing}>
                    Clear All
                </Button>
            )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
