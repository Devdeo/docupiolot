'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';

interface ToolProps {
  onBack: () => void;
  title: string;
}

const acceptedTypes = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'image/vnd.adobe.photoshop', // .psd
  'image/jpeg',
  'image/png',
  '.docx',
  '.xlsx',
  '.pptx',
  '.psd'
];

export function ConvertToPdf({ onBack, title }: ToolProps) {
  const [file, setFile] =useState<File | null>(null);
  
  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload Document to Convert to PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={acceptedTypes} />
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={!file}>
            Convert to PDF
          </Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
