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

        let quality = 0.9;
        let resizedDataUrl;
        let blob;
        const outputMimeType = `image/${outputExtension === 'jpg' ? 'jpeg' : outputExtension}`;

        const targetBytes = (parseFloat(targetSize) || 2) * (targetUnit === 'MB' ? 1024 * 1024 : 1024);
        
        let iterations = 10;
        while (iterations > 0) {
          resizedDataUrl = canvas.toDataURL(outputMimeType, quality);
          blob = await dataUrlToBlob(resizedDataUrl);
          if (blob.size <= targetBytes) break;
          quality -= 0.1;
          if (quality <= 0.1) {
            quality = 0.1; // Ensure we don't go below 0.1
            resizedDataUrl = canvas.toDataURL(outputMimeType, quality);
            blob = await dataUrlToBlob(resizedDataUrl);
            break;
          };
          iterations--;
        }
        
        if (!resizedDataUrl || !blob) {
            throw new Error("Failed to resize image to target size.");
        }

        setResizedImage(resizedDataUrl);
        toast({
            title: 'Image Resized',
            description: `Your image has been resized to approximately ${(blob.size / 1024 / 1024).toFixed(2)} MB.`,
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
          ): (
            <div className="flex flex-col items-center gap-4">
              {isProcessing && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
              {resizedImage && (
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
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="font-medium">Resize Options</h3>
            <div className="space-y-2">
              <Label htmlFor="size">Target Size</Label>
              <div className="flex gap-2">
                  <Input id="size" value={targetSize} onChange={(e) => setTargetSize(e.target.value)} placeholder="e.g., 2" type="number" className="w-full" disabled={!file || isProcessing}/>
                  <Select value={targetUnit} onValueChange={setTargetUnit} disabled={!file || isProcessing}>
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
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" size="lg" onClick={handleResize} disabled={!file || isProcessing}>
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resizing...</> : 'Resize Image'}
          </Button>
           <Button variant="outline" className="w-full" size="lg" onClick={handleClear} disabled={isProcessing}>Clear</Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
