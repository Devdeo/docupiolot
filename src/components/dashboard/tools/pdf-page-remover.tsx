'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function PdfPageRemover({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pagesToDelete, setPagesToDelete] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
  };

  const handleClear = () => {
    setFile(null);
    setPagesToDelete('');
    setIsProcessing(false);
  };

  const handleRemovePages = async () => {
    if (!file) {
      toast({ variant: 'destructive', title: 'Please select a PDF file.' });
      return;
    }
    if (!pagesToDelete.trim()) {
      toast({ variant: 'destructive', title: 'Please specify pages to delete.' });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Processing PDF', description: 'Removing specified pages...' });

    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pageCount = pdfDoc.getPageCount();

      const pageIndicesToRemove = new Set<number>();
      const ranges = pagesToDelete.split(',').map(s => s.trim());

      for (const range of ranges) {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(s => parseInt(s.trim(), 10));
          if (!isNaN(start) && !isNaN(end) && start <= end) {
            for (let i = start; i <= end; i++) {
              if (i > 0 && i <= pageCount) {
                pageIndicesToRemove.add(i - 1);
              }
            }
          }
        } else {
          const pageNum = parseInt(range, 10);
          if (!isNaN(pageNum) && pageNum > 0 && pageNum <= pageCount) {
            pageIndicesToRemove.add(pageNum - 1);
          }
        }
      }

      const sortedIndices = Array.from(pageIndicesToRemove).sort((a, b) => b - a);

      if (sortedIndices.length === 0) {
        throw new Error('No valid pages selected to remove.');
      }
      
      if (sortedIndices.length >= pageCount) {
        throw new Error('Cannot remove all pages from the document.');
      }

      for (const index of sortedIndices) {
        pdfDoc.removePage(index);
      }

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const originalName = file.name.replace(/\.pdf$/i, '') || 'document';
      link.download = `${originalName}-modified.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
        title: 'Pages Removed Successfully',
        description: `Removed ${sortedIndices.length} page(s). Your new PDF has been downloaded.`,
      });
      handleClear();
      
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Remove Pages from PDF</CardTitle>
          <CardDescription>Upload a PDF file and specify which pages to delete.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['application/pdf']} />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md text-center">
              <p className="font-medium mb-2">{file.name}</p>
              {isProcessing ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                 <div className="w-full space-y-2 text-left">
                    <Label htmlFor="pages">Pages to delete</Label>
                    <Input 
                      id="pages" 
                      placeholder="e.g., 2, 5-7, 10" 
                      value={pagesToDelete}
                      onChange={(e) => setPagesToDelete(e.target.value)}
                      disabled={!file} 
                    />
                    <p className="text-xs text-muted-foreground">Enter page numbers or ranges separated by commas.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" size="lg" disabled={!file || isProcessing || !pagesToDelete} onClick={handleRemovePages}>
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removing Pages...</> : 'Remove Pages & Download'}
          </Button>
          {file && (
            <Button variant="outline" className="w-full" onClick={handleClear} disabled={isProcessing}>
              Start Over
            </Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
