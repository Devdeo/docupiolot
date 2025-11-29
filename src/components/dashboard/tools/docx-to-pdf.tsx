'use client';
import { useState } from 'react';
import { Packer, Document } from 'docx';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const acceptedTypes = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  '.docx'
];

export function DocxToPdf({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { showAd } = useInterstitialAd();
  
  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
  }

  const handleClear = () => {
    setFile(null);
    setIsProcessing(false);
  }

  const handleConvert = async () => {
    if (!file) {
        toast({ variant: 'destructive', title: 'Please select a DOCX file.' });
        return;
    }

    setIsProcessing(true);
    toast({ title: 'Conversion Started', description: 'Your DOCX is being converted to PDF.' });

    try {
        const arrayBuffer = await file.arrayBuffer();

        // Unzip the docx file
        const zip = await JSZip.loadAsync(arrayBuffer);
        const contentXml = await zip.file('word/document.xml')?.async('string');
        
        if (!contentXml) {
            throw new Error('Could not find document.xml in the DOCX file.');
        }

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;
        const margin = 50;
        let y = height - margin;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(contentXml, "application/xml");
        const paragraphs = xmlDoc.getElementsByTagName("w:p");
        
        for(let i = 0; i < paragraphs.length; i++) {
            const texts = paragraphs[i].getElementsByTagName("w:t");
            let line = '';
            for (let j = 0; j < texts.length; j++) {
                const textContent = texts[j].textContent;
                if(textContent) {
                    line += textContent;
                }
            }

            if (y < margin) {
                // Add a new page if the current one is full
                const newPage = pdfDoc.addPage();
                y = newPage.getSize().height - margin;
                page.drawText('', { x: margin, y, font, size: fontSize }); // Move to new page
            }
            
            page.drawText(line, {
                x: margin,
                y,
                font,
                size: fontSize,
                color: rgb(0, 0, 0),
                maxWidth: width - 2 * margin,
                lineHeight: fontSize * 1.2
            });

            y -= fontSize * 1.2;
        }

        const pdfBytes = await pdfDoc.save();
        
        await showAd();

        // Trigger download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const originalName = file.name.replace(/\.docx$/i, '') || 'document';
        link.download = `${originalName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        toast({
            title: 'Conversion Successful',
            description: 'Your PDF has been downloaded.',
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
          <CardTitle>Convert Word to PDF</CardTitle>
          <CardDescription>Upload a DOCX file to convert it into a PDF document.</CardDescription>
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
