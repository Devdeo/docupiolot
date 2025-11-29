'use server';
/**
 * @fileOverview A flow for converting PDF text to other document formats using AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    HeadingLevel,
} from 'docx';
import * as xlsx from 'xlsx';


const ConvertPdfInputSchema = z.object({
  pdfText: z.string().describe('The full text content extracted from a PDF.'),
  targetFormat: z.enum(['docx', 'xlsx', 'pptx']).describe('The desired output format.'),
});
export type ConvertPdfInput = z.infer<typeof ConvertPdfInputSchema>;

const ConvertPdfOutputSchema = z.object({
  base64Data: z.string().describe('The base64 encoded string of the resulting file.'),
});
export type ConvertPdfOutput = z.infer<typeof ConvertPdfOutputSchema>;


export async function convertPdf(input: ConvertPdfInput): Promise<ConvertPdfOutput> {
  return convertPdfFlow(input);
}

const docxPrompt = `You are an expert document analyst. Your task is to convert the following text, extracted from a PDF, into a structured JSON object that can be used to generate a Word (DOCX) document.

Analyze the text and identify structural elements like headings, paragraphs, and lists.

Output a JSON object with a single key "content", which is an array of objects. Each object must have a "type" property which can be "heading", "paragraph", or "list".

- For "heading", include a "text" property and a "level" property (1 for main titles, 2 for subtitles, etc.).
- For "paragraph", include a "text" property.
- For "list", include an "items" property which is an array of strings.

Here is the text to convert:
{{{pdfText}}}`;

const xlsxPrompt = `You are an expert data analyst. Your task is to convert the following text, which was extracted from a PDF, into a structured JSON object representing a spreadsheet.

Analyze the text and identify tabular data. Extract the headers and all rows of data.

Output a JSON object with a single key "sheets". "sheets" should be an array of objects, where each object represents a sheet and has two keys: "name" (a string for the sheet name, e.g., "Sheet1") and "data" (an array of arrays, where the first inner array is the headers and subsequent inner arrays are the data rows).

If there is no clear tabular data, create a single sheet with the text organized into a few logical columns.

Here is the text to convert:
{{{pdfText}}}`;

const pptxPrompt = `You are an expert presentation designer. Your task is to convert the following text, extracted from a PDF, into a structured JSON object for a PowerPoint (PPTX) presentation.

Analyze the text and structure it into a series of slides. Identify a title for each slide and its content, which could be bullet points or short paragraphs.

Output a JSON object with a single key "slides", which is an array of objects. Each object must have a "title" property (a string) and a "content" property (an array of strings, where each string is a bullet point or paragraph).

Here is the text to convert:
{{{pdfText}}}`;


const convertPdfFlow = ai.defineFlow(
  {
    name: 'convertPdfFlow',
    inputSchema: ConvertPdfInputSchema,
    outputSchema: ConvertPdfOutputSchema,
  },
  async (input) => {
    let base64Data = '';

    if (input.targetFormat === 'docx') {
        const { output } = await ai.generate({
            prompt: docxPrompt,
            input: { pdfText: input.pdfText },
            output: {
                schema: z.object({
                    content: z.array(z.object({
                        type: z.enum(['heading', 'paragraph', 'list']),
                        text: z.string().optional(),
                        level: z.number().optional(),
                        items: z.array(z.string()).optional(),
                    }))
                })
            }
        });
        if (!output) throw new Error("AI did not return valid structured data for DOCX.");
        
        const doc = new Document({
            sections: [{
                children: output.content.map(item => {
                    if (item.type === 'heading') {
                        return new Paragraph({ text: item.text || '', heading: `HEADING_${item.level || 1}` as HeadingLevel });
                    }
                    if (item.type === 'list' && item.items) {
                        return new Paragraph({
                            children: item.items.map(listItem => new TextRun(listItem)),
                            bullet: { level: 0 }
                        });
                    }
                    return new Paragraph({ text: item.text || ''});
                })
            }]
        });
        base64Data = await Packer.toBase64String(doc);

    } else if (input.targetFormat === 'xlsx') {
        const { output } = await ai.generate({
            prompt: xlsxPrompt,
            input: { pdfText: input.pdfText },
            output: {
                schema: z.object({
                    sheets: z.array(z.object({
                        name: z.string(),
                        data: z.array(z.array(z.string())),
                    }))
                })
            }
        });
        if (!output) throw new Error("AI did not return valid structured data for XLSX.");

        const wb = xlsx.utils.book_new();
        output.sheets.forEach(sheet => {
            const ws = xlsx.utils.aoa_to_sheet(sheet.data);
            xlsx.utils.book_append_sheet(wb, ws, sheet.name);
        });
        const wbout = xlsx.write(wb, { bookType: 'xlsx', type: 'base64' });
        base64Data = wbout;
        
    } else if (input.targetFormat === 'pptx') {
       // PPTX generation is complex and requires a library like 'pptxgenjs'.
       // To keep dependencies minimal for now, we'll return a structured text file.
       // A full implementation would parse the AI output and use pptxgenjs to create slides.
        const { output } = await ai.generate({
            prompt: pptxPrompt,
            input: { pdfText: input.pdfText },
            output: {
                schema: z.object({
                    slides: z.array(z.object({
                        title: z.string(),
                        content: z.array(z.string()),
                    }))
                })
            }
        });
        if (!output) throw new Error("AI did not return valid structured data for PPTX.");
        
        // Placeholder: Create a DOCX as a PPTX substitute to demonstrate flow.
        // In a real scenario, you would use a library like 'pptxgenjs'.
        const doc = new Document({
            sections: [{
                children: output.slides.flatMap(slide => [
                    new Paragraph({ text: slide.title, heading: HeadingLevel.HEADING_1 }),
                    ...slide.content.map(point => new Paragraph({ text: point, bullet: { level: 0 }})),
                    new Paragraph({ text: '' }) // Spacer
                ])
            }]
        });
        base64Data = await Packer.toBase64String(doc);
    }

    return { base64Data };
  }
);
