'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Scissors, Move, Pencil, Printer, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { PDFDocument, rgb } from 'pdf-lib';

interface ToolProps {
  onBack: () => void;
  title: string;
}

const steps = ['Upload', 'Crop & Edit', 'Arrange', 'Download'];

const countries = {
  us: { name: 'United States (2x2 inch)', width: 2, height: 2, unit: 'in', dpi: 300 },
  uk: { name: 'United Kingdom (35x45 mm)', width: 35, height: 45, unit: 'mm', dpi: 600 },
  eu: { name: 'Schengen Area (35x45 mm)', width: 35, height: 45, unit: 'mm', dpi: 600 },
  ca: { name: 'Canada (50x70 mm)', width: 50, height: 70, unit: 'mm', dpi: 600 },
  au: { name: 'Australia (35x45 mm)', width: 35, height: 45, unit: 'mm', dpi: 600 },
  cn: { name: 'China (33x48 mm)', width: 33, height: 48, unit: 'mm', dpi: 600 },
};

type CountryKey = keyof typeof countries;

// A4 paper dimensions in points (1 point = 1/72 inch)
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;


export default function PassportPhotoMakerClient({ onBack, title }: ToolProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [country, setCountry] = useState<CountryKey>('uk');
  
  // Cropping state
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 200, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Editing state
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const editCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Final layout state
  const [finalLayout, setFinalLayout] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();

  const getAspectRatio = useCallback(() => {
    const { width, height } = countries[country];
    return width / height;
  }, [country]);

  // Load original image
  useEffect(() => {
    if (!file) {
      setOriginalImage(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        setOriginalImage(img);
        // Reset crop on new image
        const aspectRatio = getAspectRatio();
        const canvasWidth = cropCanvasRef.current?.width || 500;
        const initialCropWidth = canvasWidth / 2;
        setCrop({
          x: canvasWidth / 4,
          y: 50,
          width: initialCropWidth,
          height: initialCropWidth / aspectRatio,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [file, getAspectRatio]);

  // Draw image and crop overlay
  useEffect(() => {
    const canvas = cropCanvasRef.current;
    if (!canvas || !originalImage) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fit image to canvas
    const canvasRatio = canvas.width / canvas.height;
    const imageRatio = originalImage.width / originalImage.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imageRatio > canvasRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imageRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imageRatio;
      offsetY = 0;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, offsetX, offsetY, drawWidth, drawHeight);

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.rect(crop.x, crop.y, crop.width, crop.height);
    ctx.clip();
    ctx.drawImage(originalImage, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

  }, [originalImage, crop]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (offsetX > crop.x && offsetX < crop.x + crop.width &&
        offsetY > crop.y && offsetY < crop.y + crop.height) {
      setIsDragging(true);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setCrop(c => ({ ...c, x: c.x + e.movementX, y: c.y + e.movementY }));
  };

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
    setCurrentStep(1);
    setCroppedImage(null);
    setFinalLayout(null);
    setBrightness([100]);
    setContrast([100]);
  };

  const handleNextStep = () => {
    if (currentStep === 1) { // Crop -> Edit
      performCrop();
    }
    setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  };
  
  const handlePrevStep = () => {
    if (currentStep === 1) { // If on crop, go back to upload
        setFile(null);
        setOriginalImage(null);
    }
    setCurrentStep(s => Math.max(s - 1, 0));
  };

  const performCrop = () => {
    const sCanvas = cropCanvasRef.current;
    const dCanvas = document.createElement('canvas');
    if (!sCanvas || !originalImage) return;

    const sCtx = sCanvas.getContext('2d');
    if (!sCtx) return;
    
    // This part is tricky because the image is scaled on the canvas.
    // We need to map canvas crop coordinates back to original image coordinates.
    const canvasRatio = sCanvas.width / sCanvas.height;
    const imageRatio = originalImage.width / originalImage.height;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (imageRatio > canvasRatio) {
      drawWidth = sCanvas.width;
      drawHeight = sCanvas.width / imageRatio;
      offsetX = 0;
      offsetY = (sCanvas.height - drawHeight) / 2;
    } else {
      drawHeight = sCanvas.height;
      drawWidth = sCanvas.height * imageRatio;
      offsetY = 0;
      offsetX = (sCanvas.width - drawWidth) / 2;
    }

    const scale = originalImage.width / drawWidth;

    const sx = (crop.x - offsetX) * scale;
    const sy = (crop.y - offsetY) * scale;
    const sWidth = crop.width * scale;
    const sHeight = crop.height * scale;

    dCanvas.width = sWidth;
    dCanvas.height = sHeight;
    const dCtx = dCanvas.getContext('2d');
    if (!dCtx) return;

    dCtx.drawImage(originalImage, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
    
    setCroppedImage(dCanvas.toDataURL());
  };

  // Apply brightness/contrast filters
  useEffect(() => {
    const canvas = editCanvasRef.current;
    if (!canvas || !croppedImage) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;
      ctx.drawImage(img, 0, 0);
    }
    img.src = croppedImage;
  }, [croppedImage, brightness, contrast]);


  const generateFinalLayout = () => {
    const editCanvas = editCanvasRef.current;
    if (!editCanvas) return;
    setFinalLayout(editCanvas.toDataURL());
    handleNextStep();
  }

  const downloadPdf = async () => {
    if (!finalLayout) return;
    setIsProcessing(true);

    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([A4_WIDTH_PT, A4_HEIGHT_PT]);

        const selectedCountry = countries[country];
        const dpi = selectedCountry.dpi;
        
        let photoWidthPt = selectedCountry.width;
        let photoHeightPt = selectedCountry.height;

        // Convert mm or inches to points
        if (selectedCountry.unit === 'mm') {
            photoWidthPt = (photoWidthPt / 25.4) * 72;
            photoHeightPt = (photoHeightPt / 25.4) * 72;
        } else if (selectedCountry.unit === 'in') {
            photoWidthPt = photoWidthPt * 72;
            photoHeightPt = photoHeightPt * 72;
        }

        const jpgImageBytes = await fetch(finalLayout).then(res => res.arrayBuffer());
        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
        
        const cols = Math.floor(page.getWidth() / photoWidthPt);
        const rows = Math.floor(page.getHeight() / photoHeightPt);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * photoWidthPt;
                const y = page.getHeight() - (row + 1) * photoHeightPt;
                if (x + photoWidthPt <= page.getWidth() && y >= 0) {
                     page.drawImage(jpgImage, {
                        x: x,
                        y: y,
                        width: photoWidthPt,
                        height: photoHeightPt,
                    });
                }
            }
        }
        
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `passport-photos-${country}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        toast({ title: 'Success', description: 'Your passport photo sheet has been downloaded.' });
    } catch(e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate PDF.' });
    } finally {
        setIsProcessing(false);
    }
  }
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
            <>
                <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={['image/jpeg', 'image/png']} />
                <div className="space-y-2 pt-4">
                    <Label htmlFor="country">Photo Standards by Country</Label>
                    <Select value={country} onValueChange={(v) => setCountry(v as CountryKey)}>
                    <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(countries).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </>
        );
      case 1:
        return (
          <div className='w-full text-center space-y-2'>
            <p className="text-sm text-muted-foreground">Drag the box to position your photo.</p>
            <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center">
              <canvas
                ref={cropCanvasRef}
                width={500}
                height={500}
                className="max-w-full max-h-full object-contain cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className='w-full text-center space-y-4'>
            <p className="text-sm text-muted-foreground">Adjust brightness and contrast.</p>
            <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center">
              <canvas ref={editCanvasRef} className="max-w-full max-h-full object-contain" />
            </div>
            <div className='space-y-4 text-left px-4'>
                <div className="space-y-2">
                    <Label>Brightness ({brightness[0]}%)</Label>
                    <Slider value={brightness} onValueChange={setBrightness} max={200} step={1} />
                </div>
                <div className="space-y-2">
                    <Label>Contrast ({contrast[0]}%)</Label>
                    <Slider value={contrast} onValueChange={setContrast} max={200} step={1} />
                </div>
            </div>
          </div>
        );
      case 3:
         return (
             <div className="w-full text-center space-y-4">
                 <p className="text-sm text-muted-foreground">Your photos are ready for printing on an A4 sheet.</p>
                 <div className="relative w-full aspect-[1/1.414] bg-white rounded-md overflow-hidden flex items-center justify-center border shadow-sm">
                    {finalLayout && (
                      <Image src={finalLayout} alt="Final Layout Preview" layout="fill" objectFit="contain" className="p-4" />
                    )}
                 </div>
                 <p className='text-xs text-muted-foreground'>This is a preview. The final PDF will contain a full sheet of photos.</p>
             </div>
         );
      default:
        return null;
    }
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Create Passport Photo</CardTitle>
          <CardDescription>Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 min-h-[300px] flex flex-col items-center justify-center">
          {isProcessing && (
            <div className="flex flex-col items-center justify-center gap-4 p-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating PDF...</p>
            </div>
          )}
          {!isProcessing && renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 0 || isProcessing}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < 2 && (
            <Button onClick={handleNextStep} disabled={!file || isProcessing}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentStep === 2 && (
            <Button onClick={generateFinalLayout} disabled={isProcessing}>
              Preview on A4 <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
           {currentStep === 3 && (
            <Button onClick={downloadPdf} disabled={isProcessing}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
