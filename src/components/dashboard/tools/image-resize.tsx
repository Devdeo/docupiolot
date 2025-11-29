'use client';
import { useState, useEffect } from 'react';
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

  const handleResize = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image to resize.',
      });
      return;
    }

    setIsProcessing(true);
    setResizedImage(null);

    // Use a timeout to allow the UI to update to the processing state before the heavy work begins.
    setTimeout(async () => {
      try {
          const photoDataUri = await fileToDataUrl(file);
          
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
              const image = document.createElement('img');
              image.onload = () => resolve(image);
              image.onerror = () => reject(new Error('Failed to load image.'));
              image.src = photoDataUri;
          });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
              throw new Error('Could not get canvas context');
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const outputMimeType = `image/${outputExtension === 'jpg' ? 'jpeg' : outputExtension}`;
          const targetBytes = (parseFloat(targetSize) || 2) * (targetUnit === 'MB' ? 1024 * 1024 : 1024);

          // --- Binary search for optimal quality ---
          let low = 0;
          let high = 1;
          let bestQuality = 0.1;
          let resizedDataUrl: string | undefined;
          let finalBlob: Blob | undefined;
          const precision = 1000; // Stop when size is within 1KB of target.

          // Perform a few iterations to find the best quality
          for (let i = 0; i < 15; i++) { // Increased iterations for more precision
              const mid = (low + high) / 2;
              const currentDataUrl = canvas.toDataURL(outputMimeType, mid);
              const currentBlob = await dataUrlToBlob(currentDataUrl);
              
              if (currentBlob.size <= targetBytes) {
                  bestQuality = mid;
                  resizedDataUrl = currentDataUrl;
                  finalBlob = currentBlob;
                  low = mid; // Try for higher quality
              } else {
                  high = mid; // Need to reduce quality
              }

              if (finalBlob && Math.abs(targetBytes - finalBlob.size) < precision) {
                break; // Exit if we are close enough
              }
          }
          
          // If we never found a suitable size, use the lowest quality result that was valid
          if (!resizedDataUrl) {
            const lowestQualityUrl = canvas.toDataURL(outputMimeType, bestQuality);
            const lowestQualityBlob = await dataUrlToBlob(lowestQualityUrl);
            if(lowestQualityBlob.size <= targetBytes){
                resizedDataUrl = lowestQualityUrl;
                finalBlob = lowestQualityBlob;
            } else {
                throw new Error(`Could not resize image below ${targetSize}${targetUnit}. Please try a larger target size.`);
            }
          }
          
          if (!resizedDataUrl || !finalBlob) {
              throw new Error("Failed to resize image to target size.");
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
    }, 50); // A small delay is enough to free up the main thread
  };
  
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
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload Your Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
             <FileUpload onFileSelect={(f) => { setFile(f); setResizedImage(null);}} acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']} />
          ) : (
            <div className="flex flex-col items-center gap-4">
              {isProcessing && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
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
               {!resizedImage && !isProcessing && (
                 <div className="w-full space-y-4">
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
          {file && (
            <>
              <Button className="w-full" size="lg" onClick={handleResize} disabled={isProcessing || !!resizedImage}>
                {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resizing...</> : 'Resize Image'}
              </Button>
              <Button variant="outline" className="w-full" size="lg" onClick={handleClear} disabled={isProcessing}>Clear</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
