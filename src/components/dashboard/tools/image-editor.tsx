'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RotateCw, FlipHorizontal, FlipVertical, Crop, AspectRatio } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

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

  // Editing state
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [filter, setFilter] = useState<Filter>('none');
  const [activeTab, setActiveTab] = useState('adjust');

  // Resize state
  const [targetWidth, setTargetWidth] = useState('');
  const [targetHeight, setTargetHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  // Crop state
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [dragging, setDragging] = useState<'pan' | 'resize' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const getCanvasContext = () => canvasRef.current?.getContext('2d');

  const drawImage = useCallback(() => {
    const ctx = getCanvasContext();
    const image = imageRef.current;
    if (!ctx || !image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const w = parseInt(targetWidth) || image.naturalWidth;
    const h = parseInt(targetHeight) || image.naturalHeight;

    canvas.width = w;
    canvas.height = h;
    
    ctx.clearRect(0, 0, w, h);

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
    ctx.drawImage(image, -w / 2, -h / 2, w, h);
    ctx.restore();

    if (isCropping) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.rect(crop.x, crop.y, crop.width, crop.height);
        ctx.fill('evenodd');

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
        
        const handleSize = 8;
        ctx.fillStyle = 'white';
        const handles = {
            'top-left': [crop.x, crop.y],
            'top-right': [crop.x + crop.width, crop.y],
            'bottom-left': [crop.x, crop.y + crop.height],
            'bottom-right': [crop.x + crop.width, crop.y + crop.height],
        };
        Object.values(handles).forEach(([hx, hy]) => {
            ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
        });
        ctx.restore();
    }

  }, [brightness, contrast, saturation, rotation, scale, filter, targetWidth, targetHeight, isCropping, crop]);

  useEffect(() => {
    if (file && !imageRef.current) {
        setIsProcessing(true);
        const img = new Image();
        img.onload = () => {
            imageRef.current = img;
            setTargetWidth(String(img.naturalWidth));
            setTargetHeight(String(img.naturalHeight));
            setCrop({
                x: img.naturalWidth * 0.1,
                y: img.naturalHeight * 0.1,
                width: img.naturalWidth * 0.8,
                height: img.naturalHeight * 0.8
            })
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
    imageRef.current = null;
    handleReset();
  };

  const handleClear = () => {
    setFile(null);
    imageRef.current = null;
    setActiveTab('adjust');
  };
  
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;

    if (isCropping) {
        toast({ variant: 'destructive', title: 'Finish Cropping', description: 'Please apply or cancel the crop first.'});
        return;
    }

    const link = document.createElement('a');
    link.download = `edited-${file.name || 'image.png'}`;
    link.href = canvas.toDataURL();
    link.click();
    toast({ title: 'Image Saved', description: 'Your edited image has been downloaded.' });
  };

  const handleReset = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setRotation(0);
    setScale({ x: 1, y: 1 });
    setFilter('none');
    if (imageRef.current) {
        setTargetWidth(String(imageRef.current.naturalWidth));
        setTargetHeight(String(imageRef.current.naturalHeight));
    }
    setIsCropping(false);
  };

  const handleWidthChange = (value: string) => {
    setTargetWidth(value);
    if (maintainAspectRatio && imageRef.current) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        const aspectRatio = imageRef.current.naturalHeight / imageRef.current.naturalWidth;
        setTargetHeight(String(Math.round(numValue * aspectRatio)));
      } else if (value === '') {
        setTargetHeight('');
      }
    }
  };

  const handleHeightChange = (value: string) => {
    setTargetHeight(value);
    if (maintainAspectRatio && imageRef.current) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        const aspectRatio = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
        setTargetWidth(String(Math.round(numValue * aspectRatio)));
      } else if (value === '') {
        setTargetWidth('');
      }
    }
  };

  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = crop.width;
    cropCanvas.height = crop.height;
    const cropCtx = cropCanvas.getContext('2d');
    if(!cropCtx) return;

    // Redraw the original image with all transformations to a temporary canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if(!tempCtx) return;
    
    // Temporarily disable cropping for this draw operation
    setIsCropping(false); 
    // This is a bit of a trick. We need to force a re-draw but without the crop overlay.
    // The state change won't be immediate. So we manually draw.
    const w = parseInt(targetWidth) || image.naturalWidth;
    const h = parseInt(targetHeight) || image.naturalHeight;
    tempCtx.filter = [ `brightness(${brightness[0]}%)`, `contrast(${contrast[0]}%)`, `saturate(${saturation[0]}%)`, `grayscale(${filter === 'grayscale' ? 1 : 0})`, `sepia(${filter === 'sepia' ? 1 : 0})`, `invert(${filter === 'invert' ? 1 : 0})`, ].join(' ');
    tempCtx.save();
    tempCtx.translate(w / 2, h / 2);
    tempCtx.rotate((rotation * Math.PI) / 180);
    tempCtx.scale(scale.x, scale.y);
    tempCtx.drawImage(image, -w / 2, -h / 2, w, h);
    tempCtx.restore();

    cropCtx.drawImage(
      tempCanvas,
      crop.x, crop.y, crop.width, crop.height, // source
      0, 0, crop.width, crop.height // destination
    );
    
    const dataUrl = cropCanvas.toDataURL();
    const newFile = new File([], `cropped-${file?.name}`, { type: 'image/png' });
    const img = new Image();
    img.onload = () => {
        imageRef.current = img;
        setFile(newFile);
        setTargetWidth(String(img.width));
        setTargetHeight(String(img.height));
        handleReset();
    }
    img.src = dataUrl;
  }
  
  // Cropping interaction handlers
  const getCoords = (e: React.MouseEvent | React.TouchEvent | Touch) => {
    const canvas = canvasRef.current;
    if(!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCropping) return;
    const {x, y} = getCoords(e);
    setDragStart({ x, y });
    const handleSize = 10;
    
    const handles: {[key: string]: number[]} = {
        'top-left': [crop.x, crop.y], 'top-right': [crop.x + crop.width, crop.y],
        'bottom-left': [crop.x, crop.y + crop.height], 'bottom-right': [crop.x + crop.width, crop.y + crop.height],
        'top': [crop.x + crop.width/2, crop.y], 'bottom': [crop.x + crop.width/2, crop.y + crop.height],
        'left': [crop.x, crop.y + crop.height/2], 'right': [crop.x + crop.width, crop.y + crop.height/2],
    };

    for(const [handle, [hx, hy]] of Object.entries(handles)) {
        if (Math.abs(x - hx) < handleSize && Math.abs(y - hy) < handleSize) {
            setDragging('resize');
            setResizeHandle(handle);
            return;
        }
    }
    
    if (x > crop.x && x < crop.x + crop.width && y > crop.y && y < crop.y + crop.height) {
        setDragging('pan');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging || !isCropping) return;
    const {x, y} = getCoords(e);
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;

    if (dragging === 'pan') {
      setCrop(c => ({ ...c, x: c.x + dx, y: c.y + dy }));
    } else if (dragging === 'resize' && resizeHandle) {
        setCrop(c => {
            let { x: newX, y: newY, width, height } = c;
            if (resizeHandle.includes('right')) width += dx;
            if (resizeHandle.includes('left')) { newX += dx; width -= dx; }
            if (resizeHandle.includes('bottom')) height += dy;
            if (resizeHandle.includes('top')) { newY += dy; height -= dy; }
            return { x: newX, y: newY, width: Math.max(20, width), height: Math.max(20, height) };
        });
    }
    setDragStart({ x, y });
  };
  
  const handleMouseUp = () => {
    setDragging(null);
    setResizeHandle(null);
  };

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
                    <canvas 
                        ref={canvasRef} 
                        className="max-w-full max-h-full object-contain"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                     />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="adjust">Adjust</TabsTrigger>
                        <TabsTrigger value="filters">Filters</TabsTrigger>
                        <TabsTrigger value="transform">Transform</TabsTrigger>
                        <TabsTrigger value="crop">Crop</TabsTrigger>
                        <TabsTrigger value="resize">Resize</TabsTrigger>
                    </TabsList>
                    <TabsContent value="adjust" className="space-y-4 p-4 border rounded-md mt-2">
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
                    </TabsContent>
                    <TabsContent value="filters" className="space-y-4 p-4 border rounded-md mt-2">
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
                    </TabsContent>
                    <TabsContent value="transform" className="p-4 border rounded-md mt-2">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button variant="outline" onClick={() => setRotation(r => (r + 90) % 360)}><RotateCw className="mr-2 h-4 w-4" /> Rotate</Button>
                            <Button variant="outline" onClick={() => setScale(s => ({ ...s, x: s.x * -1 }))}><FlipHorizontal className="mr-2 h-4 w-4" /> Flip H</Button>
                            <Button variant="outline" onClick={() => setScale(s => ({ ...s, y: s.y * -1 }))}><FlipVertical className="mr-2 h-4 w-4" /> Flip V</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="crop" className="p-4 border rounded-md mt-2 space-y-4">
                        {!isCropping ? (
                            <Button className="w-full" onClick={() => setIsCropping(true)}>Enable Crop Mode</Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button className="w-full" onClick={handleApplyCrop}>Apply Crop</Button>
                                <Button className="w-full" variant="outline" onClick={() => setIsCropping(false)}>Cancel</Button>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="resize" className="p-4 border rounded-md mt-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="width">Width (px)</Label>
                                <Input id="width" value={targetWidth} onChange={(e) => handleWidthChange(e.target.value)} type="number" />
                            </div>
                                <div className="space-y-2">
                                <Label htmlFor="height">Height (px)</Label>
                                <Input id="height" value={targetHeight} onChange={(e) => handleHeightChange(e.target.value)} type="number" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="aspect-ratio" checked={maintainAspectRatio} onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)} />
                            <label htmlFor="aspect-ratio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Maintain aspect ratio
                            </label>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {file && !isProcessing && (
            <>
              <Button className="w-full" size="lg" onClick={handleSave}>Save & Download</Button>
              <div className="flex w-full gap-2">
                <Button variant="outline" className="w-full" onClick={handleReset}>Reset All Edits</Button>
                <Button variant="outline" className="w-full" onClick={handleClear}>Start Over</Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
