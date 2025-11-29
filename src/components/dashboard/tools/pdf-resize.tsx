'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function PdfResize({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [resizedPdf, setResizedPdf] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetSize, setTargetSize] = useState('2');
  const [targetUnit, setTargetUnit] = useState('MB');
  const [dpi, setDpi] = useState('144');
  const [outputFilename, setOutputFilename] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
      setOutputFilename(`desized-${originalName}`);
    }
  }, [file]);

  const handleResize = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a PDF to resize.',
      });
      return;
    }

    setIsProcessing(true);
    setResizedPdf(null);

    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      
      const form = pdfDoc.getForm();
      try {
        form.flatten();
      } catch (error) {
        console.warn("Could not flatten form. It might not exist or have issues.", error);
      }

      const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

      setResizedPdf(pdfBytes);
      toast({
          title: 'PDF Processed',
          description: `Your PDF has been re-processed. New size is ${(pdfBytes.length / 1024 / 1024).toFixed(2)} MB.`,
      });

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error processing PDF',
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resizedPdf || !file) return;
    const blob = new Blob([resizedPdf], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${outputFilename || `desized-${file.name.substring(0, file.name.lastIndexOf('.'))}`}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setFile(null);
    setResizedPdf(null);
  };

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload Your PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <FileUpload onFileSelect={(f) => { setFile(f); setResizedPdf(null); }} acceptedFileTypes={['application/pdf']} />
          ) : (
             <div className="flex flex-col items-center gap-4 text-center">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p>Processing: {file?.name}</p>
                  </>
                ) : null }
                {resizedPdf && !isProcessing && (
                  <div className="w-full space-y-4 rounded-md border p-4">
                      <h3 className="font-medium text-center">Download Your Resized PDF</h3>
                       <div className="space-y-2">
                            <Label htmlFor="filename">Filename</Label>
                            <Input id="filename" value={outputFilename} onChange={(e) => setOutputFilename(e.target.value)} />
                        </div>
                      <Button onClick={handleDownload} className="w-full">Download Resized PDF</Button>
                  </div>
                )}
             </div>
          )}

          <div className="space-y-4">
            <h3 className="font-medium">Compression Options</h3>
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
                <Input id="quality" value={dpi} onChange={e => setDpi(e.target.value)} placeholder="e.g., 144" type="number" disabled={!file || isProcessing} />
                <p className="text-xs text-muted-foreground">Lower DPI may reduce file size for PDFs with images. This is a best-effort compression.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" size="lg" onClick={handleResize} disabled={!file || isProcessing}>
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing...</> : 'Compress PDF'}
          </Button>
          <Button variant="outline" className="w-full" size="lg" onClick={handleClear} disabled={isProcessing}>Clear</Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
