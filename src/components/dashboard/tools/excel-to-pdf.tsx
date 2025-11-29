'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { ToolContainer } from './tool-container';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useInterstitialAd } from '@/hooks/use-interstitial-ad';

interface ToolProps {
  onBack: () => void;
  title: string;
}

const acceptedTypes = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.csv',
  '.xlsx'
];

export function ExcelToPdf({ onBack, title }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { showAd } = useInterstitialAd();
  
  const handleFileSelect = (files: File[]) => {
    setFile(files[0] || null);
  }

  const handleClear = () => {
    setFile(null);
    setIsProcessing(false);
  }

  const handleConvert = async () => {
    if (!file) {
        toast({ variant: 'destructive', title: 'Please select an Excel or CSV file.' });
        return;
    }

    setIsProcessing(true);
    toast({ title: 'Conversion Started', description: 'Your spreadsheet is being converted to PDF.' });

    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!data || data.length === 0) {
            throw new Error('The spreadsheet is empty or could not be read.');
        }

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        const fontSize = 10;
        const margin = 50;
        const tableTop = height - margin;
        const rowHeight = 18;
        const maxRowsPerPage = Math.floor((height - 2 * margin) / rowHeight);

        const drawCell = (text: string, x: number, y: number, cellWidth: number, isHeader: boolean) => {
            page.drawText(text, {
                x: x + 5,
                y,
                font: isHeader ? boldFont : font,
                size: fontSize,
                color: rgb(0, 0, 0),
                maxWidth: cellWidth - 10,
            });
        };
        
        const columnCount = data[0].length;
        const columnWidth = (width - 2 * margin) / columnCount;

        let y = tableTop;
        let rowsOnPage = 0;

        for (let i = 0; i < data.length; i++) {
            if (rowsOnPage >= maxRowsPerPage) {
                page = pdfDoc.addPage();
                y = height - margin;
                rowsOnPage = 0;
            }

            const row = data[i];
            const isHeader = i === 0;
            
            for (let j = 0; j < columnCount; j++) {
                const cellText = row[j] ? String(row[j]) : '';
                drawCell(cellText, margin + j * columnWidth, y - (rowsOnPage * rowHeight), columnWidth, isHeader);
            }
            
            // Draw row lines
            page.drawLine({
                start: { x: margin, y: y - (rowsOnPage * rowHeight) - 5 },
                end: { x: width - margin, y: y - (rowsOnPage * rowHeight) - 5 },
                thickness: 0.5,
                color: rgb(0.8, 0.8, 0.8)
            });

            rowsOnPage++;
        }

        // Draw column lines
        for(let j = 0; j <= columnCount; j++) {
            page.drawLine({
                start: { x: margin + j * columnWidth, y: tableTop + rowHeight - 5 },
                end: { x: margin + j * columnWidth, y: y - ((rowsOnPage - 1) * rowHeight) - 5 },
                thickness: 0.5,
                color: rgb(0.8, 0.8, 0.8)
            });
        }


        const pdfBytes = await pdfDoc.save();
        
        await showAd();

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const originalName = file.name.replace(/\.(csv|xlsx)$/i, '') || 'spreadsheet';
        link.download = `${originalName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        toast({
            title: 'Conversion Successful',
            description: 'Your PDF has been downloaded.',
        });

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            variant: 'destructive',
            title: 'Conversion Failed',
            description: errorMessage
        });
    } finally {
        setIsProcessing(false);
    }
  }

  return (
    <ToolContainer title={title} onBack={onBack}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Convert Excel/CSV to PDF</CardTitle>
          <CardDescription>Upload a CSV or XLSX file to convert it into a PDF document.</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes={acceptedTypes} />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md text-center">
                <p className="font-medium mb-2">{file.name}</p>
                {isProcessing && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Converting...</span>
                    </div>
                )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" size="lg" disabled={!file || isProcessing} onClick={handleConvert}>
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...</> : 'Convert to PDF'}
          </Button>
          {file && (
             <Button variant="outline" className="w-full" onClick={handleClear} disabled={isProcessing}>Start Over</Button>
          )}
        </CardFooter>
      </Card>
    </ToolContainer>
  );
}
