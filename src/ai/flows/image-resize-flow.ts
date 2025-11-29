'use server';
/**
 * @fileOverview An image resizing AI agent.
 *
 * - resizeImage - A function that handles the image resizing process.
 * - ResizeImageInput - The input type for the resizeImage function.
 * - ResizeImageOutput - The return type for the resizeImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResizeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be resized, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  width: z.number().optional().describe('The new width of the image in pixels.'),
  height: z.number().optional().describe('The new height of the image in pixels.'),
  dpi: z.number().optional().describe('The new DPI of the image.'),
  size: z.number().optional().describe('The target size of the image in MB.'),
});
export type ResizeImageInput = z.infer<typeof ResizeImageInputSchema>;

const ResizeImageOutputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "The resized photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ResizeImageOutput = z.infer<typeof ResizeImageOutputSchema>;

export async function resizeImage(input: ResizeImageInput): Promise<ResizeImageOutput> {
  return resizeImageFlow(input);
}

const buildPrompt = (input: ResizeImageInput) => {
    let prompt = `You are an expert image editor. Resize the image provided.`;
    if (input.width) prompt += ` New width should be ${input.width}px.`;
    if (input.height) prompt += ` New height should be ${input.height}px.`;
    if (input.dpi) prompt += ` New DPI should be ${input.dpi}.`;
    if (input.size) prompt += ` Target size should be under ${input.size}MB.`;
    return prompt;
}

const resizeImageFlow = ai.defineFlow(
  {
    name: 'resizeImageFlow',
    inputSchema: ResizeImageInputSchema,
    outputSchema: ResizeImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            { media: { url: input.photoDataUri } },
            { text: buildPrompt(input) }
        ],
        config: {
            responseModalities: ['IMAGE'],
        },
    });

    if (!media.url) {
        throw new Error('Image generation failed');
    }
    
    return { photoDataUri: media.url };
  }
);
