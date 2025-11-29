'use server';
/**
 * @fileOverview A flow for converting PDF files to other formats.
 *
 * - convertFromPdf - A function that handles the PDF conversion process.
 * - ConvertFromPdfInput - The input type for the convertFromPdf function.
 * - ConvertFromPdfOutput - The return type for the convertFromPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ConvertFromPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
  outputFormat: z.enum(['jpg']).describe('The desired output format.'),
});
export type ConvertFromPdfInput = z.infer<typeof ConvertFromPdfInputSchema>;

export const ConvertFromPdfOutputSchema = z.object({
  images: z.array(z.string()).optional().describe('An array of generated image data URIs (for JPG output).'),
});
export type ConvertFromPdfOutput = z.infer<typeof ConvertFromPdfOutputSchema>;


export async function convertFromPdf(input: ConvertFromPdfInput): Promise<ConvertFromPdfOutput> {
  return convertFromPdfFlow(input);
}


const convertFromPdfFlow = ai.defineFlow(
  {
    name: 'convertFromPdfFlow',
    inputSchema: ConvertFromPdfInputSchema,
    outputSchema: ConvertFromPdfOutputSchema,
  },
  async (input) => {
    if (input.outputFormat !== 'jpg') {
        throw new Error(`Unsupported output format: ${input.outputFormat}`);
    }

    const pdfjs = await import('pdfjs-dist/build/pdf.js');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.js');
    
    // @ts-ignore
    pdfjs.GlobalWorkerOptions.worker = new pdfjsWorker.default();

    const pdfData = Buffer.from(input.pdfDataUri.split(',')[1], 'base64');
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    const pageCount = pdf.numPages;
    const images: string[] = [];

    for (let i = 0; i < pageCount; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 2.0 }); // Use a high scale for better quality

        const canvas = await new Promise<HTMLCanvasElement>((resolve) => {
            const canvasEl = document.createElement('canvas');
            resolve(canvasEl);
        });
        
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not create canvas context");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        images.push(canvas.toDataURL('image/jpeg', 0.95)); // High quality JPEG
    }
    await pdf.destroy();

    return { images };
  }
);
