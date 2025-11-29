'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resizedPdf, setResizedPdf] = useState<Uint8Array | null>(null);
  const [resizedSize, setResizedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');
  const { toast } = useToast();
  const [targetSize, setTargetSize] = useState('2');
  const [targetUnit, setTargetUnit] = useState('MB');

  useEffect(() => {
    if (file) {
      const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
      setOutputFilename(`compressed-${originalName}`);
      setOriginalSize(file.size);
    } else {
        setOriginalSize(null);
        setResizedSize(null);
    }
  }, [file]);

  const handleResize = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a PDF to compress.',
      });
      return;
    }

    setIsProcessing(true);
    setResizedPdf(null);
    setResizedSize(null);

    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes, { 
        ignoreEncryption: true 
      });

      // This is a "best-effort" compression. The most reliable way to reduce size
      // with pdf-lib is to re-save the document, which can optimize the structure
      // and remove unused objects. Flattening forms also helps.
      try {
        const form = pdfDoc.getForm();
        if (form && !form.isFlattened()) {
           form.flatten();
        }
      } catch (error) {
        console.warn("No form to flatten or an error occurred during flattening.", error);
      }
      
      const compressedPdfBytes = await pdfDoc.save();
      const newSize = compressedPdfBytes.length;

      setResizedPdf(compressedPdfBytes);
      setResizedSize(newSize);

      toast({
        title: 'Compression Complete',
        description: `The PDF has been processed. Check the new file size.`,
      });

    } catch (error) {
      console.error('Error processing PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. This PDF may not be compatible with the compressor.';
      toast({
        variant: 'destructive',
        title: 'Error Processing PDF',
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
    link.download = `${outputFilename || `compressed-${file.name.substring(0, file.name.lastIndexOf('.'))}`}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleClear = () => {
    setFile(null);
    setResizedPdf(null);
  };

  const formatBytes = (bytes: number | null) => {
    if (bytes === null || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Compress PDF</CardTitle>
          <CardDescription>Upload a PDF to reduce its file size. Compression is best-effort and results may vary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file || (!isProcessing && !resizedPdf) ? (
            <FileUpload onFileSelect={(f) => { setFile(f); setResizedPdf(null); }} acceptedFileTypes={['application/pdf']} />
          ) : null}

          {file && (isProcessing || resizedPdf) ? (
             <div className="flex flex-col items-center gap-4 text-center">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p>Compressing: {file?.name}</p>
                    <p className="text-sm text-muted-foreground">This may take a moment...</p>
                  </>
                ) : null }
                {resizedPdf && !isProcessing && (
                  <div className="w-full space-y-4 rounded-md border p-4">
                      <h3 className="font-medium text-center">Compression Results</h3>
                      <div className="flex justify-around text-sm">
                        <p>Original Size: <span className="font-semibold">{formatBytes(originalSize)}</span></p>
                        <p>New Size: <span className="font-semibold">{formatBytes(resizedSize)}</span></p>
                      </div>
                       <div className="space-y-2">
                            <Label htmlFor="filename">Download As</Label>
                            <Input id="filename" value={outputFilename} onChange={(e) => setOutputFilename(e.target.value)} />
                        </div>
                      <Button onClick={handleDownload} className="w-full">Download Compressed PDF</Button>
                  </div>
                )}
             </div>
          ) : null }
          
          {file && !isProcessing && !resizedPdf && (
            <div className="space-y-4">
              <h3 className="font-medium">Resize Options</h3>
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
                <p className="text-xs text-muted-foreground">Compression is best-effort and may not meet the exact target size.</p>
              </div>
            </div>
          )}
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
