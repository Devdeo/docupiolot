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
import { dataUrlToBlob } from '@/lib/image-utils';

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
  }

  const handleResize = useCallback(async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a PDF to compress.',
      });
      return;
    }

    setIsProcessing(true);
    setResizedPdf(null);
    setResizedSize(null);

    setTimeout(async () => {
        try {
            const targetBytes = (parseFloat(targetSize) || 2) * (targetUnit === 'MB' ? 1024 * 1024 : 1024);
            const existingPdfBytes = await file.arrayBuffer();
            let pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

            // Flatten forms which can sometimes reduce size.
            const form = pdfDoc.getForm();
            if(form && typeof form.isFlattened === 'function' && !form.isFlattened()) {
                try {
                    form.flatten();
                } catch(e) {
                    console.warn("Could not flatten form.", e);
                }
            }

            const imageRefs = new Set();
            pdfDoc.context.indirectObjects.forEach((obj) => {
                if(obj.get('Subtype')?.toString() === '/Image') {
                    imageRefs.add(obj.tag);
                }
            });

            if (imageRefs.size === 0) {
                const compressedPdfBytes = await pdfDoc.save();
                setResizedPdf(compressedPdfBytes);
                setResizedSize(compressedPdfBytes.length);
                 toast({
                    title: 'No Images Found',
                    description: 'PDF has no images to compress. File size may not be significantly reduced, but it has been re-saved to optimize structure.',
                });
                setIsProcessing(false);
                return;
            }

            const totalImageSize = await Array.from(imageRefs).reduce(async (accPromise, tag) => {
                const acc = await accPromise;
                const image = pdfDoc.context.lookup(tag);
                const imageBytes = image.get('Length');
                return acc + (imageBytes?.asNumber() || 0);
            }, Promise.resolve(0));

            const nonImageSize = existingPdfBytes.byteLength - totalImageSize;
            if (nonImageSize > targetBytes) {
                 throw new Error(`The PDF's base structure (${formatBytes(nonImageSize)}) is larger than the target size. Cannot compress further.`);
            }
            
            const targetImageBytes = targetBytes - nonImageSize;
            let totalNewImageBytes = 0;

            const imageEntries = pdfDoc.getPages().flatMap(page => page.node.Resources().get(Symbol.for('Names'))?.Image?.asDict().entries() || []);

            for(const [name, ref] of imageEntries) {
                const image = pdfDoc.context.lookup(ref);
                if (!image) continue;

                const {width, height} = image.size();
                const imageBytes = image.get('Length')?.asNumber() || 0;
                
                let compressedImage: { bytes: Uint8Array, width: number, height: number } | null = null;
                
                try {
                    const imageObj = await pdfDoc.embedJpg(await image.toJpeg());
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if(!ctx) continue;

                    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                        const i = new Image();
                        i.onload = () => resolve(i);
                        i.onerror = reject;
                        i.src = `data:image/jpeg;base64,${btoa(String.fromCharCode(...imageObj.data))}`;
                    });

                    let quality = 0.75;
                    let currentBytes: Uint8Array | null = null;
                    let scale = 1.0;

                    while(scale > 0.1) {
                        canvas.width = width * scale;
                        canvas.height = height * scale;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        
                        let low = 0, high = 1.0;
                        let bestBytes: Uint8Array | null = null;

                        for(let i=0; i<8; i++) {
                            quality = (low + high) / 2;
                            const dataUrl = canvas.toDataURL('image/jpeg', quality);
                            const blob = await dataUrlToBlob(dataUrl);
                            if (blob.size < imageBytes * (targetImageBytes / totalImageSize)) {
                                bestBytes = new Uint8Array(await blob.arrayBuffer());
                                low = quality;
                            } else {
                                high = quality;
                            }
                        }

                        if (bestBytes) {
                             currentBytes = bestBytes;
                             break;
                        }
                        scale -= 0.1;
                    }
                    
                    if (currentBytes) {
                        compressedImage = { bytes: currentBytes, width: canvas.width, height: canvas.height };
                    }

                } catch (e) {
                    console.warn("Could not process an image, skipping it.", e);
                    continue; // Skip images that can't be processed (e.g. masks, non-jpeg compatible)
                }

                if (compressedImage) {
                    totalNewImageBytes += compressedImage.bytes.length;
                    const newImage = await pdfDoc.embedJpg(compressedImage.bytes);
                    image.set(Symbol.for('Ref'), newImage.ref);
                }
            }


            const finalPdfBytes = await pdfDoc.save();
            setResizedPdf(finalPdfBytes);
            setResizedSize(finalPdfBytes.length);

            if(finalPdfBytes.length > targetBytes) {
                toast({
                    title: 'Partial Compression',
                    description: 'Could not meet the target size exactly, but compressed the file as much as possible.',
                });
            } else {
                toast({
                    title: 'Compression Successful',
                    description: `PDF compressed to ${formatBytes(finalPdfBytes.length)}.`,
                });
            }


        } catch (error) {
            console.error('Error processing PDF:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. This PDF may not be compatible with the compressor.';
            toast({
                variant: 'destructive',
                title: 'Error Processing PDF',
                description: errorMessage,
            });
        } finally {
            setIsProcessing(false);
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
          <CardDescription>Upload a PDF to reduce its file size by optimizing embedded images. Results may vary.</CardDescription>
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
                    <p className="text-sm text-muted-foreground">This may take a moment...</p>
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
                        <Label htmlFor="size">Target Size (Best Effort)</Label>
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

    