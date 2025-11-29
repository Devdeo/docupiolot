'use client';

import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface ToolProps {
  onBack: () => void;
  title: string;
}

type Position =
  | 'top-left' | 'top-center' | 'top-right'
  | 'middle-left' | 'middle-center' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export default function PdfStamperClient({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Page numbering state
  const [numberPosition, setNumberPosition] = useState<Position>('bottom-center');
  const [numberStart, setNumberStart] = useState('1');
  const [numberFormat, setNumberFormat] = useState('{page}/{total}');

  // Watermark state
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkPosition, setWatermarkPosition] = useState<Position>('middle-center');
  const [watermarkFontSize, setWatermarkFontSize] = useState('72');
  const [watermarkOpacity, setWatermarkOpacity] = useState([0.3]);

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
  };

  const handleClear = () => {
    setFile(null);
    setIsProcessing(false);
  };

  const handleApply = async (mode: 'numbering' | 'watermark') => {
    if (!file) {
      toast({ variant: 'destructive', title: 'Please select a PDF file.' });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Processing Started', description: `Applying ${mode === 'numbering' ? 'page numbers' : 'watermark'}...` });

    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const firstPage = parseInt(numberStart) || 1;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        
        if (mode === 'numbering') {
          if (i >= firstPage - 1) {
            const pageNumText = numberFormat
              .replace('{page}', String(i + 1))
              .replace('{total}', String(pages.length));
            
            const textWidth = font.widthOfTextAtSize(pageNumText, 12);
            const textHeight = font.heightAtSize(12);
            
            const pos = getPosition(numberPosition, width, height, textWidth, textHeight, 20);
            
            page.drawText(pageNumText, {
              x: pos.x,
              y: pos.y,
              font,
              size: 12,
              color: rgb(0, 0, 0),
            });
          }
        } else if (mode === 'watermark') {
            const fontSize = parseInt(watermarkFontSize) || 72;
            const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
            const textHeight = font.heightAtSize(fontSize);
            
            const pos = getPosition(watermarkPosition, width, height, textWidth, textHeight, 0);

            page.drawText(watermarkText, {
              x: pos.x,
              y: pos.y,
              font,
              size: fontSize,
              color: rgb(0, 0, 0),
              opacity: watermarkOpacity[0],
              rotate: degrees(-45),
            });
        }
      }

      const pdfBytes = await pdfDoc.save();
      downloadPdf(pdfBytes, `${mode}-applied-${file.name}`);
      toast({ title: 'Success', description: `Your PDF has been updated and downloaded.` });

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ variant: 'destructive', title: 'Operation Failed', description: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getPosition = (position: Position, pageWidth: number, pageHeight: number, textWidth: number, textHeight: number, margin: number) => {
      let x = 0, y = 0;
      
      // Vertical alignment
      if (position.startsWith('top-')) y = pageHeight - textHeight - margin;
      else if (position.startsWith('middle-')) y = (pageHeight - textHeight) / 2;
      else y = margin;
      
      // Horizontal alignment
      if (position.endsWith('-left')) x = margin;
      else if (position.endsWith('-center')) x = (pageWidth - textWidth) / 2;
      else x = pageWidth - textWidth - margin;
      
      return { x, y };
  }

  const downloadPdf = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Stamp PDF</CardTitle>
          <CardDescription>Add page numbers or a watermark to your PDF document.</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['application/pdf']} />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md text-center">
              <p className="font-medium mb-2">{file.name}</p>
              {isProcessing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
        {file && !isProcessing && (
          <Tabs defaultValue="numbering" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="numbering">Page Numbers</TabsTrigger>
              <TabsTrigger value="watermark">Watermark</TabsTrigger>
            </TabsList>
            <TabsContent value="numbering">
              <Card>
                <CardHeader>
                  <CardTitle>Add Page Numbers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="number-pos">Position</Label>
                    <Select value={numberPosition} onValueChange={(v) => setNumberPosition(v as Position)}>
                      <SelectTrigger id="number-pos"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-center">Top Center</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-center">Bottom Center</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number-format">Format</Label>
                    <Input id="number-format" value={numberFormat} onChange={(e) => setNumberFormat(e.target.value)} />
                    <p className="text-xs text-muted-foreground">Use {'{page}'} for current page and {'{total}'} for total pages.</p>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="number-start">Start numbering from page</Label>
                    <Input id="number-start" type="number" value={numberStart} onChange={(e) => setNumberStart(e.target.value)} min="1" />
                  </div>
                </CardContent>
                <CardFooter>
                   <Button className="w-full" size="lg" disabled={!file || isProcessing} onClick={() => handleApply('numbering')}>
                    Add Page Numbers
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="watermark">
              <Card>
                <CardHeader>
                  <CardTitle>Add Watermark</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="watermark-text">Text</Label>
                    <Input id="watermark-text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="watermark-pos">Position</Label>
                     <Select value={watermarkPosition} onValueChange={(v) => setWatermarkPosition(v as Position)}>
                      <SelectTrigger id="watermark-pos"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-center">Top Center</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="middle-left">Middle Left</SelectItem>
                        <SelectItem value="middle-center">Middle Center</SelectItem>
                        <SelectItem value="middle-right">Middle Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-center">Bottom Center</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="watermark-size">Font Size</Label>
                    <Input id="watermark-size" type="number" value={watermarkFontSize} onChange={(e) => setWatermarkFontSize(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Opacity</Label>
                    <Slider value={watermarkOpacity} onValueChange={setWatermarkOpacity} max={1} step={0.05} />
                    <p className="text-xs text-center text-muted-foreground">{Math.round(watermarkOpacity[0] * 100)}%</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" disabled={!file || isProcessing} onClick={() => handleApply('watermark')}>
                    Add Watermark
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        <CardFooter>
          {file && (
            <Button variant="outline" className="w-full mt-4" onClick={handleClear} disabled={isProcessing}>
              Start Over
            </Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
