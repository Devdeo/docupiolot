'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
    // Client-side PSD parsing is very complex. For now, we show a "coming soon" message.
    setTimeout(() => {
        toast({
            title: 'Coming Soon!',
            description: 'PSD to PDF conversion is not yet implemented.',
            variant: 'default',
        });
        setIsProcessing(false);
    }, 1000);
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Convert Photoshop to PDF</CardTitle>
          <CardDescription>Upload a PSD file to convert it into a PDF document. This feature is coming soon.</CardDescription>
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
