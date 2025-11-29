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

export function ImageConverter({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload Image to Convert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload onFileSelect={setFile} acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']} />
          
          <div className="space-y-2">
            <Label htmlFor="format">Convert to</Label>
            <Select disabled={!file}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WEBP</SelectItem>
                <SelectItem value="gif">GIF</SelectItem>
                <SelectItem value="bmp">BMP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={!file}>
            Convert Image
          </Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
