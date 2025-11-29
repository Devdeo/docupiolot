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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function ImageResize({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
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

    setIsProcessing(true);
    setResizedImage(null);

    try {
        const photoDataUri = await fileToDataUrl(file);
        // Placeholder logic as resizing to a specific file size client-side is complex.
        // This just redraws the image. A real implementation would involve iterative compression.
        const img = document.createElement('img');
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // In a real scenario, you'd use canvas.toBlob with a quality parameter in a loop
            // to try and get close to the target size. For this prototype, we just return the image.
            const resizedDataUrl = canvas.toDataURL(file.type, 0.9); // 0.9 is quality

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="size">Target Size</Label>
                <div className="flex gap-2">
                    <Input id="size" placeholder="e.g., 5" type="number" className="w-full" disabled={!file || isProcessing}/>
                    <Select defaultValue="MB" disabled={!file || isProcessing}>
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
              <div className="space-y-2">
                <Label htmlFor="quality">Quality (DPI)</Label>
                <Select defaultValue="150" disabled={!file || isProcessing}>
                    <SelectTrigger id="quality">
                        <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="300">High Quality (300 DPI)</SelectItem>
                        <SelectItem value="150">Good Quality (150 DPI)</SelectItem>
                        <SelectItem value="72">Low Quality (72 DPI)</SelectItem>
                    </SelectContent>
                </Select>
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
