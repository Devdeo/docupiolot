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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useInterstitialAd } from '@/hooks/use-interstitial-ad';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function ImageResize({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showAd } = useInterstitialAd();
  
  // Size-based state
  const [targetSize, setTargetSize] = useState('500');
  const [targetUnit, setTargetUnit] = useState('KB');
  
  // Dimension-based state
  const [targetWidth, setTargetWidth] = useState('');
  const [targetHeight, setTargetHeight] = useState('');
  const [targetDpi, setTargetDpi] = useState('300');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);


  const [outputFilename, setOutputFilename] = useState('');
  const [outputExtension, setOutputExtension] = useState('jpg');
  const { toast } = useToast();
  
  useEffect(() => {
    if (file) {
      const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
      setOutputFilename(`resized-${originalName}`);

      const img = document.createElement('img');
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setTargetWidth(String(img.width));
        setTargetHeight(String(img.height));
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    }
  }, [file]);

  const handleWidthChange = (value: string) => {
    setTargetWidth(value);
    if (maintainAspectRatio && originalDimensions) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        const aspectRatio = originalDimensions.height / originalDimensions.width;
        setTargetHeight(String(Math.round(numValue * aspectRatio)));
      } else if (value === '') {
        setTargetHeight('');
      }
    }
  };

  const handleHeightChange = (value: string) => {
    setTargetHeight(value);
    if (maintainAspectRatio && originalDimensions) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        setTargetWidth(String(Math.round(numValue * aspectRatio)));
      } else if (value === '') {
        setTargetWidth('');
      }
    }
  };


  const handleResize = useCallback(async (mode: 'size' | 'dimensions') => {
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

    // Use a short timeout to allow the UI to update to the processing state
    setTimeout(async () => {
      try {
          const photoDataUri = await fileToDataUrl(file);
          const outputMimeType = `image/${outputExtension === 'jpg' ? 'jpeg' : outputExtension}`;

          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
              const image = document.createElement('img');
              image.onload = () => resolve(image);
              image.onerror = () => reject(new Error('Failed to load image.'));
              image.src = photoDataUri;
          });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');

          let resizedDataUrl: string;
          let finalBlob: Blob;

          if (mode === 'dimensions') {
            const width = parseInt(targetWidth, 10);
            const height = parseInt(targetHeight, 10);

            if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
              throw new Error("Invalid dimensions provided.");
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            resizedDataUrl = canvas.toDataURL(outputMimeType, 0.95); // High quality for dimension resize
            finalBlob = await dataUrlToBlob(resizedDataUrl);

          } else { // mode === 'size'
            const targetBytes = (parseFloat(targetSize) || 2) * (targetUnit === 'MB' ? 1024 * 1024 : 1024);
            
            let currentWidth = img.width;
            let currentHeight = img.height;
            let tempResizedDataUrl: string | null = null;
            
            let dimensionScale = 1.0;
            const maxDimensionSteps = 20;

            for (let i = 0; i < maxDimensionSteps; i++) {
              currentWidth = Math.round(img.width * dimensionScale);
              currentHeight = Math.round(img.height * dimensionScale);
              canvas.width = currentWidth;
              canvas.height = currentHeight;
              ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

              const lowestQualityDataUrl = canvas.toDataURL(outputMimeType, 0);
              const lowestQualityBlob = await dataUrlToBlob(lowestQualityDataUrl);

              if (lowestQualityBlob.size > targetBytes) {
                  dimensionScale *= 0.9;
                  continue;
              }

              let low = 0, high = 1.0, bestQualityUrl = lowestQualityDataUrl;
              for (let j = 0; j < 10; j++) {
                  const mid = (low + high) / 2;
                  const currentDataUrl = canvas.toDataURL(outputMimeType, mid);
                  const currentBlob = await dataUrlToBlob(currentDataUrl);
                  
                  if (currentBlob.size <= targetBytes) {
                      bestQualityUrl = currentDataUrl;
                      low = mid; 
                  } else {
                      high = mid; 
                  }
              }
              
              tempResizedDataUrl = bestQualityUrl;
              break;
            }

            if (!tempResizedDataUrl) {
               canvas.width = Math.round(img.width * dimensionScale);
               canvas.height = Math.round(img.height * dimensionScale);
               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
               tempResizedDataUrl = canvas.toDataURL(outputMimeType, 0);
            }
            resizedDataUrl = tempResizedDataUrl;
            finalBlob = await dataUrlToBlob(resizedDataUrl);
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
    }, 10);
  }, [file, targetSize, targetUnit, outputExtension, toast, targetWidth, targetHeight]);
  
  const handleDownload = () => {
    if (!resizedImage || !file) return;

    showAd().then(() => {
        const link = document.createElement('a');
        link.href = resizedImage;
        
        const finalFilename = outputFilename || `resized-${file.name.substring(0, file.name.lastIndexOf('.'))}`
        const finalExtension = outputExtension || 'jpg';
        link.download = `${finalFilename}.${finalExtension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
  }

  const handleClear = () => {
    setFile(null);
    setResizedImage(null);
    setIsProcessing(false);
    setOriginalDimensions(null);
    setTargetWidth('');
    setTargetHeight('');
  }

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
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
                        <Image src={URL.createObjectURL(file)} alt="Original image preview" fill className="rounded-md object-contain" />
                    </div>
                    {originalDimensions && (
                      <p className="text-center text-sm text-muted-foreground">Original: {originalDimensions.width} x {originalDimensions.height} px</p>
                    )}

                    <Tabs defaultValue="size" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="size">By File Size</TabsTrigger>
                        <TabsTrigger value="dimensions">By Dimensions</TabsTrigger>
                      </TabsList>
                      <TabsContent value="size" className="pt-4">
                        <div className="space-y-4">
                          <Label htmlFor="size">Target File Size</Label>
                           <div className="flex gap-2">
                               <Input id="size" value={targetSize} onChange={(e) => setTargetSize(e.target.value)} placeholder="e.g., 500" type="number" className="w-full" disabled={isProcessing}/>
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
                           <Button className="w-full" onClick={() => handleResize('size')} disabled={isProcessing}>
                            Resize by Size
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="dimensions" className="pt-4">
                         <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="width">Width (px)</Label>
                                <Input id="width" value={targetWidth} onChange={(e) => handleWidthChange(e.target.value)} type="number" />
                              </div>
                               <div className="space-y-2">
                                <Label htmlFor="height">Height (px)</Label>
                                <Input id="height" value={targetHeight} onChange={(e) => handleHeightChange(e.target.value)} type="number" />
                              </div>
                           </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="aspect-ratio" checked={maintainAspectRatio} onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)} />
                              <label
                                htmlFor="aspect-ratio"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Maintain aspect ratio
                              </label>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dpi">DPI (optional)</Label>
                              <Input id="dpi" value={targetDpi} onChange={(e) => setTargetDpi(e.target.value)} type="number" placeholder='e.g. 300' />
                              <p className='text-xs text-muted-foreground'>DPI is metadata and does not change pixel dimensions.</p>
                           </div>
                           <Button className="w-full" onClick={() => handleResize('dimensions')} disabled={isProcessing}>
                             Resize by Dimensions
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
           {file && !isProcessing && (
              <Button variant="outline" className="w-full" onClick={handleClear} disabled={isProcessing}>Start Over</Button>
           )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
