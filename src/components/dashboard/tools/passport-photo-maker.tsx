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

export function PassportPhotoMaker({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Create Your Passport Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload onFileSelect={setFile} acceptedFileTypes={['image/jpeg', 'image/png']} />
          
          <div className="space-y-2">
            <Label htmlFor="country">Photo Standards by Country</Label>
            <Select disabled={!file} defaultValue="us">
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States (2x2 inch)</SelectItem>
                <SelectItem value="ca">Canada (50x70 mm)</SelectItem>
                <SelectItem value="uk">United Kingdom (35x45 mm)</SelectItem>
                <SelectItem value="eu">Schengen Area (35x45 mm)</SelectItem>
                <SelectItem value="au">Australia (35x45 mm)</SelectItem>
                <SelectItem value="cn">China (33x48 mm)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={!file}>
            Create Photo
          </Button>
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
