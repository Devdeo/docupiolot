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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


interface ToolProps {
  onBack: () => void;
  title: string;
}

type CompressionLevel = 'basic' | 'strong';

export default function PdfCompressClient({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resizedPdf, setResizedPdf] = useState<Uint8Array | null>(null);
  const [resizedSize, setResizedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');
  const { toast } = useToast();
  
  // Size-based state
  const [targetSize, setTargetSize] = useState('2');
  const [targetUnit, setTargetUnit] = useState('MB');
  
  // Quality-based state
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('basic');
  const [targetDpi, setTargetDpi] = useState('150');

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
  
  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
    setResizedPdf(null);
    setResizedSize(null);
    setIsProcessing(false);
    setProgressMessage('');
  }

  const compressPdf = useCallback(async (mode: 'size' | 'quality', options: { targetBytes?: number, level?: CompressionLevel, dpi?: number }) => {
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
        const pdfjs = await import('pdfjs-dist/build/pdf');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;
        
        const existingPdfBytes = await file.arrayBuffer();
        
        setProgressMessage(`Analyzing and converting pages...`);
        
        const pdf = await pdfjs.getDocument({ data: existingPdfBytes }).promise;
        const pageCount = pdf.numPages;
        const pageImagesData: {dataUrl: string, width: number, height: number}[] = [];
        
        // Calculate scale based on DPI for quality mode, or use a default for size mode
        const dpi = options.dpi || 150;
        const initialScale = mode === 'quality' ? dpi / 72 : 2.0;

        for (let i = 0; i < pageCount; i++) {
            setProgressMessage(`Converting page ${i + 1} of ${pageCount} to image`);
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale: initialScale });
            
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
        
        let finalPdfBytes: Uint8Array;

        if (mode === 'size') {
            const targetBytes = options.targetBytes!;
            setProgressMessage('Compressing images to target size...');
            let currentImages: {bytes: ArrayBuffer, width: number, height: number}[] = [];
            let totalImageSize = Infinity;
            let quality = 0.9;
            let scale = 1.0;
            
            let iteration = 0;
            while (totalImageSize > targetBytes && (scale > 0.1 || quality > 0.05)) {
              iteration++;
              totalImageSize = 0;
              currentImages = [];
              
              setProgressMessage(`Iteration ${iteration}: Compressing with scale ${scale.toFixed(2)} & quality ${quality.toFixed(2)}`);

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
                
                totalImageSize += imageBytes.byteLength;
                currentImages.push({ bytes: imageBytes, width: newWidth, height: newHeight });
              }

              if (totalImageSize > targetBytes) {
                 if (quality > 0.1) {
                    quality -= 0.1;
                 } else if (scale > 0.1) {
                    scale -= 0.1;
                    quality = 0.9;
                 } else {
                    quality -= 0.05;
                 }
                 if (quality < 0) quality = 0.01;
                 if (scale < 0) scale = 0.1;
              }
            }
            
            setProgressMessage('Re-assembling PDF...');
            const newPdfDoc = await PDFDocument.create();
            for (const imageData of currentImages) {
              const image = await newPdfDoc.embedJpg(imageData.bytes);
              const page = newPdfDoc.addPage([imageData.width, imageData.height]);
              page.drawImage(image, { x: 0, y: 0, width: imageData.width, height: imageData.height });
            }
            finalPdfBytes = await newPdfDoc.save();

        } else { // mode === 'quality'
            const quality = options.level === 'strong' ? 0.5 : 0.75;
            setProgressMessage(`Compressing with ${options.level} settings...`);
            
            const newPdfDoc = await PDFDocument.create();
            for (const pageData of pageImagesData) {
                const img = new Image();
                img.src = pageData.dataUrl;
                await new Promise(resolve => { img.onload = resolve; });

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Could not get canvas context');

                canvas.width = pageData.width;
                canvas.height = pageData.height;
                ctx.drawImage(img, 0, 0, pageData.width, pageData.height);

                const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
                const imageBytes = await fetch(resizedDataUrl).then(res => res.arrayBuffer());

                const image = await newPdfDoc.embedJpg(imageBytes);
                const page = newPdfDoc.addPage([pageData.width, pageData.height]);
                page.drawImage(image, { x: 0, y: 0, width: pageData.width, height: pageData.height });
            }
            finalPdfBytes = await newPdfDoc.save();
        }

        toast({
            title: 'Compression Successful',
            description: `Final PDF size: ${formatBytes(finalPdfBytes.length)}.`,
        });

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
  }, [file, toast]);

  const handleCompressBySize = () => {
    const parsedTargetSize = parseFloat(targetSize);
    if (isNaN(parsedTargetSize) || parsedTargetSize <= 0) {
      toast({ variant: 'destructive', title: 'Invalid target size', description: 'Please enter a positive number for the target size.' });
      return;
    }
    const targetBytes = parsedTargetSize * (targetUnit === 'MB' ? 1024 * 1024 : 1024);
    compressPdf('size', { targetBytes });
  }

  const handleCompressByQuality = () => {
    const dpi = parseInt(targetDpi, 10);
     if (isNaN(dpi) || dpi <= 0) {
      toast({ variant: 'destructive', title: 'Invalid DPI', description: 'Please enter a positive number for DPI.' });
      return;
    }
    compressPdf('quality', { level: compressionLevel, dpi });
  }

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
    handleFileSelect([]);
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
          <CardDescription>Reduce the file size of your PDF. Choose your desired compression method.</CardDescription>
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
                            <p className="font-medium">{file.name} ({formatBytes(file.size)})</p>
                        </div>
                        <Tabs defaultValue="size" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="size">By File Size</TabsTrigger>
                                <TabsTrigger value="quality">By Quality</TabsTrigger>
                            </TabsList>
                            <TabsContent value="size" className="pt-4">
                                <div className="space-y-4">
                                    <p className='text-sm text-muted-foreground'>Compress to an approximate file size. We'll do our best to match it.</p>
                                    <div className="space-y-2 text-left">
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
                                     <Button className="w-full" onClick={handleCompressBySize} disabled={isProcessing}>
                                        Compress by Size
                                    </Button>
                                </div>
                            </TabsContent>
                             <TabsContent value="quality" className="pt-4">
                                <div className="space-y-4 text-left">
                                     <p className='text-sm text-muted-foreground'>Choose a preset compression level for a balance of size and quality.</p>
                                    <RadioGroup defaultValue="basic" onValueChange={(value: CompressionLevel) => setCompressionLevel(value)} className="grid grid-cols-2 gap-4">
                                        <div>
                                            <RadioGroupItem value="basic" id="basic" className="peer sr-only" />
                                            <Label htmlFor="basic" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                Basic
                                                <span className="text-xs text-muted-foreground">Good Quality, Good Compression</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="strong" id="strong" className="peer sr-only" />
                                            <Label htmlFor="strong" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                Strong
                                                <span className="text-xs text-muted-foreground">Smaller Size, Lower Quality</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                    <div className="space-y-2">
                                        <Label htmlFor="dpi">DPI (Resolution)</Label>
                                        <Input id="dpi" value={targetDpi} onChange={(e) => setTargetDpi(e.target.value)} type="number" placeholder='e.g. 150' />
                                        <p className='text-xs text-muted-foreground'>Lower DPI reduces file size (e.g., 72 for screen, 150 for standard).</p>
                                    </div>
                                    <Button className="w-full" onClick={handleCompressByQuality} disabled={isProcessing}>
                                        Compress by Quality
                                    </Button>
                                </div>
                             </TabsContent>
                        </Tabs>
                    </div>
                )}
             </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {(file) && !isProcessing && (
             <Button variant="outline" className="w-full" size="lg" onClick={handleClear} disabled={isProcessing}>Start Over</Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}

    