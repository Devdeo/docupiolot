'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { fileToDataUrl, dataUrlToBlob } from '@/lib/image-utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function ImageResize({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetSize, setTargetSize] = useState('2');
  const [targetUnit, setTargetUnit] = useState('MB');
  const [outputFilename, setOutputFilename] = useState('');
  const [outputExtension, setOutputExtension] = useState('jpg');
  const { toast } = useToast();
  
  useEffect(() => {
    if (file) {
      const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
      setOutputFilename(`desized-${originalName}`);
    }
  }, [file]);

  const handleResize = useCallback(async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image to resize.',
      });
      return;
    }

    // Set processing state immediately to show loader
    setIsProcessing(true);
    setResizedImage(null);

    // Use a timeout to allow the UI to update to the processing state before the heavy work begins.
    setTimeout(async () => {
      try {
          const photoDataUri = await fileToDataUrl(file);
          const targetBytes = (parseFloat(targetSize) || 2) * (targetUnit === 'MB' ? 1024 * 1024 : 1024);
          const outputMimeType = `image/${outputExtension === 'jpg' ? 'jpeg' : outputExtension}`;

          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
              const image = document.createElement('img');
              image.onload = () => resolve(image);
              image.onerror = () => reject(new Error('Failed to load image.'));
              image.src = photoDataUri;
          });

          let currentWidth = img.width;
          let currentHeight = img.height;
          let resizedDataUrl: string | null = null;
          let finalBlob: Blob | null = null;
          let quality = 0.9; // Start with high quality

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');
          
          // Optimization: Attempt to resize in a few passes
          for (let i = 0; i < 15; i++) { // Max 15 attempts to prevent infinite loops
              canvas.width = currentWidth;
              canvas.height = currentHeight;
              ctx.drawImage(img, 0, 0, currentWidth, currentHeight);
              
              const currentDataUrl = canvas.toDataURL(outputMimeType, quality);
              const currentBlob = await dataUrlToBlob(currentDataUrl);

              if (currentBlob.size <= targetBytes) {
                  resizedDataUrl = currentDataUrl;
                  finalBlob = currentBlob;
                  // If we are well under target, we can stop.
                  if (currentBlob.size < targetBytes * 0.9) {
                    break;
                  }
                  // otherwise, try to improve quality slightly in next pass if there is one
                  quality += 0.05;

              } else {
                  // If quality is already low, reduce dimensions
                  if (quality < 0.5) {
                      const scale = Math.sqrt(targetBytes / currentBlob.size) * 0.9; // Aggressively scale down
                      currentWidth = Math.round(currentWidth * scale);
                      currentHeight = Math.round(currentHeight * scale);
                  } else {
                    // Reduce quality
                    quality -= 0.1;
                  }
              }
              // Ensure quality and dimensions are within valid ranges
              quality = Math.max(0.1, Math.min(1, quality));
              if(currentWidth < 1 || currentHeight < 1) {
                break;
              }
          }

          if (!resizedDataUrl || !finalBlob) {
            throw new Error(`Could not resize image below ${targetSize}${targetUnit}. Please try a larger target size or a different image.`);
          }

          setResizedImage(resizedDataUrl);
          toast({
              title: 'Image Resized Successfully',
              description: `New size: ${(finalBlob.size / 1024 / 1024).toFixed(2)} MB.`,
          });

      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
        toast({
          variant: 'destructive',
          title: 'Error resizing image',
          description: errorMessage,
        });
      } finally {
          setIsProcessing(false);
      }
    }, 10); // A very small delay to free up the main thread for UI update
  }, [file, targetSize, targetUnit, outputExtension, toast]);
  
  const handleDownload = () => {
    if (!resizedImage || !file) return;
    const link = document.createElement('a');
    link.href = resizedImage;
    
    const finalFilename = outputFilename || `desized-${file.name.substring(0, file.name.lastIndexOf('.'))}`
    const finalExtension = outputExtension || 'jpg';
    link.download = `${finalFilename}.${finalExtension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleClear = () => {
    setFile(null);
    setResizedImage(null);
    setIsProcessing(false);
  }

  const handleFileSelect = (f: File | null) => {
    setFile(f);
    setResizedImage(null);
    setIsProcessing(false);
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload Your Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
             <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']} />
          ) : (
            <div className="flex flex-col items-center gap-4">
              {isProcessing && (
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-muted-foreground">Resizing, please wait...</p>
                </div>
              )}
              {!isProcessing && resizedImage && (
                <>
                    <Image src={resizedImage} alt="Resized image" width={400} height={400} className="rounded-md object-contain" />
                    <div className="w-full space-y-4 rounded-md border p-4">
                        <h3 className="font-medium text-center">Download Options</h3>
                        <div className="space-y-2">
                            <Label htmlFor="filename">Filename</Label>
                            <Input id="filename" value={outputFilename} onChange={(e) => setOutputFilename(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="extension">File Extension</Label>
                             <Select value={outputExtension} onValueChange={setOutputExtension}>
                                <SelectTrigger id="extension">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="jpg">jpg</SelectItem>
                                    <SelectItem value="png">png</SelectItem>
                                    <SelectItem value="webp">webp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleDownload} className="w-full">Download Resized Image</Button>
                    </div>
                </>
              )}
               {!isProcessing && !resizedImage && file && (
                 <div className="w-full space-y-4">
                    <div className="relative w-full max-w-xs mx-auto aspect-square">
                        <Image src={URL.createObjectURL(file)} alt="Original image preview" layout="fill" className="rounded-md object-contain" />
                    </div>
                   <h3 className="font-medium">Resize Options</h3>
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
          {file && !resizedImage && (
            <Button className="w-full" size="lg" onClick={handleResize} disabled={isProcessing}>
              {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resizing...</> : 'Resize Image'}
            </Button>
          )}
          {file && (
             <Button variant="outline" className="w-full" size="lg" onClick={handleClear} disabled={isProcessing}>Clear</Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
