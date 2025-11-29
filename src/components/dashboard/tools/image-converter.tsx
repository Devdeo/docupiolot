'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useInterstitialAd } from '@/hooks/use-interstitial-ad';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function ImageConverter({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { showAd } = useInterstitialAd();
  
  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
    setConvertedImage(null);
  };

  const handleClear = () => {
    setFile(null);
    setConvertedImage(null);
    setIsConverting(false);
  };

  const handleConvert = useCallback(async () => {
    if (!file) {
      toast({ variant: 'destructive', title: 'Please select a file first.' });
      return;
    }
    setIsConverting(true);
    setConvertedImage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }
          ctx.drawImage(img, 0, 0);
          
          const mimeType = `image/${outputFormat}`;
          const dataUrl = canvas.toDataURL(mimeType, outputFormat === 'jpeg' ? 0.95 : undefined);
          
          setConvertedImage(dataUrl);
          toast({ title: 'Conversion Successful', description: `Your image has been converted to ${outputFormat.toUpperCase()}.` });
          setIsConverting(false);
        };
        img.onerror = () => {
            throw new Error('Failed to load image for conversion.');
        }
        img.src = e.target?.result as string;
      };
      reader.onerror = (error) => {
        throw error;
      }
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: 'Conversion Failed', description: errorMessage });
        setIsConverting(false);
    }
  }, [file, outputFormat, toast]);

  const handleDownload = () => {
    if (!convertedImage || !file) return;

    showAd().then(() => {
        const link = document.createElement('a');
        link.href = convertedImage;
        const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
        link.download = `${originalName}.${outputFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
  };

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Image Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']} />
          ) : isConverting ? (
             <div className="flex flex-col items-center justify-center gap-4 p-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-muted-foreground">Converting to {outputFormat.toUpperCase()}, please wait...</p>
             </div>
          ) : convertedImage ? (
             <div className="w-full space-y-4 text-center">
                 <h3 className="text-lg font-medium">Conversion Complete!</h3>
                 <div className="relative w-full max-w-sm mx-auto aspect-video bg-muted rounded-md overflow-hidden">
                    <Image src={convertedImage} alt="Converted image preview" fill className="object-contain" />
                 </div>
                 <Button onClick={handleDownload} className="w-full">
                    Download as .{outputFormat}
                 </Button>
             </div>
          ) : (
             <div className="w-full space-y-4">
                 <div className="relative w-full max-w-sm mx-auto aspect-video bg-muted rounded-md overflow-hidden">
                    <Image src={URL.createObjectURL(file)} alt="Original image preview" fill className="object-contain" />
                 </div>
                <div className="space-y-2">
                    <Label htmlFor="format">Convert to</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat} disabled={!file}>
                    <SelectTrigger id="format">
                        <SelectValue placeholder="Select output format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="jpeg">JPG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WEBP</SelectItem>
                        <SelectItem value="gif">GIF</SelectItem>
                        <SelectItem value="bmp">BMP</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
           {file && !isConverting && !convertedImage && (
             <Button className="w-full" size="lg" onClick={handleConvert}>
                Convert Image
             </Button>
           )}
          {file && (
             <Button variant="outline" className="w-full" onClick={handleClear} disabled={isConverting}>
                Start Over
             </Button>
           )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
