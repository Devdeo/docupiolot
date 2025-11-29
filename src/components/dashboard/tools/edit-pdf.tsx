'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Pen, Eraser, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ToolProps {
  onBack: () => void;
  title: string;
}

type ToolMode = 'draw' | 'erase' | 'stamp';
interface Annotation {
  id: string;
  type: 'path' | 'image';
  // For paths
  path?: [number, number][];
  color?: string;
  size?: number;
  // For images
  image?: HTMLImageElement;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export function EditPdf({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfPageAsImage, setPdfPageAsImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolMode>('draw');
  const [brushColor, setBrushColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [stampImage, setStampImage] = useState<HTMLImageElement | null>(null);

  const getCanvasContext = () => canvasRef.current?.getContext('2d');

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    annotations.forEach(anno => {
      ctx.save();
      if (anno.type === 'path' && anno.path) {
        ctx.strokeStyle = anno.color || '#000000';
        ctx.lineWidth = anno.size || 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        anno.path.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point[0], point[1]);
          } else {
            ctx.lineTo(point[0], point[1]);
          }
        });
        ctx.stroke();
      } else if (anno.type === 'image' && anno.image) {
         ctx.drawImage(anno.image, anno.x!, anno.y!, anno.width!, anno.height!);
      }
      ctx.restore();
    });

    // Draw current path if any
    if (currentPath.length > 1) {
        ctx.save();
        if(activeTool === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.strokeStyle = brushColor;
        }
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        currentPath.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point[0], point[1]);
            else ctx.lineTo(point[0], point[1]);
        });
        ctx.stroke();
        ctx.restore();
    }

  }, [annotations, currentPath, brushColor, brushSize, activeTool]);
  
  useEffect(() => {
    redrawCanvas();
  }, [annotations, currentPath, redrawCanvas]);

  const handleFileSelect = async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setPdfPageAsImage(null);
    setAnnotations([]);
    setStampImage(null);

    try {
      const pdfjs = await import('pdfjs-dist/build/pdf');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

      const pdfData = await selectedFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
      const page = await pdf.getPage(1); // Only edit first page for now
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Could not create canvas context");
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      
      setPdfPageAsImage(canvas.toDataURL('image/png'));
      if(canvasRef.current) {
        canvasRef.current.width = viewport.width;
        canvasRef.current.height = viewport.height;
      }

      await pdf.destroy();
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error loading PDF', description: 'Could not render PDF for editing.'});
        setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageStampSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setStampImage(img);
                setActiveTool('stamp');
                toast({ title: 'Image Ready', description: 'Click on the PDF to place the image.' });
            };
            img.src = event.target?.result as string;
        }
        reader.readAsDataURL(file);
    }
  }
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (activeTool === 'stamp' && stampImage) {
        setAnnotations(prev => [...prev, {
            id: `anno-${Date.now()}`,
            type: 'image',
            image: stampImage,
            x: offsetX - stampImage.width / 4,
            y: offsetY - stampImage.height / 4,
            width: stampImage.width / 2,
            height: stampImage.height / 2
        }]);
        return;
    }

    setIsDrawing(true);
    setCurrentPath([[offsetX, offsetY]]);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool === 'stamp') return;
    const { offsetX, offsetY } = e.nativeEvent;
    setCurrentPath(prev => [...prev, [offsetX, offsetY]]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (activeTool === 'draw') {
        setAnnotations(prev => [...prev, {
            id: `anno-${Date.now()}`,
            type: 'path',
            path: currentPath,
            color: brushColor,
            size: brushSize
        }]);
    } else if (activeTool === 'erase') {
        const tempCanvas = document.createElement('canvas');
        if (!canvasRef.current) return;
        tempCanvas.width = canvasRef.current.width;
        tempCanvas.height = canvasRef.current.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // Draw existing annotations
        annotations.forEach(anno => {
            if(anno.type === 'path') {
                tempCtx.strokeStyle = anno.color!;
                tempCtx.lineWidth = anno.size!;
                tempCtx.beginPath();
                anno.path!.forEach((p, i) => i === 0 ? tempCtx.moveTo(p[0], p[1]) : tempCtx.lineTo(p[0], p[1]));
                tempCtx.stroke();
            } else if (anno.type === 'image') {
                tempCtx.drawImage(anno.image!, anno.x!, anno.y!, anno.width!, anno.height!);
            }
        });

        // "Erase" by clearing where the path was
        tempCtx.globalCompositeOperation = 'destination-out';
        tempCtx.strokeStyle = 'rgba(0,0,0,1)';
        tempCtx.lineWidth = brushSize;
        tempCtx.beginPath();
        currentPath.forEach((p, i) => i === 0 ? tempCtx.moveTo(p[0], p[1]) : tempCtx.lineTo(p[0], p[1]));
        tempCtx.stroke();

        // This approach of replacing annotations is a simplification.
        // A more robust solution would involve more complex image data manipulation or separating annotations into layers.
        // For now, we clear path annotations and could add image annotations back.
        const imageAnnos = annotations.filter(a => a.type === 'image');
        const newImage = new Image();
        newImage.onload = () => {
            setAnnotations([...imageAnnos, {
                 id: `anno-${Date.now()}`,
                 type: 'image',
                 image: newImage,
                 x: 0, y: 0,
                 width: tempCanvas.width,
                 height: tempCanvas.height
            }]);
        }
        newImage.src = tempCanvas.toDataURL();
    }

    setCurrentPath([]);
  };

  const handleSave = async () => {
    if (!file || !canvasRef.current || annotations.length === 0) {
        toast({ variant: 'destructive', title: 'Nothing to save', description: 'Draw on or stamp the PDF to save your changes.' });
        return;
    }

    setIsProcessing(true);
    try {
        const existingPdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPages()[0]; // Edit first page

        const drawingCanvas = document.createElement('canvas');
        drawingCanvas.width = canvasRef.current.width;
        drawingCanvas.height = canvasRef.current.height;
        const ctx = drawingCanvas.getContext('2d');
        if (!ctx) return;
        
        redrawCanvas(); // Redraw annotations on the main canvas
        const finalCanvas = canvasRef.current;
        const pngImageBytes = await fetch(finalCanvas.toDataURL('image/png')).then(res => res.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(pngImageBytes);

        page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: page.getWidth(),
            height: page.getHeight(),
        });

        const pdfBytes = await pdfDoc.save();
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const originalName = file.name.replace(/\.pdf$/i, '') || 'document';
        link.download = `${originalName}-edited.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        toast({ title: 'PDF Saved', description: 'Your edited PDF has been downloaded.' });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error Saving PDF', description: 'Could not save the changes.' });
    } finally {
        setIsProcessing(false);
    }
  }
  
  const handleClearAll = () => {
      setAnnotations([]);
      setCurrentPath([]);
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload PDF to Edit</CardTitle>
          <CardDescription>Freehand drawing, erasing, and image stamping on the first page is supported.</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['application/pdf']} />
          ) : isProcessing ? (
             <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading PDF...</p>
             </div>
          ) : (
            <div className="space-y-4">
               <Tabs value={activeTool} onValueChange={(v) => setActiveTool(v as ToolMode)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="draw"><Pen className='mr-2'/>Draw</TabsTrigger>
                        <TabsTrigger value="erase"><Eraser className='mr-2'/>Erase</TabsTrigger>
                        <TabsTrigger value="stamp" asChild>
                            <label htmlFor='image-stamp-input' className='flex items-center justify-center cursor-pointer'><ImageIcon className='mr-2'/>Image</label>
                        </TabsTrigger>
                         <Input id='image-stamp-input' type='file' accept="image/*" className='hidden' onChange={handleImageStampSelect}/>
                    </TabsList>
                    <TabsContent value="draw" className="p-4 border rounded-b-md mt-0">
                         <div className="flex flex-wrap items-center gap-4">
                            <div className="space-y-1">
                            <Label htmlFor='brush-color'>Brush Color</Label>
                            <Input id="brush-color" type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} className="w-16 p-1"/>
                            </div>
                            <div className="flex-1 space-y-1">
                            <Label htmlFor='brush-size'>Brush Size ({brushSize}px)</Label>
                            <Input id="brush-size" type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="erase" className="p-4 border rounded-b-md mt-0">
                         <div className="flex-1 space-y-1">
                            <Label htmlFor='eraser-size'>Eraser Size ({brushSize}px)</Label>
                            <Input id="eraser-size" type="range" min="1" max="100" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} />
                        </div>
                    </TabsContent>
                     <TabsContent value="stamp" className="p-4 border rounded-b-md mt-0 text-center">
                         {stampImage ? <p className='text-sm text-muted-foreground'>Click on the PDF to place your image.</p> : <p className='text-sm text-muted-foreground'>Upload an image to get started.</p>}
                    </TabsContent>
                </Tabs>

              <div 
                className={cn(
                    "relative w-full mx-auto aspect-[4/5] bg-muted rounded-lg overflow-hidden",
                    activeTool === 'draw' && 'cursor-crosshair',
                    activeTool === 'erase' && 'cursor-grab',
                    activeTool === 'stamp' && stampImage && 'cursor-copy'
                )}
                style={{
                  backgroundImage: `url(${pdfPageAsImage})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
               <Button variant="outline" size="sm" onClick={handleClearAll} disabled={annotations.length === 0}>Clear All Annotations</Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {file && !isProcessing && (
             <Button className="w-full" size="lg" onClick={handleSave} disabled={annotations.length === 0}>
                Save & Download PDF
             </Button>
          )}
           {file && !isProcessing && (
             <Button variant="outline" className="w-full" onClick={() => {setFile(null); setPdfPageAsImage(null); setAnnotations([]);}}>
                Start Over
             </Button>
           )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
