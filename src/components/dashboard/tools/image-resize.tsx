'use client';
import { useState } from 'react';
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
  const [dpi, setDpi] = useState('150');
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
        
        const img = document.createElement('img');
        
        img.onload = async () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    throw new Error('Could not get canvas context');
                }

                const currentDpi = parseInt(dpi, 10) || 150;
                const scale = currentDpi / 72; // Assume original is 72 dpi screen default

                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                let quality = 0.9;
                let resizedDataUrl = canvas.toDataURL(file.type, quality);
                let blob = await dataUrlToBlob(resizedDataUrl);

                const targetBytes = (parseFloat(targetSize) || 2) * (targetUnit === 'MB' ? 1024 * 1024 : 1024);
                
                // Iterative resizing to get closer to target size (simple version)
                let iterations = 10;
                while (blob.size > targetBytes && quality > 0.1 && iterations > 0) {
                  quality -= 0.1;
                  resizedDataUrl = canvas.toDataURL(file.type, quality);
                  blob = await dataUrlToBlob(resizedDataUrl);
                  iterations--;
                }

                setResizedImage(resizedDataUrl);
                toast({
                    title: 'Image Resized',
                    description: `Your image has been resized to approximately ${(blob.size / 1024 / 1024).toFixed(2)} MB.`,
                });
            } catch (error) {
                 console.error(error);
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during processing.';
                toast({
                    variant: 'destructive',
                    title: 'Error processing image',
                    description: errorMessage,
                });
            } finally {
                setIsProcessing(false);
            }
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
    if (!resizedImage || !file) return;
    const link = document.createElement('a');
    link.href = resizedImage;
    const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
    const mimeType = resizedImage.split(';')[0].split(':')[1];
    let fileExtension = mimeType ? mimeType.split('/')[1] : 'png';
    if (fileExtension === 'jpeg') fileExtension = 'jpg';
    
    link.download = `desized-${originalName}.${fileExtension}`;
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
              <div className="space-y-2">
                <Label htmlFor="quality">Quality (DPI)</Label>
                <Input id="quality" value={dpi} onChange={(e) => setDpi(e.target.value)} placeholder="e.g., 150" type="number" disabled={!file || isProcessing} />
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
