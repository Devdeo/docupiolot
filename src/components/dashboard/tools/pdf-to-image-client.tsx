'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { useInterstitialAd } from '@/hooks/use-interstitial-ad';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export default function PdfToImageClient({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>('jpg');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<string[] | null>(null);
  const { toast } = useToast();
  const { showAd } = useInterstitialAd();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
    setConvertedImages(null);
    setIsConverting(false);
  }

  const handleClear = () => {
    setFile(null);
    setConvertedImages(null);
    setIsConverting(false);
  }

  const handleDownload = async () => {
    if (convertedImages && convertedImages.length > 0) {
      await showAd();
      const zip = new JSZip();
      convertedImages.forEach((dataUrl, index) => {
        const imageData = dataUrl.split(',')[1];
        zip.file(`page-${index + 1}.${format}`, imageData, { base64: true });
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      const originalName = file?.name.replace(/\.pdf$/i, '') || 'converted';
      link.download = `${originalName}-${format}s.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  };


  const handleConvert = async () => {
    if (!file || !format) {
      toast({ variant: 'destructive', title: 'Please select a file and format.' });
      return;
    }
    
    setIsConverting(true);
    setConvertedImages(null);
    
    try {
        if (!file) return;

        const pdfjs = await import('pdfjs-dist/build/pdf');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

        const pdfData = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
        const pageCount = pdf.numPages;
        const images: string[] = [];
        const mimeType = `image/${format}`;
        const quality = format === 'jpg' ? 0.95 : undefined;


        for (let i = 0; i < pageCount; i++) {
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale: 2.0 }); // High scale for better quality

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) throw new Error("Could not create canvas context");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;

            images.push(canvas.toDataURL(mimeType, quality));
        }
        await pdf.destroy();

        if (images && images.length > 0) {
        setConvertedImages(images);
        toast({
            title: 'Conversion Successful',
            description: `Your PDF has been converted into ${images.length} ${format.toUpperCase()} image(s).`,
        });
        } else {
        throw new Error('Conversion resulted in no images.');
        }

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
            variant: 'destructive',
            title: 'Conversion Failed',
            description: errorMessage,
        });
    } finally {
        setIsConverting(false);
    }
  };


  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload PDF to Convert to Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['application/pdf']} />
          ) : isConverting ? (
             <div className="flex flex-col items-center justify-center gap-4 p-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-muted-foreground">Converting to {format.toUpperCase()}, please wait...</p>
             </div>
          ) : (convertedImages) ? (
             <div className="w-full space-y-4 text-center">
                 <h3 className="text-lg font-medium">Conversion Complete!</h3>
                 <p className="text-muted-foreground">
                    Your PDF was converted into ${convertedImages.length} ${format.toUpperCase()} image(s).
                 </p>
                 <Button onClick={handleDownload} className="w-full">
                    Download Images as .zip
                 </Button>
             </div>
          ) : (
            <div className="w-full space-y-4">
                 <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                    <p className="font-medium">{file.name}</p>
                 </div>
                <div className="space-y-2">
                    <Label htmlFor="format">Convert to</Label>
                    <Select value={format} onValueChange={setFormat} disabled={!file}>
                    <SelectTrigger id="format">
                        <SelectValue placeholder="Select output format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
            {!isConverting && !(convertedImages) && (
                <Button className="w-full" size="lg" disabled={!file || isConverting} onClick={handleConvert}>
                    Convert to Image
                </Button>
            )}
            {file && !isConverting && (
                 <Button variant="outline" className="w-full" onClick={handleClear}>Start Over</Button>
            )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
