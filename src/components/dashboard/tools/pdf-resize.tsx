'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function PdfResize({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload Your PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload onFileSelect={setFile} acceptedFileTypes={['application/pdf']} />
          
          <div className="space-y-4">
            <h3 className="font-medium">Resize Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="size">Target Size</Label>
                <div className="flex gap-2">
                    <Input id="size" placeholder="e.g., 5" type="number" className="w-full" disabled={!file}/>
                    <Select defaultValue="MB" disabled={!file}>
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
                <Input id="quality" placeholder="e.g., 144" type="number" defaultValue="144" disabled={!file} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={!file}>
            Resize PDF
          </Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
