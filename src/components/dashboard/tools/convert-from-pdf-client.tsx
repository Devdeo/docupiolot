'use client';
import { useState, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface ToolProps {
  onBack: () => void;
  title: string;
  defaultFormat?: string;
}

type ConvertedFile = {
    filename: string;
    data: string; // base64
    mimeType: string;
};

export default function ConvertFromPdfClient({ onBack, title, defaultFormat = 'jpg' }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>(defaultFormat);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<string[] | null>(null);
  const [convertedFileData, setConvertedFileData] = useState<ConvertedFile | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
    setConvertedImages(null);
    setConvertedFileData(null);
    setIsConverting(false);
  }

  const handleClear = () => {
    setFile(null);
    setConvertedImages(null);
    setConvertedFileData(null);
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
    } else if (convertedFileData) {
        // Handle single file download (docx, xlsx)
        const link = document.createElement('a');
        link.href = `data:${convertedFileData.mimeType};base64,${convertedFileData.data}`;
        link.download = convertedFileData.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };


  const handleConvert = async () => {
    if (!file) {
      toast({ variant: 'destructive', title: 'Please select a file.' });
      return;
    }
    
    setIsConverting(true);
    setConvertedImages(null);
    setConvertedFileData(null);
    
    try {
        if (format === 'jpg') {
            await handleJpgConversion();
        } else if (format === 'docx') {
            await handleDocxConversion();
        }
        else {
             toast({ variant: 'destructive', title: 'Coming Soon!', description: `Conversion to ${format.toUpperCase()} is not yet supported.` });
             setIsConverting(false);
        }
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
            variant: 'destructive',
            title: 'Conversion Failed',
            description: errorMessage,
        });
        setIsConverting(false);
    }
  };

  const handleDocxConversion = async () => {
    if (!file) return;

    const pdfjs = await import('pdfjs-dist/build/pdf');
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    const pageCount = pdf.numPages;
    const paragraphs: Paragraph[] = [];

    for (let i = 0; i < pageCount; i++) {
        const page = await pdf.getPage(i + 1);
        const textContent = await page.getTextContent();
        
        textContent.items.forEach((item: any) => {
             paragraphs.push(new Paragraph({
                children: [new TextRun(item.str)],
            }));
        });
        // Add a paragraph break after each page's content
        paragraphs.push(new Paragraph({ children: [] }));
    }
    await pdf.destroy();

    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });
    
    const docxBlob = await Packer.toBlob(doc);
    const reader = new FileReader();
    reader.readAsDataURL(docxBlob);
    reader.onload = () => {
        const base64data = (reader.result as string).split(',')[1];
        setConvertedFileData({
            filename: `${file.name.replace(/\.pdf$/i, '')}.docx`,
            data: base64data,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        toast({
            title: 'Conversion Successful',
            description: `Your PDF has been converted into a DOCX file.`,
        });
        setIsConverting(false);
    }
  }
  
  const handleJpgConversion = async () => {
    if (!file) return;

    const pdfjs = await import('pdfjs-dist/build/pdf');
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

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
     setIsConverting(false);
  };

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload PDF to Convert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['application/pdf']} />
          ) : isConverting ? (
             <div className="flex flex-col items-center justify-center gap-4 p-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-muted-foreground">Converting to {format.toUpperCase()}, please wait...</p>
             </div>
          ) : (convertedImages || convertedFileData) ? (
             <div className="w-full space-y-4 text-center">
                 <h3 className="text-lg font-medium">Conversion Complete!</h3>
                 <p className="text-muted-foreground">
                    {convertedImages ? `Your PDF was converted into ${convertedImages.length} JPG image(s).`
                     : `Your PDF was converted into a ${format.toUpperCase()} file.`
                    }
                 </p>
                 <Button onClick={handleDownload} className="w-full">
                    {convertedImages ? "Download Images as .zip" : `Download ${convertedFileData?.filename}`}
                 </Button>
             </div>
          ) : (
            <div className="w-full space-y-4">
                 <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                    <p className="font-medium">{file.name}</p>
                 </div>
                <div className="space-y-2">
                    <Label htmlFor="format">Convert to</Label>
                    <Select value={format} onValueChange={setFormat} disabled={!file || !!defaultFormat}>
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
            {!isConverting && !(convertedImages || convertedFileData) && (
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
