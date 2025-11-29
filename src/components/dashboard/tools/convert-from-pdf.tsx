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
import { convertPdf } from '@/ai/flows/pdf-convert-flow';

interface ToolProps {
  onBack: () => void;
  title: string;
}

type ConvertedFile = {
    filename: string;
    data: string; // base64
    mimeType: string;
};

export function ConvertFromPdf({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>('jpg');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
  const [convertedImages, setConvertedImages] = useState<string[] | null>(null);
  const { toast } = useToast();

  const handleClear = () => {
    setFile(null);
    setConvertedImages(null);
    setConvertedFile(null);
    setIsConverting(false);
  }

  const handleDownload = async () => {
    if (convertedImages && convertedImages.length > 0) {
      // Handle JPG zip download
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
    } else if (convertedFile) {
        // Handle single file download (DOCX, XLSX, etc.)
        const link = document.createElement('a');
        link.href = `data:${convertedFile.mimeType};base64,${convertedFile.data}`;
        link.download = convertedFile.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };


  const handleConvert = async () => {
    if (!file || !format) {
      toast({ variant: 'destructive', title: 'Please select a file and format.' });
      return;
    }
    
    if (format === 'psd') {
        toast({ variant: 'destructive', title: 'Coming Soon!', description: `Conversion to PSD is not yet supported.` });
        return;
    }

    setIsConverting(true);
    setConvertedImages(null);
    setConvertedFile(null);
    
    try {
        if (format === 'jpg') {
            await handleJpgConversion();
        } else {
            await handleAiConversion();
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

  const handleJpgConversion = async () => {
    if (!file) return;

    const pdfjs = await import('pdfjs-dist/build/pdf');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL((pdfjsWorker as any).default, import.meta.url).toString();

    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    const pageCount = pdf.numPages;
    const images: string[] = [];

    for (let i = 0; i < pageCount; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 2.0 }); // High scale for better quality

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not create canvas context");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        images.push(canvas.toDataURL('image/jpeg', 0.95)); // High quality JPEG
    }
    await pdf.destroy();

    if (images && images.length > 0) {
      setConvertedImages(images);
      toast({
        title: 'Conversion Successful',
        description: `Your PDF has been converted into ${images.length} JPG image(s).`,
      });
    } else {
      throw new Error('Conversion resulted in no images.');
    }
  };

  const handleAiConversion = async () => {
    if (!file) return;
    
    // 1. Extract text from PDF on the client
    const pdfjs = await import('pdfjs-dist/build/pdf');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL((pdfjsWorker as any).default, import.meta.url).toString();

    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    const pageCount = pdf.numPages;
    let fullText = '';

    for (let i = 0; i < pageCount; i++) {
        const page = await pdf.getPage(i + 1);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
        fullText += pageText + '\n\n';
    }
    await pdf.destroy();

    if (!fullText.trim()) {
        throw new Error("Could not extract any text from the PDF. The document might be image-based.");
    }

    // 2. Call the server-side AI flow
    const result = await convertPdf({
        pdfText: fullText,
        targetFormat: format as 'docx' | 'xlsx' | 'pptx',
    });

    const originalName = file.name.replace(/\.pdf$/i, '') || 'converted';
    const mimeTypes = {
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };

    setConvertedFile({
        filename: `${originalName}.${format}`,
        data: result.base64Data,
        mimeType: mimeTypes[format as keyof typeof mimeTypes],
    });

    toast({
        title: 'Conversion Successful',
        description: `Your PDF has been converted to ${format.toUpperCase()}.`,
    });
  };

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
                <p className="text-sm text-center text-muted-foreground">AI conversions can take up to a minute.</p>
             </div>
          ) : (convertedImages || convertedFile) ? (
             <div className="w-full space-y-4 text-center">
                 <h3 className="text-lg font-medium">Conversion Complete!</h3>
                 <p className="text-muted-foreground">
                    {convertedImages 
                        ? `Your PDF was converted into ${convertedImages.length} JPG image(s).`
                        : `Your PDF was converted to ${format.toUpperCase()}.`
                    }
                 </p>
                 <Button onClick={handleDownload} className="w-full">
                    {convertedImages ? 'Download Images as .zip' : `Download ${convertedFile?.filename}`}
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
            {!isConverting && !(convertedImages || convertedFile) && (
                <Button className="w-full" size="lg" disabled={!file || isConverting} onClick={handleConvert}>
                    Convert PDF
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
