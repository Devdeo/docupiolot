'use client';

import { useState, useCallback, useMemo } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedFileTypes?: string[];
  maxSize?: number; // in bytes
}

export function FileUpload({
  onFileSelect,
  acceptedFileTypes = [],
  maxSize, // Removed default
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const acceptedTypesString = useMemo(() => {
    if(acceptedFileTypes.length === 0) return "any file";
    return acceptedFileTypes.join(', ');
  }, [acceptedFileTypes]);

  const handleFileChange = useCallback(
    (selectedFile: File | null) => {
      setError(null);
      if (selectedFile) {
        if (maxSize && selectedFile.size > maxSize) {
          setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB.`);
          setFile(null);
          onFileSelect(null);
          return;
        }
        if (
          acceptedFileTypes.length > 0 &&
          !acceptedFileTypes.includes(selectedFile.type) && !acceptedFileTypes.some(type => selectedFile.name.endsWith(type))
        ) {
          setError(`Invalid file type. Accepted types: ${acceptedTypesString}.`);
          setFile(null);
          onFileSelect(null);
          return;
        }
        setFile(selectedFile);
        onFileSelect(selectedFile);
      } else {
        setFile(null);
        onFileSelect(null);
      }
    },
    [acceptedFileTypes, acceptedTypesString, maxSize, onFileSelect]
  );

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload-input"
        className={cn(
          'relative block w-full rounded-lg border-2 border-dashed border-border p-8 text-center cursor-pointer transition-colors duration-200',
          isDragging ? 'border-primary bg-primary/10' : 'hover:border-primary/50 hover:bg-primary/5'
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">
            {file ? file.name : 'Drag & drop your file here'}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse
          </p>
        </div>
        <input
          id="file-upload-input"
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileInputChange}
          accept={acceptedFileTypes.join(',')}
        />
      </label>
      {file && (
        <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
            <Button variant="link" size="sm" onClick={() => handleFileChange(null)}>Clear</Button>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-center text-destructive">{error}</p>
      )}
    </div>
  );
}
