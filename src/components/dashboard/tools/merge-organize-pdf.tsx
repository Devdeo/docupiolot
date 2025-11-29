'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { Trash2 } from 'lucide-react';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function MergeOrganizePdf({ onBack, title }: ToolProps) {
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [deleteFile, setDeleteFile] = useState<File | null>(null);
  const [combineFiles, setCombineFiles] = useState<File[]>([]);

  const handleMergeFiles = (files: File[]) => {
    setMergeFiles(f => [...f, ...files]);
  };
  
  const handleDeleteFile = (files: File[]) => {
    setDeleteFile(files[0] || null);
  }

  const handleCombineFiles = (files: File[]) => {
    setCombineFiles(f => [...f, ...files]);
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Tabs defaultValue="merge" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
          <TabsTrigger value="delete">Delete Pages</TabsTrigger>
          <TabsTrigger value="combine">Add Images</TabsTrigger>
        </TabsList>
        <TabsContent value="merge">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Merge PDFs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Upload multiple PDFs to combine them into one file.</p>
              <FileUpload onFileSelect={handleMergeFiles} acceptedFileTypes={['application/pdf']} multiple={true} />
              {mergeFiles.length > 0 && 
                <div className="space-y-2">
                  <h4 className="font-medium">Files to merge:</h4>
                  <ul className="space-y-2">
                    {mergeFiles.map((f, i) => (
                      <li key={i} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                        <span>{f.name}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setMergeFiles(files => files.filter((_, idx) => idx !== i))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" disabled={mergeFiles.length < 2}>
                Merge {mergeFiles.length} PDFs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="delete">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Delete Pages from PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FileUpload onFileSelect={handleDeleteFile} acceptedFileTypes={['application/pdf']} />
                <div className="space-y-2">
                    <Label htmlFor="pages">Pages to delete</Label>
                    <Input id="pages" placeholder="e.g., 2, 5-7, 10" disabled={!deleteFile} />
                    <p className="text-xs text-muted-foreground">Enter page numbers or ranges, separated by commas.</p>
                </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" disabled={!deleteFile}>
                Remove Pages
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="combine">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Merge Images and PDFs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Upload images and PDFs to combine them into a single PDF.</p>
              <FileUpload onFileSelect={handleCombineFiles} acceptedFileTypes={['application/pdf', 'image/jpeg', 'image/png']} multiple={true} />
              {combineFiles.length > 0 && 
                <div className="space-y-2">
                  <h4 className="font-medium">Files to combine:</h4>
                  <ul className="space-y-2">
                    {combineFiles.map((f, i) => (
                      <li key={i} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                        <span>{f.name}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCombineFiles(files => files.filter((_, idx) => idx !== i))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" disabled={combineFiles.length < 2}>
                Combine to PDF
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolContainer>
  );
}
