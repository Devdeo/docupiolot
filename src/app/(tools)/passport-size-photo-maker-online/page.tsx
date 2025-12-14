'use client';
import { PassportPhotoMaker } from '@/components/dashboard/tools/passport-photo-maker';
import Head from 'next/head';
import { GoogleAdsense } from '@/components/analytics/google-adsense';

export default function Page() {
  const title = "Passport Size Photo Maker — Create 35x45mm Photos Online (India)";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Make passport-size photos for Aadhaar, PAN, Visa, and job forms. Auto crop, background removal, and size adjustment." />
        <link rel="canonical" href="https://docupilot.app/passport-size-photo-maker-online" />
        <meta name="keywords" content="passport photo maker india, 35x45 photo online, passport size editor" />
        <meta property="og:title" content="Passport Size Photo Maker" />
        <meta property="og:description" content="Create passport-size photos online for India forms." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Passport Size Photo Maker",
          "url": "https://docupilot.app/passport-size-photo-maker-online",
          "applicationCategory": "ImageProcessing"
        }
        `}} />
      </Head>
      <PassportPhotoMaker onBack={() => {}} title={title} />
      
      {/* Blog Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <GoogleAdsense />
        
        <article className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mt-8 mb-4">How to Create Passport Size Photos with DocuPilot</h2>
          
          <p className="text-muted-foreground mb-4">
            Getting the perfect passport photo can be frustrating and expensive. Photo studios charge significant amounts for a simple passport photo, and their operating hours may not suit your schedule. DocuPilot's Passport Photo Maker lets you create perfect passport-size photos from any regular photo, right from your home.
          </p>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Supported Photo Sizes</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Indian Passport (35x45mm):</strong> Standard size for Indian passport and visa applications</li>
            <li><strong>Aadhaar Card (25x35mm):</strong> Required size for Aadhaar enrollment and updates</li>
            <li><strong>PAN Card (25x35mm):</strong> Standard size for PAN card applications</li>
            <li><strong>US Visa (51x51mm):</strong> Square format for US visa applications</li>
            <li><strong>UK Visa (35x45mm):</strong> Required size for UK visa and passport</li>
            <li><strong>Schengen Visa (35x45mm):</strong> Standard European visa photo size</li>
            <li><strong>Custom Size:</strong> Set any dimensions for specific requirements</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">How to Create Your Passport Photo</h3>
          
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Upload a clear, front-facing photo of yourself</li>
            <li>Select the required photo size from presets or enter custom dimensions</li>
            <li>Adjust the crop area to center your face correctly</li>
            <li>Choose background color if needed (white is standard for most applications)</li>
            <li>Generate and download your passport-size photos</li>
          </ol>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Indian Passport Photo Requirements</h3>
          
          <p className="text-muted-foreground mb-4">
            For Indian passport applications, photos must meet these requirements:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Size: 35mm x 45mm (width x height)</li>
            <li>Background: Plain white or off-white</li>
            <li>Face should cover 70-80% of the photo height</li>
            <li>Eyes must be open and clearly visible</li>
            <li>Neutral expression with mouth closed</li>
            <li>No glasses or head covering (unless religious requirement)</li>
            <li>Photo should be recent (taken within last 3 months)</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Government Exam Photo Requirements</h3>
          
          <p className="text-muted-foreground mb-4">
            Different government exams have specific photo requirements:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>UPSC:</strong> 3.5cm x 4.5cm with white background, file size 20-300KB</li>
            <li><strong>SSC:</strong> Passport size with white background, file size 20-50KB</li>
            <li><strong>Banking Exams:</strong> Usually 3.5cm x 4.5cm, white background</li>
            <li><strong>Railway Exams:</strong> Passport size, typically under 100KB</li>
            <li><strong>State PSCs:</strong> Requirements vary by state, usually passport size</li>
          </ul>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Tips for Taking the Perfect Photo</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Lighting:</strong> Use natural daylight or bright, even artificial lighting</li>
            <li><strong>Background:</strong> Stand against a plain wall, preferably white or light colored</li>
            <li><strong>Posture:</strong> Face the camera directly with shoulders square</li>
            <li><strong>Expression:</strong> Keep a neutral expression with mouth closed</li>
            <li><strong>Focus:</strong> Ensure the camera focuses on your face, not the background</li>
            <li><strong>Distance:</strong> Position yourself so head and shoulders are in frame</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Background Options</h3>
          
          <p className="text-muted-foreground mb-4">
            While most official documents require a white background, DocuPilot offers several options:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>White:</strong> Standard for most passport and visa applications</li>
            <li><strong>Light Blue:</strong> Required by some countries and institutions</li>
            <li><strong>Light Gray:</strong> Acceptable for some corporate ID photos</li>
            <li><strong>Custom Color:</strong> Set any color for specific requirements</li>
          </ul>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Print Layout Options</h3>
          
          <p className="text-muted-foreground mb-4">
            DocuPilot can generate multiple copies of your passport photo arranged for standard paper sizes:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>4 photos on 4x6 inch photo paper (standard print size)</li>
            <li>8 photos on A4 paper for economical printing</li>
            <li>Single photo for digital submission</li>
            <li>Custom layout for specific requirements</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Privacy and Security</h3>
          
          <p className="text-muted-foreground mb-4">
            Your passport photos contain your identity and should be kept private. DocuPilot processes all photos entirely within your browser. Your images never leave your device and are never stored on any server. This makes it completely safe to create passport photos with sensitive personal images.
          </p>

          <GoogleAdsense />

          <h3 className="text-2xl font-semibold mt-6 mb-3">Frequently Asked Questions</h3>
          
          <div className="space-y-4 mb-4">
            <div>
              <h4 className="font-semibold">Will these photos be accepted for passport applications?</h4>
              <p className="text-muted-foreground">Yes, if you follow the guidelines and use an appropriate source photo. Many users successfully use DocuPilot photos for their passport applications.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Can I use a selfie for passport photos?</h4>
              <p className="text-muted-foreground">While selfies can work, they often have perspective issues. It is better to have someone else take your photo from a few feet away.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">How do I remove the background from my photo?</h4>
              <p className="text-muted-foreground">DocuPilot includes automatic background removal. Simply enable the feature and the tool will detect and replace your background.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Can I make photos in specific KB sizes?</h4>
              <p className="text-muted-foreground">Yes, use our image compressor tool after creating your passport photo to reduce it to specific KB requirements.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mt-6 mb-3">Conclusion</h3>
          
          <p className="text-muted-foreground mb-4">
            DocuPilot's Passport Photo Maker is the perfect solution for creating official photos at home. Whether you need photos for passports, visas, government exams, or ID cards, our tool ensures you get properly sized, correctly formatted photos every time. Save time and money by creating your passport photos yourself, completely free and with complete privacy.
          </p>
        </article>
        
        <GoogleAdsense />
      </div>
    </>
  );
}
