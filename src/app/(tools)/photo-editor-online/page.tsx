'use client';
import { ImageEditor } from '@/components/dashboard/tools/image-editor';
import Head from 'next/head';
import { GoogleAdsense } from '@/components/analytics/google-adsense';

export default function Page() {
  const title = "Online Photo Editor — Crop, Rotate, Enhance Images Free";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Free online photo editor for cropping, resizing, filters, color correction, and enhancements. Works on mobile and desktop without downloading software." />
        <link rel="canonical" href="https://docupilot.app/photo-editor-online" />
        <meta name="keywords" content="photo editor online, crop image online, image editing tool, free image editor, online photoshop alternative" />
        <meta property="og:title" content="Free Online Photo Editor" />
        <meta property="og:description" content="Edit photos online — crop, resize, enhance, and filter images easily." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Online Photo Editor",
          "url": "https://docupilot.app/photo-editor-online",
          "applicationCategory": "ImageEditing"
        }
        `}} />
      </Head>
      <ImageEditor onBack={() => {}} title={title} />
      
      {/* Blog Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <GoogleAdsense />
        
        <article className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mt-8 mb-4">Complete Guide to Photo Editing with DocuPilot</h2>
          
          <p className="text-muted-foreground mb-4">
            Professional photo editing no longer requires expensive software. DocuPilot's Online Photo Editor provides all the essential tools you need to enhance, crop, resize, and transform your photos right in your browser. Whether you're preparing images for social media, documents, or personal use, our free tool has you covered.
          </p>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Available Editing Tools</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Crop:</strong> Remove unwanted areas and focus on what matters</li>
            <li><strong>Resize:</strong> Change image dimensions for specific requirements</li>
            <li><strong>Rotate:</strong> Fix image orientation, rotate 90 degrees or any custom angle</li>
            <li><strong>Flip:</strong> Mirror images horizontally or vertically</li>
            <li><strong>Brightness/Contrast:</strong> Adjust light levels and image contrast</li>
            <li><strong>Saturation:</strong> Enhance or reduce color intensity</li>
            <li><strong>Filters:</strong> Apply preset effects like grayscale, sepia, and more</li>
            <li><strong>Sharpen:</strong> Enhance image details and clarity</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">How to Edit Your Photos</h3>
          
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Upload your image by clicking the upload area or dragging and dropping</li>
            <li>Select the editing tool you want to use from the toolbar</li>
            <li>Make your adjustments using sliders or input controls</li>
            <li>Preview changes in real-time</li>
            <li>Apply or undo changes as needed</li>
            <li>Download your edited image</li>
          </ol>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Cropping and Composition</h3>
          
          <p className="text-muted-foreground mb-4">
            Cropping is one of the most powerful editing tools. Use it to:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Remove distracting backgrounds and focus on the subject</li>
            <li>Create specific aspect ratios (1:1 for Instagram, 16:9 for YouTube thumbnails)</li>
            <li>Apply the rule of thirds for better composition</li>
            <li>Extract portions of larger images</li>
            <li>Prepare images for specific frame sizes</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Color Correction Basics</h3>
          
          <p className="text-muted-foreground mb-4">
            Understanding color adjustments helps you get the best results:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Brightness:</strong> Controls overall lightness. Increase for dark photos, decrease for overexposed ones.</li>
            <li><strong>Contrast:</strong> Difference between light and dark areas. More contrast makes images pop, less creates a softer look.</li>
            <li><strong>Saturation:</strong> Color intensity. Increase for vibrant colors, decrease for muted tones, zero for black and white.</li>
            <li><strong>Hue:</strong> Shifts all colors around the color wheel. Use sparingly for creative effects.</li>
          </ul>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Working with Filters</h3>
          
          <p className="text-muted-foreground mb-4">
            Filters apply preset adjustments for quick stylistic effects:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Grayscale:</strong> Classic black and white conversion</li>
            <li><strong>Sepia:</strong> Vintage brownish tone for nostalgic feel</li>
            <li><strong>Invert:</strong> Negative effect, inverts all colors</li>
            <li><strong>Blur:</strong> Softens the entire image or specific areas</li>
            <li><strong>Sharpen:</strong> Enhances edges for crisper appearance</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Common Photo Editing Tasks</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Profile Photos:</strong> Crop to square, adjust lighting, enhance colors</li>
            <li><strong>Product Photos:</strong> Brighten, sharpen, remove backgrounds</li>
            <li><strong>Social Media Posts:</strong> Crop to platform specifications, apply filters</li>
            <li><strong>Document Photos:</strong> Enhance contrast for better readability</li>
            <li><strong>Old Photo Restoration:</strong> Correct fading, adjust colors, sharpen</li>
            <li><strong>Landscape Photos:</strong> Enhance saturation, adjust contrast, crop composition</li>
          </ul>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Non-Destructive Editing</h3>
          
          <p className="text-muted-foreground mb-4">
            DocuPilot's editor allows you to preview all changes before applying them. You can undo any adjustment and start over without affecting the original image. Your source file is never modified—you always download a new copy with your edits applied.
          </p>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Privacy and Security</h3>
          
          <p className="text-muted-foreground mb-4">
            Your photos often contain personal moments and sensitive images. DocuPilot processes all images entirely within your browser. Your photos never leave your device and are never uploaded to any server. This makes it completely safe to edit personal photos, family pictures, and private images.
          </p>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Frequently Asked Questions</h3>
          
          <div className="space-y-4 mb-4">
            <div>
              <h4 className="font-semibold">What image formats are supported?</h4>
              <p className="text-muted-foreground">DocuPilot supports JPG, JPEG, PNG, WebP, BMP, and GIF formats for both input and output.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Can I edit RAW camera files?</h4>
              <p className="text-muted-foreground">RAW files need to be converted to JPG or PNG first. Use your camera's software or a dedicated converter.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Is there an undo feature?</h4>
              <p className="text-muted-foreground">Yes, you can undo and redo multiple steps. You can also reset to the original image at any time.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Can I edit multiple photos at once?</h4>
              <p className="text-muted-foreground">Currently, photos are edited one at a time. You can quickly upload and edit additional photos after saving each one.</p>
            </div>
          </div>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Tips for Better Photo Editing</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Start with subtle adjustments and increase as needed</li>
            <li>Compare before and after frequently to avoid over-editing</li>
            <li>Crop for composition improvement, not just size reduction</li>
            <li>Use brightness and contrast together for balanced results</li>
            <li>Save in PNG for lossless quality, JPG for smaller file sizes</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Conclusion</h3>
          
          <p className="text-muted-foreground mb-4">
            DocuPilot's Online Photo Editor puts professional editing capabilities at your fingertips. Whether you're enhancing photos for social media, preparing images for documents, or just making your pictures look better, our free tool delivers with complete privacy and ease of use. Start editing your photos today and see the difference professional tools can make.
          </p>
        </article>
        
        <GoogleAdsense />
      </div>
    </>
  );
}
