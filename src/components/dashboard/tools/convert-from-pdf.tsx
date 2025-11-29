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
import { fileToDataUrl } from '@/lib/image-utils';
import { convertFromPdf } from '@/ai/flows/convert-from-pdf';
import JSZip from 'jszip';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function ConvertFromPdf({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>('jpg');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<string[] | null>(null);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!file || !format) {
      toast({ variant: 'destructive', title: 'Please select a file and format.' });
      return;
    }
    if (format !== 'jpg') {
        toast({ variant: 'destructive', title: 'Coming Soon!', description: `Conversion to ${format.toUpperCase()} is not yet supported.` });
        return;
    }

    setIsConverting(true);
    setConvertedImages(null);
    try {
      const pdfDataUrl = await fileToDataUrl(file);
      const result = await convertFromPdf({
        pdfDataUri: pdfDataUrl,
        outputFormat: format,
      });

      if (result.images && result.images.length > 0) {
        setConvertedImages(result.images);
        toast({
          title: 'Conversion Successful',
          description: `Your PDF has been converted into ${result.images.length} JPG image(s).`,
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
  
  const handleDownload = async () => {
    if (!convertedImages || convertedImages.length === 0) return;

    const zip = new JSZip();
    convertedImages.forEach((dataUrl, index) => {
      const imageData = dataUrl.split(',')[1];
      zip.file(`page-${index + 1}.jpg`, imageData, { base64: true });
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    const originalName = file?.name.replace(/\.pdf$/i, '') || 'converted';
    link.download = `${originalName}-jpgs.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleClear = () => {
    setFile(null);
    setConvertedImages(null);
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload PDF to Convert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <FileUpload onFileSelect={setFile} acceptedFileTypes={['application/pdf']} />
          ) : isConverting ? (
             <div className="flex flex-col items-center justify-center gap-4 p-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-muted-foreground">Converting to {format.toUpperCase()}, please wait...</p>
             </div>
          ) : convertedImages ? (
             <div className="w-full space-y-4 text-center">
                 <h3 className="text-lg font-medium">Conversion Complete!</h3>
                 <p className="text-muted-foreground">
                    Your PDF was converted into {convertedImages.length} JPG image(s).
                 </p>
                 <Button onClick={handleDownload} className="w-full">Download Images as .zip</Button>
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
                        <SelectItem value="docx">Word (DOCX)</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="pptx">PowerPoint (PPTX)</SelectItem>
                        <SelectItem value="psd">Photoshop (PSD)</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
            {!isConverting && !convertedImages && (
                <Button className="w-full" size="lg" disabled={!file || isConverting} onClick={handleConvert}>
                    {isConverting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Converting...</> : 'Convert PDF'}
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
