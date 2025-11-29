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
    toast({
        variant: 'destructive',
        title: 'Coming Soon!',
        description: 'PowerPoint to PDF conversion is not yet supported.',
    });
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Convert PowerPoint to PDF</CardTitle>
          <CardDescription>Upload a PPTX file to convert it into a PDF document.</CardDescription>
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
