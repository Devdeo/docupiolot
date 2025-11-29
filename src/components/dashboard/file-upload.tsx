'use client';

import { useState, useCallback, useMemo } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxSize?: number; // in bytes
  multiple?: boolean;
}

export function FileUpload({
  onFileSelect,
  acceptedFileTypes = [],
  maxSize,
  multiple = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const acceptedTypesString = useMemo(() => {
    if (acceptedFileTypes.length === 0) return 'any file';
    return acceptedFileTypes.join(', ');
  }, [acceptedFileTypes]);

  const handleFileChange = useCallback(
    (selectedFiles: FileList | null) => {
      setError(null);
      if (selectedFiles && selectedFiles.length > 0) {
        const filesArray = Array.from(selectedFiles);
        const validFiles: File[] = [];
        const newFileNames: string[] = [];

        for (const file of filesArray) {
          if (maxSize && file.size > maxSize) {
            setError(`File ${file.name} is too large. Max size is ${maxSize / 1024 / 1024}MB.`);
            // Don't process any files if one is invalid for simplicity
            onFileSelect([]);
            setFileNames([]);
            return;
          }
          if (
            acceptedFileTypes.length > 0 &&
            !acceptedFileTypes.includes(file.type) &&
            !acceptedFileTypes.some((type) => file.name.endsWith(type))
          ) {
            setError(
              `File type for ${file.name} is invalid. Accepted types: ${acceptedTypesString}.`
            );
            onFileSelect([]);
            setFileNames([]);
            return;
          }
          validFiles.push(file);
          newFileNames.push(file.name);
        }
        
        onFileSelect(validFiles);
        if (multiple) {
          setFileNames(prev => [...prev, ...newFileNames]);
        } else {
          setFileNames(newFileNames);
        }
      } else {
        onFileSelect([]);
        setFileNames([]);
      }
    },
    [acceptedFileTypes, acceptedTypesString, maxSize, onFileSelect, multiple]
  );
  
  const clearSelection = () => {
    onFileSelect([]);
    setFileNames([]);
  }

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
      handleFileChange(files);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files);
    }
  };

  const displayedFileName = useMemo(() => {
    if (fileNames.length === 0) return 'Drag & drop your file(s) here';
    if (fileNames.length === 1) return fileNames[0];
    return `${fileNames.length} files selected`;
  }, [fileNames]);

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload-input"
        className={cn(
          'relative block w-full rounded-lg border-2 border-dashed border-border p-8 text-center cursor-pointer transition-colors duration-200',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'hover:border-primary/50 hover:bg-primary/5'
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">
            {displayedFileName}
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
          multiple={multiple}
        />
      </label>
      {fileNames.length > 0 && !multiple && (
        <div className="mt-4 text-center">
          <Button variant="link" size="sm" onClick={clearSelection}>
            Clear
          </Button>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-center text-destructive">{error}</p>
      )}
    </div>
  );
}
