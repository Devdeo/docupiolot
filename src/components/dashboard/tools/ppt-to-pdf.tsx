'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface ToolProps {
  onBack: () => void;
  title: string;
}

const acceptedTypes = [
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  '.pptx'
];

export function PptToPdf({ onBack, title }: ToolProps) {
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
        toast({ variant: 'destructive', title: 'Please select a PPTX file.' });
        return;
    }

    setIsProcessing(true);
    toast({ title: 'Conversion Started', description: 'Your PPTX is being converted to PDF.' });
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      const presXml = await zip.file('ppt/presentation.xml')?.async('string');
      if (!presXml) throw new Error('presentation.xml not found.');

      const parser = new DOMParser();
      const presDoc = parser.parseFromString(presXml, "application/xml");
      const slideIdNodes = presDoc.getElementsByTagName("p:sldId");

      const slideRelationshipsXml = await zip.file('ppt/_rels/presentation.xml.rels')?.async('string');
      if (!slideRelationshipsXml) throw new Error('presentation.xml.rels not found.');
      const relsDoc = parser.parseFromString(slideRelationshipsXml, "application/xml");
      const relationships = relsDoc.getElementsByTagName('Relationship');
      
      const slideIdToTargetMap = new Map<string, string>();
      for(let i = 0; i < relationships.length; i++) {
        const rel = relationships[i];
        const id = rel.getAttribute('Id');
        const target = rel.getAttribute('Target');
        if (id && target) {
          slideIdToTargetMap.set(id, target);
        }
      }

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (let i = 0; i < slideIdNodes.length; i++) {
          const sldIdRel = slideIdNodes[i].getAttribute('r:id');
          if (!sldIdRel) continue;

          const slideTarget = slideIdToTargetMap.get(sldIdRel);
          if (!slideTarget) continue;
          
          const slideXmlPath = `ppt/${slideTarget}`;
          const slideXml = await zip.file(slideXmlPath)?.async('string');
          if (!slideXml) continue;
          
          const page = pdfDoc.addPage();
          const { width, height } = page.getSize();
          let y = height - 50;

          const slideDoc = parser.parseFromString(slideXml, "application/xml");
          const textNodes = slideDoc.getElementsByTagName('a:t');

          for(let j = 0; j < textNodes.length; j++) {
              const text = textNodes[j].textContent;
              if (text) {
                  page.drawText(text, {
                      x: 50,
                      y,
                      font,
                      size: 12,
                      color: rgb(0, 0, 0),
                      maxWidth: width - 100,
                  });
                  y -= 20;

                  if (y < 50) {
                    y = height - 50; // crude overflow handling
                  }
              }
          }
      }

      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const originalName = file.name.replace(/\.pptx$/i, '') || 'presentation';
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
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred. Text extraction failed.";
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
          <CardTitle>Convert PowerPoint to PDF</CardTitle>
          <CardDescription>Upload a PPTX file to convert it into a PDF document. This tool focuses on extracting text content.</CardDescription>
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
