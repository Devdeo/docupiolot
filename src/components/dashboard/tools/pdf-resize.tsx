'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function PdfResize({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resizedPdf, setResizedPdf] = useState<Uint8Array | null>(null);
  const [resizedSize, setResizedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');
  const { toast } = useToast();
  const [targetSize, setTargetSize] = useState('2');
  const [targetUnit, setTargetUnit] = useState('MB');
  const [progressMessage, setProgressMessage] = useState('');

  useEffect(() => {
    if (file) {
      const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
      setOutputFilename(`compressed-${originalName}`);
      setOriginalSize(file.size);
    } else {
        setOriginalSize(null);
        setResizedSize(null);
    }
  }, [file]);
  
  const handleFileSelect = (f: File | null) => {
    setFile(f);
    setResizedPdf(null);
    setResizedSize(null);
    setIsProcessing(false);
    setProgressMessage('');
  }

  const handleResize = useCallback(async () => {
    if (!file) {
      toast({ variant: 'destructive', title: 'No file selected' });
      return;
    }

    setIsProcessing(true);
    setResizedPdf(null);
    setResizedSize(null);
    setProgressMessage('Loading PDF...');

    setTimeout(async () => {
      try {
        const targetBytes = (parseFloat(targetSize) || 2) * (targetUnit === 'MB' ? 1024 * 1024 : 1024);
        const existingPdfBytes = await file.arrayBuffer();
        
        setProgressMessage(`Analyzing and converting pages...`);
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        const pdf = await pdfjs.getDocument(existingPdfBytes).promise;
        const pageCount = pdf.numPages;
        const pageImagesData: {dataUrl: string, width: number, height: number}[] = [];

        for (let i = 0; i < pageCount; i++) {
            setProgressMessage(`Converting page ${i + 1} of ${pageCount}`);
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale: 2.0 }); 
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if(!context) throw new Error("Could not create canvas context");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            pageImagesData.push({
                dataUrl: canvas.toDataURL('image/jpeg', 1.0),
                width: viewport.width,
                height: viewport.height
            });
        }
        await pdf.destroy();

        setProgressMessage('Compressing pages...');
        let quality = 0.95;
        let scale = 1.0;
        let finalPdfBytes: Uint8Array | null = null;
        
        const maxIterations = 30; 
        for(let i = 0; i < maxIterations; i++) {
          const newPdfDoc = await PDFDocument.create();
          
          for (const pageData of pageImagesData) {
            const img = new Image();
            img.src = pageData.dataUrl;
            await new Promise(resolve => { img.onload = resolve; });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            
            const newWidth = Math.round(pageData.width * scale);
            const newHeight = Math.round(pageData.height * scale);
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
            const imageBytes = await fetch(resizedDataUrl).then(res => res.arrayBuffer());
            const image = await newPdfDoc.embedJpg(imageBytes);

            const page = newPdfDoc.addPage([newWidth, newHeight]);
            page.drawImage(image, { x: 0, y: 0, width: newWidth, height: newHeight });
          }

          finalPdfBytes = await newPdfDoc.save();

          setProgressMessage(`Iteration ${i+1}: Current size ${formatBytes(finalPdfBytes.length)}`);

          if (finalPdfBytes.length <= targetBytes) {
            break;
          }

          if (quality > 0.1) {
            quality -= 0.1;
          } else if (scale > 0.2) {
            scale -= 0.1;
            quality = 0.9; 
          } else {
             break;
          }
        }
        
        if (!finalPdfBytes) {
          throw new Error("Could not generate a compressed PDF.");
        }
        
        if (finalPdfBytes.length > targetBytes) {
          toast({
            variant: 'destructive',
            title: 'Target size too small',
            description: `Could only compress to ${formatBytes(finalPdfBytes.length)}.`,
          });
        } else {
            toast({
              title: 'Compression Successful',
              description: `PDF compressed to ${formatBytes(finalPdfBytes.length)}.`,
            });
        }

        setResizedPdf(finalPdfBytes);
        setResizedSize(finalPdfBytes.length);

      } catch (error) {
        console.error('Error processing PDF:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        toast({
          variant: 'destructive',
          title: 'Error Processing PDF',
          description: errorMessage,
        });
      } finally {
        setIsProcessing(false);
        setProgressMessage('');
      }
    }, 10);
  }, [file, targetSize, targetUnit, toast]);

  const handleDownload = () => {
    if (!resizedPdf || !file) return;
    const blob = new Blob([resizedPdf], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${outputFilename || `compressed-${file.name.substring(0, file.name.lastIndexOf('.'))}`}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleClear = () => {
    handleFileSelect(null);
  };

  const formatBytes = (bytes: number | null) => {
    if (bytes === null || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Compress PDF</CardTitle>
          <CardDescription>Upload a PDF to reduce its file size. Pages are converted to compressed images to meet the target size.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['application/pdf']} />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p>Compressing: {file?.name}</p>
                    <p className="text-sm text-muted-foreground">{progressMessage}</p>
                  </>
                ) : null }
                {resizedPdf && !isProcessing ? (
                  <div className="w-full space-y-4 rounded-md border p-4">
                      <h3 className="font-medium text-center">Compression Results</h3>
                      <div className="flex justify-around text-sm">
                        <p>Original Size: <span className="font-semibold">{formatBytes(originalSize)}</span></p>
                        <p>New Size: <span className="font-semibold">{formatBytes(resizedSize)}</span></p>
                      </div>
                       <div className="space-y-2">
                            <Label htmlFor="filename">Download As</Label>
                            <Input id="filename" value={outputFilename} onChange={(e) => setOutputFilename(e.target.value)} />
                        </div>
                      <Button onClick={handleDownload} className="w-full">Download Compressed PDF</Button>
                  </div>
                ) : null }
                
                {!isProcessing && !resizedPdf && file && (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                        <p className="font-medium">{file.name}</p>
                      </div>
                      <h3 className="font-medium">Compression Options</h3>
                      <div className="space-y-2">
                        <Label htmlFor="size">Target Size</Label>
                        <div className="flex gap-2">
                            <Input id="size" value={targetSize} onChange={(e) => setTargetSize(e.target.value)} placeholder="e.g., 2" type="number" className="w-full" disabled={isProcessing}/>
                            <Select value={targetUnit} onValueChange={setTargetUnit} disabled={isProcessing}>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="KB">KB</SelectItem>
                                    <SelectItem value="MB">MB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                      </div>
                    </div>
                )}
             </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {file && !resizedPdf && !isProcessing && (
              <Button className="w-full" size="lg" onClick={handleResize} disabled={isProcessing}>
                {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing...</> : 'Compress PDF'}
              </Button>
          )}
          {(resizedPdf || file) && !isProcessing && (
             <Button variant="outline" className="w-full" size="lg" onClick={handleClear} disabled={isProcessing}>Start Over</Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
