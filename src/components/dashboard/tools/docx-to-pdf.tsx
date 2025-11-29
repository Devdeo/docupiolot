'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
  }

  const handleConvert = () => {
    if (!file) return;
    toast({
        title: 'Coming Soon!',
        description: 'Conversion from DOCX to PDF is not yet implemented.',
    });
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Convert Word to PDF</CardTitle>
          <CardDescription>Upload a DOCX file to convert it into a PDF document.</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={acceptedTypes} />
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={!file} onClick={handleConvert}>
            Convert to PDF
          </Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
