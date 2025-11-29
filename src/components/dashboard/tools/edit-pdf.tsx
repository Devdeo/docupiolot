'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function EditPdf({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload PDF to Edit</CardTitle>
          <CardDescription>Our editor is currently in beta. Basic text and image editing is supported.</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <FileUpload onFileSelect={setFile} acceptedFileTypes={['application/pdf']} />
          ) : (
            <div className="w-full aspect-[4/5] bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-medium">
              <p>PDF Editor Interface Placeholder</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={!file}>
            Save PDF
          </Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
