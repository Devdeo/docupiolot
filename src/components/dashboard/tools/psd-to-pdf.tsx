'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface ToolProps {
  onBack: () => void;
  title: string;
}

const acceptedTypes = [
  'image/vnd.adobe.photoshop',
  '.psd'
];

export function PsdToPdf({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
  }

  const handleClear = () => {
    setFile(null);
    setIsProcessing(false);
  }

  const handleConvert = async () => {
    if (!file) {
        toast({ variant: 'destructive', title: 'Please select a PSD file.' });
        return;
    }

    setIsProcessing(true);
    toast({ title: 'Conversion Started', description: 'Your PSD is being converted to PDF.' });

    try {
        // Client-side PSD parsing is very complex.
        // As a placeholder, we'll create a PDF that acknowledges the conversion.
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const text = `File converted: ${file.name}`;
        const textSize = 24;

        page.drawText(text, {
            x: 50,
            y: height - 4 * 50,
            font,
            size: textSize,
            color: rgb(0, 0, 0),
        });
        
        page.drawText('Full PSD rendering is coming soon.', {
          x: 50,
          y: height - 6 * 50,
          font,
          size: 16,
          color: rgb(0.5, 0.5, 0.5),
        });

        const pdfBytes = await pdfDoc.save();
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const originalName = file.name.replace(/\.psd$/i, '') || 'document';
        link.download = `${originalName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        toast({
            title: 'Conversion Successful',
            description: 'A placeholder PDF has been downloaded.',
        });

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            variant: 'destructive',
            title: 'Conversion Failed',
            description: errorMessage
        });
    } finally {
        setIsProcessing(false);
    }
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Convert Photoshop to PDF</CardTitle>
          <CardDescription>Upload a PSD file to convert it into a PDF document. Full rendering support is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={acceptedTypes} />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md text-center">
                <p className="font-medium mb-2">{file.name}</p>
                {isProcessing && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Converting...</span>
                    </div>
                )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" size="lg" disabled={!file || isProcessing} onClick={handleConvert}>
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...</> : 'Convert to PDF'}
          </Button>
          {file && (
             <Button variant="outline" className="w-full" onClick={handleClear} disabled={isProcessing}>Start Over</Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
