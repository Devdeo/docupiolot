'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ToolProps {
  onBack: () => void;
  title: string;
}

type Filter = 'none' | 'grayscale' | 'sepia' | 'invert';

export function ImageEditor({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [filter, setFilter] = useState<Filter>('none');
  
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = image.naturalWidth;
    const h = image.naturalHeight;

    canvas.width = w;
    canvas.height = h;

    ctx.filter = [
        `brightness(${brightness[0]}%)`,
        `contrast(${contrast[0]}%)`,
        `saturate(${saturation[0]}%)`,
        `grayscale(${filter === 'grayscale' ? 1 : 0})`,
        `sepia(${filter === 'sepia' ? 1 : 0})`,
        `invert(${filter === 'invert' ? 1 : 0})`,
    ].join(' ');

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale.x, scale.y);
    ctx.drawImage(image, -w / 2, -h / 2);
    ctx.restore();

  }, [brightness, contrast, saturation, rotation, scale, filter]);

  useEffect(() => {
    if (file && !imageRef.current) {
        setIsProcessing(true);
        const img = new Image();
        img.onload = () => {
            imageRef.current = img;
            drawImage();
            setIsProcessing(false);
        };
        img.onerror = () => {
            toast({ variant: 'destructive', title: 'Error loading image' });
            setIsProcessing(false);
        };
        img.src = URL.createObjectURL(file);
    }
    drawImage();
  }, [file, drawImage, toast]);

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
    // Reset all edits
    imageRef.current = null;
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setRotation(0);
    setScale({ x: 1, y: 1 });
    setFilter('none');
  };

  const handleClear = () => {
    setFile(null);
    imageRef.current = null;
  }
  
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `edited-${file?.name || 'image.png'}`;
    link.href = canvas.toDataURL();
    link.click();
    toast({ title: 'Image Saved', description: 'Your edited image has been downloaded.' });
  }

  const handleReset = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setRotation(0);
    setScale({ x: 1, y: 1 });
    setFilter('none');
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Edit Image</CardTitle>
          <CardDescription>Apply adjustments, filters, and transformations to your image.</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']} />
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading Image...</p>
            </div>
          ) : (
            <div className="space-y-4">
                <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                    <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4 p-4 border rounded-md">
                        <h4 className="font-medium">Adjustments</h4>
                        <div className="space-y-2">
                            <Label>Brightness ({brightness[0]}%)</Label>
                            <Slider value={brightness} onValueChange={setBrightness} max={200} step={1} />
                        </div>
                        <div className="space-y-2">
                            <Label>Contrast ({contrast[0]}%)</Label>
                            <Slider value={contrast} onValueChange={setContrast} max={200} step={1} />
                        </div>
                        <div className="space-y-2">
                            <Label>Saturation ({saturation[0]}%)</Label>
                            <Slider value={saturation} onValueChange={setSaturation} max={200} step={1} />
                        </div>
                    </div>
                    <div className="space-y-4 p-4 border rounded-md">
                        <h4 className="font-medium">Filters & Transform</h4>
                        <div className="space-y-2">
                            <Label>Filter</Label>
                            <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="grayscale">Grayscale</SelectItem>
                                    <SelectItem value="sepia">Sepia</SelectItem>
                                    <SelectItem value="invert">Invert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => setRotation(r => (r + 90) % 360)}><RotateCw className="mr-2 h-4 w-4" /> Rotate</Button>
                            <Button variant="outline" onClick={() => setScale(s => ({ ...s, x: s.x * -1 }))}><FlipHorizontal className="mr-2 h-4 w-4" /> Flip H</Button>
                            <Button variant="outline" onClick={() => setScale(s => ({ ...s, y: s.y * -1 }))}><FlipVertical className="mr-2 h-4 w-4" /> Flip V</Button>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {file && !isProcessing && (
            <>
              <Button className="w-full" size="lg" onClick={handleSave}>Save & Download</Button>
              <div className="flex w-full gap-2">
                <Button variant="outline" className="w-full" onClick={handleReset}>Reset Edits</Button>
                <Button variant="outline" className="w-full" onClick={handleClear}>Start Over</Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
