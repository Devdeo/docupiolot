'use client';

import { useState, useCallback } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, GripVertical } from 'lucide-react';

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

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export default function AddImagesToPdfClient({ onBack, title }: ToolProps) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== newFiles.length) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload only image files.',
      });
    }

    const newImageFiles: ImageFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newImageFiles]);
  }, [toast]);
  
  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter((f) => f.id !== id);
    });
  };

  const handleClearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
  }

  const handleCreatePdf = async () => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Images Selected',
        description: 'Please upload at least one image.',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imageFile of files) {
        const imageBytes = await imageFile.file.arrayBuffer();
        let pdfImage;

        if (imageFile.file.type === 'image/png') {
            pdfImage = await pdfDoc.embedPng(imageBytes);
        } else if (imageFile.file.type === 'image/jpeg') {
            pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else {
            // Basic fallback for other types by drawing to canvas first
            const image = new window.Image();
            image.src = imageFile.preview;
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
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'created-from-images.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
          title: 'PDF Created Successfully',
          description: `Your PDF with ${files.length} images is ready.`,
      })

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
          <CardTitle>Add Images to Create a PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload 
            onFileSelect={handleFileSelect} 
            acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']}
            multiple={true}
          />
          
          {files.length > 0 && (
            <div className='space-y-2'>
              <h3 className="text-sm font-medium text-muted-foreground">Uploaded Images ({files.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {files.map((imageFile) => (
                    <motion.div
                      key={imageFile.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group aspect-square"
                    >
                      <Image
                        src={imageFile.preview}
                        alt={imageFile.file.name}
                        fill
                        className="object-cover rounded-md border"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="icon"
                          className='h-8 w-8'
                          onClick={() => handleRemoveFile(imageFile.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button className="w-full" size="lg" disabled={isProcessing || files.length === 0} onClick={handleCreatePdf}>
                {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating PDF...</> : `Create PDF from ${files.length} Image(s)`}
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
