'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function ConvertFromPdf({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload PDF to Convert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload onFileSelect={setFile} acceptedFileTypes={['application/pdf']} />
          
          <div className="space-y-2">
            <Label htmlFor="format">Convert to</Label>
            <Select disabled={!file}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="docx">Word (DOCX)</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                <SelectItem value="pptx">PowerPoint (PPTX)</SelectItem>
                <SelectItem value="psd">Photoshop (PSD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={!file}>
            Convert PDF
          </Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
