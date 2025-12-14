'use client';
import { PdfStamper } from '@/components/dashboard/tools/pdf-stamper';
import Head from 'next/head';
import { GoogleAdsense } from '@/components/analytics/google-adsense';

export default function Page() {
  const title = "PDF Numbering & Watermark Tool — Add Page Numbers or Watermarks";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Add page numbers or watermark text to your PDF online for free. Fast, easy, and secure." />
        <link rel="canonical" href="https://docupilot.app/pdf-numbering-watermark-online" />
        <meta name="keywords" content="add page numbers to pdf, pdf watermark online, number pdf pages" />
        <meta property="og:title" content="PDF Numbering & Watermark Tool" />
        <meta property="og:description" content="Add numbering or watermark to PDFs online." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF Numbering & Watermark Tool",
          "url": "https://docupilot.app/pdf-numbering-watermark-online",
          "applicationCategory": "PDFUtility"
        }
        `}} />
      </Head>
      <PdfStamper onBack={() => {}} title={title} />
      
      {/* Blog Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <GoogleAdsense />
        
        <article className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mt-8 mb-4">How to Add Page Numbers and Watermarks to PDFs with DocuPilot</h2>
          
          <p className="text-muted-foreground mb-4">
            Professional documents often need page numbers for easy navigation and watermarks for branding or protection. DocuPilot's PDF Stamper tool lets you add both features to any PDF document quickly and easily, without installing software.
          </p>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">What Can You Add to Your PDFs?</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Page Numbers:</strong> Add sequential numbers to organize multi-page documents</li>
            <li><strong>Text Watermarks:</strong> Add company names, "CONFIDENTIAL," "DRAFT," or custom text</li>
            <li><strong>Image Watermarks:</strong> Add logos or stamps to each page</li>
            <li><strong>Date Stamps:</strong> Add the current date to documents</li>
            <li><strong>Custom Headers/Footers:</strong> Add consistent text to top or bottom of pages</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">How to Add Page Numbers</h3>
          
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Upload your PDF file</li>
            <li>Select "Add Page Numbers" option</li>
            <li>Choose number position (top/bottom, left/center/right)</li>
            <li>Select number format (1, 2, 3 or Page 1, Page 2, etc.)</li>
            <li>Adjust font, size, and color</li>
            <li>Download your numbered PDF</li>
          </ol>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Page Number Format Options</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Simple Numbers:</strong> 1, 2, 3, 4...</li>
            <li><strong>Page X:</strong> Page 1, Page 2, Page 3...</li>
            <li><strong>Page X of Y:</strong> Page 1 of 10, Page 2 of 10...</li>
            <li><strong>Roman Numerals:</strong> i, ii, iii, iv... (great for prefaces)</li>
            <li><strong>Custom Prefix:</strong> Add your own text before numbers</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">How to Add Watermarks</h3>
          
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Upload your PDF file</li>
            <li>Select "Add Watermark" option</li>
            <li>Enter your watermark text or upload an image</li>
            <li>Choose position and angle (diagonal watermarks are common)</li>
            <li>Adjust opacity so content remains readable</li>
            <li>Download your watermarked PDF</li>
          </ol>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Common Watermark Uses</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Confidential/Draft:</strong> Mark sensitive or work-in-progress documents</li>
            <li><strong>Company Branding:</strong> Add your company name or logo to documents</li>
            <li><strong>Copyright Protection:</strong> Deter unauthorized copying of your content</li>
            <li><strong>Document Classification:</strong> Mark documents as "Internal Use Only" or "Public"</li>
            <li><strong>Sample Marking:</strong> Mark preview documents as samples</li>
            <li><strong>Date Stamping:</strong> Add approval or review dates</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Watermark Positioning Options</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Diagonal Center:</strong> Classic watermark style across the middle of each page</li>
            <li><strong>Top/Bottom Corner:</strong> Subtle placement that doesn't obstruct content</li>
            <li><strong>Center:</strong> Prominent placement for maximum visibility</li>
            <li><strong>Tiled:</strong> Repeat pattern across the entire page</li>
            <li><strong>Custom Position:</strong> Place exactly where you need it</li>
          </ul>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Opacity and Visibility</h3>
          
          <p className="text-muted-foreground mb-4">
            The key to a good watermark is finding the right balance between visibility and readability:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Light (10-20% opacity):</strong> Barely visible, good for logo branding on professional documents</li>
            <li><strong>Medium (30-50% opacity):</strong> Noticeable but doesn't obstruct reading</li>
            <li><strong>Bold (60-80% opacity):</strong> Very prominent, good for "DRAFT" or "SAMPLE" marks</li>
            <li><strong>Solid (100% opacity):</strong> Completely covers content underneath</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Selective Page Numbering</h3>
          
          <p className="text-muted-foreground mb-4">
            Not all pages need numbering. DocuPilot offers options to:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Skip the first page (cover page)</li>
            <li>Start numbering from a specific page</li>
            <li>Start with a number other than 1</li>
            <li>Number only odd or even pages</li>
            <li>Exclude specific page ranges</li>
          </ul>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Privacy and Security</h3>
          
          <p className="text-muted-foreground mb-4">
            Adding watermarks to confidential documents requires trust. DocuPilot processes all PDFs entirely within your browser. Your documents never leave your device, ensuring your sensitive information remains private even when adding security watermarks.
          </p>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Frequently Asked Questions</h3>
          
          <div className="space-y-4 mb-4">
            <div>
              <h4 className="font-semibold">Can watermarks be removed later?</h4>
              <p className="text-muted-foreground">Watermarks added by DocuPilot become part of the PDF content. They cannot be easily removed, which is why they are effective for protection.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Will page numbers affect existing content?</h4>
              <p className="text-muted-foreground">Page numbers are placed in margins and should not overlap with existing content. You can adjust position if needed.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Can I add both numbers and watermarks?</h4>
              <p className="text-muted-foreground">Yes, you can add page numbers and watermarks to the same document in one operation.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">What image formats work for logo watermarks?</h4>
              <p className="text-muted-foreground">PNG with transparency works best. JPG and other formats are also supported.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Conclusion</h3>
          
          <p className="text-muted-foreground mb-4">
            DocuPilot's PDF Numbering and Watermark tool is essential for creating professional documents. Whether you need simple page numbers for a report or protective watermarks for confidential files, our tool delivers with complete privacy and ease of use. Start adding professional touches to your PDFs today.
          </p>
        </article>
        
        <GoogleAdsense />
      </div>
    </>
  );
}
