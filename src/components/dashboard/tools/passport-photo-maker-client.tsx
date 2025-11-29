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
import { Loader2, Download, ChevronLeft, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { PDFDocument, rgb } from 'pdf-lib';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface ToolProps {
  onBack: () => void;
  title: string;
}

const steps = ['Upload', 'Crop & Edit', 'Arrange & Download'];

const countries = {
  us: { name: 'United States (2x2 inch)', width: 2, height: 2, unit: 'in', dpi: 300 },
  uk: { name: 'United Kingdom (35x45 mm)', width: 35, height: 45, unit: 'mm', dpi: 600 },
  eu: { name: 'Schengen Area (35x45 mm)', width: 35, height: 45, unit: 'mm', dpi: 600 },
  ca: { name: 'Canada (50x70 mm)', width: 50, height: 70, unit: 'mm', dpi: 600 },
  au: { name: 'Australia (35x45 mm)', width: 35, height: 45, unit: 'mm', dpi: 600 },
  cn: { name: 'China (33x48 mm)', width: 33, height: 48, unit: 'mm', dpi: 600 },
};

type CountryKey = keyof typeof countries;

const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

interface EditedImage {
    id: string;
    originalFile: File;
    croppedUrl: string;
    finalUrl: string;
}

export default function PassportPhotoMakerClient({ onBack, title }: ToolProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [country, setCountry] = useState<CountryKey>('uk');
  
  // Image state
  const [editedImages, setEditedImages] = useState<EditedImage[]>([]);
  const [activeImage, setActiveImage] = useState<{ id: string, file: File } | null>(null);

  // Cropping state
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 100, y: 100, width: 200, height: 200 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<'pan' | 'resize' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const pinchDist = useRef(0);
  const initialScale = useRef(1);
  
  // Editing state
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const editCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Final layout state
  const [finalLayout, setFinalLayout] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageCount, setImageCount] = useState(8);
  const [addBorder, setAddBorder] = useState(false);
  const [borderColor, setBorderColor] = useState('#000000');
  
  const { toast } = useToast();

  const getAspectRatio = useCallback(() => {
    const { width, height } = countries[country];
    return width / height;
  }, [country]);

  // Load original image for cropping/editing
  useEffect(() => {
    if (!activeImage) {
      setImageSrc(null);
      imageRef.current = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        imageRef.current = img;
        setImageSrc(e.target?.result as string);
      }
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(activeImage.file);
  }, [activeImage]);
  
  // Reset crop on new image or country change
  useEffect(() => {
    if (imageSrc && cropCanvasRef.current && imageRef.current) {
      const canvas = cropCanvasRef.current;
      const aspectRatio = getAspectRatio();
      
      const imgWidth = imageRef.current.width;
      const imgHeight = imageRef.current.height;
      
      let initialImgScale = 1;
      if (imgWidth > canvas.width || imgHeight > canvas.height) {
        initialImgScale = Math.min(canvas.width / imgWidth, canvas.height / imgHeight);
      }
      setScale(initialImgScale);
      
      const scaledWidth = imgWidth * initialImgScale;
      const scaledHeight = imgHeight * initialImgScale;
      
      const newCropWidth = Math.min(scaledWidth, canvas.width) * 0.8;
      const newCropHeight = newCropWidth / aspectRatio;

      setCrop({
        x: (canvas.width - newCropWidth) / 2,
        y: (canvas.height - newCropHeight) / 2,
        width: newCropWidth,
        height: newCropHeight,
      });
      setPosition({ 
        x: (canvas.width - scaledWidth) / 2,
        y: (canvas.height - scaledHeight) / 2,
      });
    }
  }, [imageSrc, getAspectRatio, country]);

  // Draw image and crop overlay
  useEffect(() => {
    const canvas = cropCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !imageRef.current) return;
    
    const img = imageRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    ctx.restore();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.rect(crop.x, crop.y, crop.width, crop.height);
    ctx.fill('evenodd');

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
    
    const handleSize = 8;
    const handles = {
      'top-left': [crop.x, crop.y],
      'top-right': [crop.x + crop.width, crop.y],
      'bottom-left': [crop.x, crop.y + crop.height],
      'bottom-right': [crop.x + crop.width, crop.y + crop.height],
    }
    ctx.fillStyle = 'red';
    Object.values(handles).forEach(([hx, hy]) => {
      ctx.fillRect(hx - handleSize/2, hy - handleSize/2, handleSize, handleSize)
    });
  }, [crop, scale, position, imageSrc]);
  
  const getCoords = (e: React.MouseEvent | React.TouchEvent | Touch) => {
    const canvas = cropCanvasRef.current;
    if(!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }
  
  const handleDragStart = (x: number, y: number) => {
    const handleSize = 10;
    setDragStart({ x, y });
    
    const handles: {[key: string]: number[]} = {
        'top-left': [crop.x, crop.y],
        'top-right': [crop.x + crop.width, crop.y],
        'bottom-left': [crop.x, crop.y + crop.height],
        'bottom-right': [crop.x + crop.width, crop.y + crop.height],
    };

    for(const [handle, [hx, hy]] of Object.entries(handles)) {
        if (Math.abs(x - hx) < handleSize && Math.abs(y - hy) < handleSize) {
            setDragging('resize');
            setResizeHandle(handle);
            return;
        }
    }
    setDragging('pan');
  }

  const handleDragMove = (x: number, y: number) => {
    if (!dragging) return;
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;

    if (dragging === 'pan') {
      setPosition(p => ({ x: p.x + dx, y: p.y + dy }));
    } else if (dragging === 'resize' && resizeHandle) {
      setCrop(c => {
          let { x: newX, y: newY, width, height } = c;
          const aspectRatio = getAspectRatio();

          if (resizeHandle.includes('right')) width += dx;
          if (resizeHandle.includes('left')) { newX += dx; width -= dx; }
          if (resizeHandle.includes('bottom')) height += dy;
          if (resizeHandle.includes('top')) { newY += dy; height -= dy; }
          
          if (resizeHandle.includes('left') || resizeHandle.includes('right')) {
            const newHeight = width / aspectRatio;
            if (resizeHandle.includes('top')) newY += height - newHeight;
            height = newHeight;
          } else {
            const newWidth = height * aspectRatio;
            if (resizeHandle.includes('left')) newX += width - newWidth;
            width = newWidth;
          }
          return { x: newX, y: newY, width: Math.max(20,width), height: Math.max(20, height) };
      });
    }
    setDragStart({ x, y });
  };
  
  const handleDragEnd = () => {
    setDragging(null);
    setResizeHandle(null);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const {x, y} = getCoords(e);
    handleDragStart(x, y);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const {x, y} = getCoords(e);
    handleDragMove(x, y);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const { x, y } = getCoords(e.touches[0]);
      handleDragStart(x, y);
    } else if (e.touches.length === 2) {
      setDragging(null);
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      pinchDist.current = dist;
      initialScale.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging) {
      const { x, y } = getCoords(e.touches[0]);
      handleDragMove(x, y);
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      if (pinchDist.current === 0) return;
      const zoomRatio = dist / pinchDist.current;
      setScale(Math.max(0.1, initialScale.current * zoomRatio));
    }
  };
  
  const handleTouchEnd = () => {
    pinchDist.current = 0;
    handleDragEnd();
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.max(0.1, s + delta));
  };

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const newImageId = `img-${Date.now()}`;
    setActiveImage({ id: newImageId, file });
    setCurrentStep(1);
    setBrightness([100]);
    setContrast([100]);
  };

  const saveCroppedAndEditedImage = useCallback(() => {
    const sCanvas = cropCanvasRef.current;
    const img = imageRef.current;
    if (!sCanvas || !img || !activeImage) return;

    // --- Step 1: Create high-res cropped image ---
    const cropRenderCanvas = document.createElement('canvas');
    const sourceX = (crop.x - position.x) / scale;
    const sourceY = (crop.y - position.y) / scale;
    const sourceWidth = crop.width / scale;
    const sourceHeight = crop.height / scale;

    const selectedCountry = countries[country];
    const targetWidth = selectedCountry.dpi * selectedCountry.width / (selectedCountry.unit === 'mm' ? 25.4 : 1);
    const targetHeight = selectedCountry.dpi * selectedCountry.height / (selectedCountry.unit === 'mm' ? 25.4 : 1);

    cropRenderCanvas.width = targetWidth;
    cropRenderCanvas.height = targetHeight;
    const cropCtx = cropRenderCanvas.getContext('2d');
    if (!cropCtx) return;
    cropCtx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
    const croppedUrl = cropRenderCanvas.toDataURL('image/jpeg');

    // --- Step 2: Apply edits to the high-res cropped image ---
    const editRenderCanvas = document.createElement('canvas');
    const editImg = new window.Image();
    editImg.onload = () => {
        editRenderCanvas.width = editImg.width;
        editRenderCanvas.height = editImg.height;
        const editCtx = editRenderCanvas.getContext('2d');
        if (!editCtx) return;
        editCtx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;
        editCtx.drawImage(editImg, 0, 0);
        const finalUrl = editRenderCanvas.toDataURL('image/jpeg');

        setEditedImages(prev => {
            const existing = prev.find(i => i.id === activeImage.id);
            if (existing) {
                return prev.map(i => i.id === activeImage.id ? { ...i, croppedUrl, finalUrl } : i);
            }
            return [...prev, { id: activeImage.id, originalFile: activeImage.file, croppedUrl, finalUrl }];
        });

        setActiveImage(null);
        setCurrentStep(2);
    };
    editImg.src = croppedUrl;

  }, [activeImage, country, crop, position, scale, brightness, contrast]);


  const generateFinalLayout = useCallback(async () => {
    if (editedImages.length === 0) return;

    const layoutCanvas = document.createElement('canvas');
    layoutCanvas.width = A4_WIDTH_PT;
    layoutCanvas.height = A4_HEIGHT_PT;
    const layoutCtx = layoutCanvas.getContext('2d');
    if (!layoutCtx) return;

    layoutCtx.fillStyle = 'white';
    layoutCtx.fillRect(0, 0, layoutCanvas.width, layoutCanvas.height);
    
    const selectedCountry = countries[country];
    let photoWidthPt = selectedCountry.width;
    let photoHeightPt = selectedCountry.height;

    if (selectedCountry.unit === 'mm') {
        photoWidthPt = (photoWidthPt / 25.4) * 72;
        photoHeightPt = (photoHeightPt / 25.4) * 72;
    } else if (selectedCountry.unit === 'in') {
        photoWidthPt *= 72;
        photoHeightPt *= 72;
    }
    
    const cols = Math.floor(A4_WIDTH_PT / photoWidthPt);
    const rows = Math.floor(A4_HEIGHT_PT / photoHeightPt);
    let imagesDrawn = 0;
    let imageIndex = 0;

    for (let row = 0; row < rows && imagesDrawn < imageCount; row++) {
        for (let col = 0; col < cols && imagesDrawn < imageCount; col++) {
            const currentImage = editedImages[imageIndex % editedImages.length];
            const img = new window.Image();
            
            const promise = new Promise<void>(resolve => {
                img.onload = () => {
                    const x = col * photoWidthPt;
                    const y = row * photoHeightPt;
                    if (x + photoWidthPt <= A4_WIDTH_PT && y + photoHeightPt <= A4_HEIGHT_PT) {
                        if (addBorder) {
                            layoutCtx.fillStyle = borderColor;
                            layoutCtx.fillRect(x, y, photoWidthPt, photoHeightPt);
                            layoutCtx.drawImage(img, x + 1, y + 1, photoWidthPt - 2, photoHeightPt - 2);
                        } else {
                            layoutCtx.drawImage(img, x, y, photoWidthPt, photoHeightPt);
                        }
                    }
                    resolve();
                };
            });
            img.src = currentImage.finalUrl;
            await promise;

            imagesDrawn++;
            imageIndex++;
        }
    }
    setFinalLayout(layoutCanvas.toDataURL());
  }, [editedImages, country, imageCount, addBorder, borderColor]);

  useEffect(() => {
    if (currentStep === 2) {
      generateFinalLayout();
    }
  }, [currentStep, generateFinalLayout]);


  const downloadPdf = async () => {
    if (editedImages.length === 0) return;
    setIsProcessing(true);

    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([A4_WIDTH_PT, A4_HEIGHT_PT]);

        const selectedCountry = countries[country];
        let photoWidthPt = selectedCountry.width;
        let photoHeightPt = selectedCountry.height;

        if (selectedCountry.unit === 'mm') {
            photoWidthPt = (photoWidthPt / 25.4) * 72;
            photoHeightPt = (photoHeightPt / 25.4) * 72;
        } else if (selectedCountry.unit === 'in') {
            photoWidthPt *= 72;
            photoHeightPt *= 72;
        }
        
        const cols = Math.floor(page.getWidth() / photoWidthPt);
        const rows = Math.floor(page.getHeight() / photoHeightPt);
        let imagesDrawn = 0;
        let imageIndex = 0;

        for (let row = 0; row < rows && imagesDrawn < imageCount; row++) {
            for (let col = 0; col < cols && imagesDrawn < imageCount; col++) {
                const currentImage = editedImages[imageIndex % editedImages.length];
                const jpgImageBytes = await fetch(currentImage.finalUrl).then(res => res.arrayBuffer());
                const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);

                const x = col * photoWidthPt;
                const y = page.getHeight() - (row + 1) * photoHeightPt;
                if (x + photoWidthPt <= page.getWidth() && y >= 0) {
                     if (addBorder) {
                        page.drawRectangle({
                            x, y, width: photoWidthPt, height: photoHeightPt,
                            color: rgb(parseInt(borderColor.slice(1,3), 16)/255, parseInt(borderColor.slice(3,5), 16)/255, parseInt(borderColor.slice(5,7), 16)/255)
                        });
                        page.drawImage(jpgImage, {
                            x: x + 1, y: y + 1, width: photoWidthPt - 2, height: photoHeightPt - 2
                        });
                     } else {
                        page.drawImage(jpgImage, { x, y, width: photoWidthPt, height: photoHeightPt });
                     }
                }
                imagesDrawn++;
                imageIndex++;
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

  const handleRemoveEditedImage = (id: string) => {
    setEditedImages(prev => prev.filter(img => img.id !== id));
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
                    <SelectTrigger id="country"><SelectValue /></SelectTrigger>
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
          <div className='w-full text-center space-y-4'>
             <Tabs defaultValue="crop">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="crop">Crop</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>
                <TabsContent value="crop" className="pt-4">
                    <p className="text-sm text-muted-foreground">Pan, scroll to zoom, and drag handles to crop.</p>
                    <div className="relative w-full max-w-[500px] aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center touch-none mx-auto mt-2">
                    <canvas
                        ref={cropCanvasRef}
                        width={500}
                        height={500}
                        className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />
                    </div>
                </TabsContent>
                 <TabsContent value="edit" className="pt-4">
                    <p className="text-sm text-muted-foreground">Adjust brightness and contrast.</p>
                    <div className="relative w-full max-w-[350px] aspect-auto bg-muted rounded-md overflow-hidden flex items-center justify-center mx-auto mt-2">
                        <canvas ref={editCanvasRef} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className='space-y-4 text-left px-4 pt-4'>
                        <div className="space-y-2">
                            <Label>Brightness ({brightness[0]}%)</Label>
                            <Slider value={brightness} onValueChange={setBrightness} max={200} step={1} />
                        </div>
                        <div className="space-y-2">
                            <Label>Contrast ({contrast[0]}%)</Label>
                            <Slider value={contrast} onValueChange={setContrast} max={200} step={1} />
                        </div>
                    </div>
                 </TabsContent>
             </Tabs>
          </div>
        );
      case 2:
         return (
             <div className="w-full text-center space-y-4">
                 <p className="text-sm text-muted-foreground">Arrange your photos on an A4 sheet.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative w-full aspect-[1/1.414] bg-white rounded-md overflow-hidden flex items-center justify-center border shadow-sm">
                        {finalLayout ? (
                        <Image src={finalLayout} alt="Final Layout Preview" fill className="object-contain p-1" />
                        ) : <Loader2 className='h-8 w-8 animate-spin' /> }
                    </div>
                    <div className='space-y-4 text-left p-2 border rounded-md'>
                        <h4 className='font-medium text-center'>Layout Options</h4>
                        <div className="space-y-2">
                            <Label>Number of Photos ({imageCount})</Label>
                            <Slider value={[imageCount]} onValueChange={(v) => setImageCount(v[0])} min={1} max={30} step={1} />
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="add-border" checked={addBorder} onCheckedChange={(checked) => setAddBorder(checked as boolean)} />
                            <Label htmlFor="add-border">Add Border</Label>
                         </div>
                         {addBorder && (
                            <div className='space-y-2'>
                                <Label htmlFor='border-color'>Border Color</Label>
                                <Input id="border-color" type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-16 p-1"/>
                            </div>
                         )}
                         <hr className="my-4"/>
                         <h4 className='font-medium text-center'>Your Photos</h4>
                         <div className='space-y-2 max-h-48 overflow-y-auto'>
                            {editedImages.map(img => (
                                <div key={img.id} className="flex items-center gap-2 p-1 border rounded-md">
                                    <Image src={img.finalUrl} alt="Edited photo" width={40} height={40} className="object-cover rounded-sm" />
                                    <p className='text-xs flex-1 truncate'>{img.originalFile.name}</p>
                                    <Button variant="ghost" size="icon" className='h-7 w-7' onClick={() => handleRemoveEditedImage(img.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                         </div>
                         <Button variant="outline" className='w-full' onClick={() => setCurrentStep(0)}>
                             <PlusCircle className='mr-2 h-4 w-4' /> Add Another Photo
                         </Button>
                    </div>
                 </div>
                 
             </div>
         );
      default:
        return null;
    }
  }

  // Effect to update edit canvas when crop is performed (on step 1 -> 2 transition)
  useEffect(() => {
    if (currentStep === 1 && activeImage) {
        // This effect will be triggered when brightness/contrast changes
        const sCanvas = cropCanvasRef.current;
        const img = imageRef.current;
        if (!sCanvas || !img) return;

        const dCanvas = editCanvasRef.current;
        if (!dCanvas) return;
        const dCtx = dCanvas.getContext('2d');
        if (!dCtx) return;

        const sourceX = (crop.x - position.x) / scale;
        const sourceY = (crop.y - position.y) / scale;
        const sourceWidth = crop.width / scale;
        const sourceHeight = crop.height / scale;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceWidth;
        tempCanvas.height = sourceHeight;
        tempCanvas.getContext('2d')?.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
        
        const tempImg = new window.Image();
        tempImg.onload = () => {
            dCanvas.width = 350;
            dCanvas.height = 350 / getAspectRatio();
            dCtx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;
            dCtx.drawImage(tempImg, 0, 0, dCanvas.width, dCanvas.height);
        }
        tempImg.src = tempCanvas.toDataURL();
    }
  }, [currentStep, activeImage, crop, scale, position, brightness, contrast, getAspectRatio, imageSrc]);

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Create Passport Photo</CardTitle>
          <CardDescription>Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 min-h-[400px] flex flex-col items-center justify-center">
          {isProcessing && currentStep !== 2 &&(
            <div className="flex flex-col items-center justify-center gap-4 p-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-muted-foreground">Processing...</p>
            </div>
          )}
          {(!isProcessing || currentStep === 2) && renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
              if (currentStep > 0) setCurrentStep(s => s-1);
              if (currentStep === 1) setActiveImage(null);
          }} disabled={currentStep === 0 || isProcessing}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {currentStep === 1 && (
            <Button onClick={saveCroppedAndEditedImage} disabled={!activeImage || isProcessing}>
              Save and Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}

           {currentStep === 2 && (
            <Button onClick={downloadPdf} disabled={isProcessing || editedImages.length === 0}>
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download PDF
            </Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
