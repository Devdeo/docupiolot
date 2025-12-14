import { GoogleAdsense } from '@/components/analytics/google-adsense';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - DocuPilot | Free Online Document & Image Tools',
  description: 'Learn about DocuPilot, your trusted platform for free online document and image processing. 100% privacy-focused with all processing done in your browser.',
  keywords: 'about docupilot, free pdf tools, online document tools india, privacy focused tools',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About DocuPilot</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your trusted partner for free, secure, and privacy-focused document processing.
        </p>

        <GoogleAdsense />

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-4">
              DocuPilot was created with a simple yet powerful vision: to provide everyone with access to professional-grade document and image processing tools, completely free and with absolute privacy. We recognized that millions of users across India and around the world need to compress PDFs, resize images, convert documents, and perform countless other tasks daily.
            </p>
            <p className="mb-4">
              Traditional solutions either require expensive software subscriptions, upload your sensitive files to unknown servers, or add annoying watermarks. We believed there had to be a better way—and DocuPilot is our answer.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4">
              Our mission is to democratize document processing. We believe that students applying for exams, professionals submitting job applications, small business owners creating invoices, and everyday users managing their files should all have access to powerful tools without barriers.
            </p>
            <p className="mb-4">
              We are committed to keeping DocuPilot free forever. We sustain our operations through non-intrusive advertising, which allows us to offer premium features at no cost to our users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Privacy: Our Core Principle</h2>
            <p className="mb-4">
              Privacy is not just a feature for us—it's the foundation of everything we build. Every single tool on DocuPilot processes your files entirely within your web browser. This means:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Your files <strong>never leave your device</strong></li>
              <li>We <strong>cannot see, access, or store</strong> your documents</li>
              <li>No data is sent to our servers or any third party</li>
              <li>Your sensitive information remains 100% private</li>
              <li>You can use our tools even offline (after initial page load)</li>
            </ul>
            <p className="mb-4">
              Whether you are processing passport photos, confidential contracts, financial documents, or personal images, you can trust that your data stays with you.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <p className="mb-4">
              DocuPilot provides a comprehensive suite of tools designed for everyday document and image needs:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold mb-2">PDF Tools</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>PDF Compressor (reduce size in KB)</li>
                  <li>PDF Editor (add text, signatures)</li>
                  <li>PDF Page Organizer</li>
                  <li>PDF to Image Converter</li>
                  <li>PDF to Word Converter</li>
                  <li>PDF Numbering & Watermark</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Image Tools</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Image Compressor (KB resizer)</li>
                  <li>Image Format Converter</li>
                  <li>Photo Editor</li>
                  <li>Passport Photo Maker</li>
                  <li>Image to PDF Converter</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Document Converters</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Word to PDF</li>
                  <li>Excel to PDF</li>
                  <li>PowerPoint to PDF</li>
                  <li>PSD to PDF</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Coming Soon</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>More format converters</li>
                  <li>Advanced editing tools</li>
                  <li>Batch processing features</li>
                  <li>Mobile app</li>
                </ul>
              </div>
            </div>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Built for India</h2>
            <p className="mb-4">
              DocuPilot is designed with Indian users in mind. We understand the specific requirements for:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Government portal uploads (UPSC, SSC, Railways, Banking exams)</li>
              <li>Passport and visa photo requirements</li>
              <li>Aadhaar and PAN card document requirements</li>
              <li>College admission and job application forms</li>
              <li>Document size limits specific to Indian portals</li>
            </ul>
            <p className="mb-4">
              Our tools are optimized for the file size requirements commonly needed across India, making it easy to prepare documents for any official submission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
            <p className="mb-4">
              DocuPilot is built using modern web technologies that enable powerful processing right in your browser:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Client-Side Processing:</strong> All computations happen on your device</li>
              <li><strong>Progressive Web App (PWA):</strong> Install DocuPilot like a native app</li>
              <li><strong>Mobile Responsive:</strong> Works perfectly on phones, tablets, and desktops</li>
              <li><strong>Fast Performance:</strong> Optimized algorithms for quick processing</li>
              <li><strong>No Installation Required:</strong> Works directly in any modern browser</li>
            </ul>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Commitment to You</h2>
            <ul className="list-disc list-inside space-y-3 mb-4">
              <li>
                <strong>Always Free:</strong> Core tools will remain free forever. We will never paywall essential features.
              </li>
              <li>
                <strong>No Watermarks:</strong> Your output files are clean and professional, with no DocuPilot branding added.
              </li>
              <li>
                <strong>No Registration Required:</strong> Use all tools immediately without creating an account.
              </li>
              <li>
                <strong>Unlimited Usage:</strong> Process as many files as you need without restrictions.
              </li>
              <li>
                <strong>Continuous Improvement:</strong> We regularly add new tools and enhance existing ones.
              </li>
              <li>
                <strong>User-Focused Design:</strong> Our interface is intuitive and accessible to users of all skill levels.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              We love hearing from our users! Whether you have suggestions for new features, found a bug, or just want to say hello, please reach out to us:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> <a href="mailto:help@docupilot.co.in" className="text-primary hover:underline">help@docupilot.co.in</a>
            </p>
            <p className="mb-4">
              Thank you for choosing DocuPilot. We are honored to be part of your document processing workflow and are committed to making your experience as smooth and secure as possible.
            </p>
          </section>
        </div>

        <GoogleAdsense />
      </div>
    </div>
  );
}
