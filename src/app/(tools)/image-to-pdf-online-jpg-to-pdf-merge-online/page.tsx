'use client';
import { AddImagesToPdf } from '@/components/dashboard/tools/add-images-to-pdf';
import Head from 'next/head';
import { GoogleAdsense } from '@/components/analytics/google-adsense';

export default function Page() {
  const title = "Image to PDF Converter — Merge JPG & PNG to PDF Online";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Convert and merge multiple images into a single PDF. Supports JPG, PNG, WebP. Fast and easy-to-use." />
        <link rel="canonical" href="https://docupilot.app/image-to-pdf-online-jpg-to-pdf-merge-online" />
        <meta name="keywords" content="image to pdf, jpg to pdf online, merge images to pdf" />
        <meta property="og:title" content="Image to PDF Converter" />
        <meta property="og:description" content="Merge JPG/PNG into a single PDF online for free." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Image to PDF Converter",
          "url": "https://docupilot.app/image-to-pdf-online-jpg-to-pdf-merge-online",
          "applicationCategory": "PDFUtility"
        }
        `}} />
      </Head>
      <AddImagesToPdf onBack={() => {}} title={title} />
      
      {/* Blog Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <GoogleAdsense />
        
        <article className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mt-8 mb-4">How to Convert and Merge Images to PDF with DocuPilot</h2>
          
          <p className="text-muted-foreground mb-4">
            Need to combine multiple photos into a single document? Whether you are creating a photo album, compiling scanned documents, or preparing image-based reports, DocuPilot's Image to PDF Converter makes it simple. Upload your images, arrange them as needed, and download a perfectly formatted PDF.
          </p>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Supported Image Formats</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>JPG/JPEG:</strong> The most common photo format, perfect for photographs</li>
            <li><strong>PNG:</strong> Ideal for graphics and images with transparency</li>
            <li><strong>WebP:</strong> Modern format with excellent compression</li>
            <li><strong>BMP:</strong> Uncompressed bitmap images</li>
            <li><strong>GIF:</strong> Simple graphics and animations (first frame used)</li>
            <li><strong>TIFF:</strong> High-quality scanned documents</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">How to Convert Images to PDF</h3>
          
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Upload your images by clicking the upload area or dragging and dropping</li>
            <li>Rearrange images by dragging them to your preferred order</li>
            <li>Choose page orientation (portrait or landscape)</li>
            <li>Select paper size (A4, Letter, Legal, etc.)</li>
            <li>Adjust image placement and margins</li>
            <li>Click convert and download your PDF</li>
          </ol>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Common Use Cases</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Scanned Document Compilation:</strong> Combine multiple scanned pages into a single document</li>
            <li><strong>Photo Albums:</strong> Create PDF photo books to share with family and friends</li>
            <li><strong>Receipt Archives:</strong> Compile expense receipts for reimbursement claims</li>
            <li><strong>Portfolio Creation:</strong> Assemble artwork or design samples into a presentation PDF</li>
            <li><strong>ID Document Submission:</strong> Combine front and back of ID cards for applications</li>
            <li><strong>Real Estate Listings:</strong> Create property brochures with multiple photos</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Image Arrangement Options</h3>
          
          <p className="text-muted-foreground mb-4">
            DocuPilot gives you complete control over how images appear in your PDF:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>One Image Per Page:</strong> Each image gets its own page, ideal for full-page photos</li>
            <li><strong>Multiple Images Per Page:</strong> Arrange 2, 4, or 6 images per page for compact layouts</li>
            <li><strong>Custom Sizing:</strong> Fit to page width, fit to page height, or maintain original size</li>
            <li><strong>Margins:</strong> Add spacing around images for professional appearance</li>
            <li><strong>Centering:</strong> Center images on the page or align to edges</li>
          </ul>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Working with Scanned Documents</h3>
          
          <p className="text-muted-foreground mb-4">
            If you are scanning documents page by page, DocuPilot helps you compile them into a proper document:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Upload all scanned pages at once</li>
            <li>Reorder pages by dragging them into the correct sequence</li>
            <li>Rotate individual pages if they were scanned incorrectly</li>
            <li>Remove any duplicate or unwanted pages</li>
            <li>Generate a single, organized PDF document</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Batch Processing</h3>
          
          <p className="text-muted-foreground mb-4">
            Need to convert many images? DocuPilot handles batch processing efficiently. Select all your images at once, and they will be arranged in filename order. You can then rearrange them as needed before generating your PDF. This is perfect for photographers, archivists, and anyone working with large image collections.
          </p>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Privacy and Security</h3>
          
          <p className="text-muted-foreground mb-4">
            Your images may contain personal photos, sensitive documents, or confidential information. DocuPilot processes everything directly in your browser. Your images never leave your device and are never stored on any server. This makes it safe to convert personal photos, ID documents, medical records, and business files.
          </p>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Frequently Asked Questions</h3>
          
          <div className="space-y-4 mb-4">
            <div>
              <h4 className="font-semibold">How many images can I combine?</h4>
              <p className="text-muted-foreground">There is no hard limit. The practical limit depends on your device's memory. Most devices handle hundreds of images easily.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Will image quality be affected?</h4>
              <p className="text-muted-foreground">DocuPilot maintains original image quality by default. You can also choose compression settings if smaller file size is needed.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Can I rotate images before converting?</h4>
              <p className="text-muted-foreground">Yes, you can rotate any image 90 degrees clockwise or counterclockwise before generating the PDF.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">What about different sized images?</h4>
              <p className="text-muted-foreground">DocuPilot handles mixed image sizes gracefully. Each image is scaled to fit the page while maintaining its aspect ratio.</p>
            </div>
          </div>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Tips for Best Results</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Name your files sequentially before uploading for automatic ordering</li>
            <li>Use high-resolution images for printable PDF documents</li>
            <li>Choose landscape orientation for wide images and portrait for tall ones</li>
            <li>Consider the final use when selecting page size and margins</li>
            <li>Preview your PDF before downloading to ensure correct arrangement</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Conclusion</h3>
          
          <p className="text-muted-foreground mb-4">
            DocuPilot's Image to PDF Converter is the ultimate solution for combining images into professional PDF documents. Whether you are creating photo albums, compiling scanned documents, or preparing visual reports, our tool makes the process simple and secure. Try it now and experience the convenience of browser-based image to PDF conversion.
          </p>
        </article>
        
        <GoogleAdsense />
      </div>
    </>
  );
}
