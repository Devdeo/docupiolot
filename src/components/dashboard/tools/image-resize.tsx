'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { fileToDataUrl } from '@/lib/image-utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function ImageResize({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleResize = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image to resize.',
      });
      return;
    }

    if (!width && !height) {
        toast({
            variant: 'destructive',
            title: 'No dimensions specified',
            description: 'Please enter a width or height.',
        });
        return;
    }

    setIsProcessing(true);
    setResizedImage(null);

    try {
        const photoDataUri = await fileToDataUrl(file);
        const img = document.createElement('img');
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            let newWidth = parseInt(width, 10);
            let newHeight = parseInt(height, 10);

            if (width && !height) {
                newHeight = img.height * (newWidth / img.width);
            } else if (!width && height) {
                newWidth = img.width * (newHeight / img.height);
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            const resizedDataUrl = canvas.toDataURL(file.type);

            setResizedImage(resizedDataUrl);
            toast({
                title: 'Image Resized',
                description: 'Your image has been successfully resized.',
            });
            setIsProcessing(false);
        };
        
        img.onerror = () => {
            throw new Error('Failed to load image');
        }

        img.src = photoDataUri;

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error resizing image',
        description: errorMessage,
      });
      setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.href = resizedImage;
    const fileExtension = resizedImage.split(';')[0].split('/')[1] || 'png';
    link.download = `resized-image.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleClear = () => {
    setFile(null);
    setResizedImage(null);
    setWidth('');
    setHeight('');
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload Your Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!resizedImage && !isProcessing ? (
             <FileUpload onFileSelect={(f) => { setFile(f); setResizedImage(null);}} acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']} />
          ): (
            <div className="flex flex-col items-center gap-4">
              {isProcessing && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
              {resizedImage && (
                <>
                    <Image src={resizedImage} alt="Resized image" width={400} height={400} className="rounded-md object-contain" />
                    <Button onClick={handleDownload}>Download Resized Image</Button>
                </>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="font-medium">Resize Options</h3>
            <p className="text-sm text-muted-foreground">
                Enter either width or height to maintain aspect ratio, or enter both for specific dimensions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input id="width" placeholder="e.g., 1920" type="number" value={width} onChange={e => setWidth(e.target.value)} disabled={!file || isProcessing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input id="height" placeholder="e.g., 1080" type="number" value={height} onChange={e => setHeight(e.target.value)} disabled={!file || isProcessing} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button className="w-full" size="lg" onClick={handleResize} disabled={!file || isProcessing}>
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resizing...</> : 'Resize Image'}
          </Button>
           <Button variant="outline" className="w-full" size="lg" onClick={handleClear} disabled={isProcessing}>Clear</Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
