'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function EditPdf({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfPageAsImage, setPdfPageAsImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [paths, setPaths] = useState<[number, number][]>([]);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  const redrawCanvas = useCallback(() => {
    const ctx = getCanvasContext();
    if (!ctx || !canvasRef.current) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    if (paths.length === 0) return;
    
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    paths.forEach((path, index) => {
        if(index > 0 && Math.abs(path[0] - paths[index-1][0]) < 2 && Math.abs(path[1] - paths[index-1][1]) < 2) {
             ctx.lineTo(path[0], path[1]);
        } else {
             ctx.moveTo(path[0], path[1]);
        }
    })
    ctx.stroke();

  }, [paths, brushColor, brushSize]);

  useEffect(() => {
    redrawCanvas();
  }, [paths, redrawCanvas]);

  const handleFileSelect = async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setPdfPageAsImage(null);
    setPaths([]);

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
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setPaths(prev => [...prev, [offsetX, offsetY]]);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setPaths(prev => [...prev, [offsetX, offsetY]]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = async () => {
    if (!file || !canvasRef.current || paths.length === 0) {
        toast({ variant: 'destructive', title: 'Nothing to save', description: 'Draw on the PDF to save your changes.' });
        return;
    }

    setIsProcessing(true);
    try {
        const existingPdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPages()[0]; // Edit first page

        const drawingCanvas = canvasRef.current;
        const pngImageBytes = await fetch(drawingCanvas.toDataURL('image/png')).then(res => res.arrayBuffer());
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

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Upload PDF to Edit</CardTitle>
          <CardDescription>Our editor is currently in beta. Freehand drawing on the first page is supported.</CardDescription>
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
              <div className="flex flex-wrap items-center gap-4 p-2 border rounded-md">
                <div className="space-y-1">
                  <Label htmlFor='brush-color'>Brush Color</Label>
                  <Input id="brush-color" type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} className="w-16 p-1"/>
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor='brush-size'>Brush Size ({brushSize}px)</Label>
                  <Input id="brush-size" type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} />
                </div>
                <Button variant="outline" size="sm" onClick={() => setPaths([])} disabled={paths.length === 0}>Clear Drawing</Button>
              </div>
              <div 
                className="relative w-full mx-auto aspect-[4/5] bg-muted rounded-lg overflow-hidden cursor-crosshair"
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
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {file && !isProcessing && (
             <Button className="w-full" size="lg" onClick={handleSave} disabled={paths.length === 0}>
                Save & Download PDF
             </Button>
          )}
           {file && !isProcessing && (
             <Button variant="outline" className="w-full" onClick={() => {setFile(null); setPdfPageAsImage(null); setPaths([]);}}>
                Start Over
             </Button>
           )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
