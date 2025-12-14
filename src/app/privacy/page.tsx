import { GoogleAdsense } from '@/components/analytics/google-adsense';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - DocuPilot | Your Files Stay Private',
  description: 'DocuPilot privacy policy. Learn how we protect your data by processing all files locally in your browser. No uploads, no storage, complete privacy.',
  keywords: 'privacy policy, docupilot privacy, secure document processing, no data collection',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Last Updated: December 14, 2025
        </p>

        <GoogleAdsense />

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              At DocuPilot (docupilot.co.in), we take your privacy extremely seriously. This Privacy Policy explains how we handle your information when you use our website and services. The most important thing to know is that DocuPilot is designed from the ground up to protect your privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">The Most Important Thing: Your Files Stay on Your Device</h2>
            <p className="mb-4">
              DocuPilot is fundamentally different from most online document tools. All file processing—whether you are compressing PDFs, resizing images, converting documents, or editing photos—happens entirely within your web browser on your own computer or mobile device.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">What this means for you:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Your files are <strong>NEVER uploaded</strong> to our servers</li>
                <li>Your files are <strong>NEVER transmitted</strong> over the internet to us</li>
                <li>Your files are <strong>NEVER stored</strong> on any external server</li>
                <li>Your files <strong>NEVER leave your device</strong></li>
                <li>We <strong>CANNOT see, access, or read</strong> your files in any way</li>
              </ul>
            </div>
            <p className="mb-4">
              This client-side processing approach means you have complete control over your data at all times. Whether you are working with passport photos, confidential business documents, personal images, or sensitive PDFs, they remain private to you alone.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Do Collect</h2>
            <p className="mb-4">
              While we do not collect your files or personal documents, we may collect limited information to improve our services:
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Analytics Data (Anonymous)</h3>
            <p className="mb-4">
              We use Google Analytics to understand how visitors use our website. This data is anonymous and aggregated, meaning it cannot be tied to any individual user. Information collected may include:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Pages visited and time spent on each page</li>
              <li>Which tools are most frequently used</li>
              <li>General geographic region (country/city level)</li>
              <li>Device type (mobile, desktop, tablet)</li>
              <li>Browser type and version</li>
              <li>How users navigate through the site</li>
            </ul>
            <p className="mb-4">
              This information helps us understand which tools are most popular, identify areas for improvement, and make decisions about future features.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Advertising Data</h3>
            <p className="mb-4">
              We use Google AdSense to display advertisements, which helps keep DocuPilot free for all users. Google may use cookies to serve ads based on your interests. You can learn more about Google's advertising practices and opt-out options at <a href="https://policies.google.com/technologies/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google's Advertising Policies</a>.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p className="mb-4">
              DocuPilot may use cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our site (Google Analytics)</li>
              <li><strong>Advertising Cookies:</strong> Used by Google AdSense to display relevant advertisements</li>
            </ul>
            <p className="mb-4">
              You can control cookie preferences through your browser settings. Disabling cookies may affect some website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="mb-4">
              We integrate with the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Google Analytics:</strong> For anonymous usage statistics</li>
              <li><strong>Google AdSense:</strong> For displaying advertisements</li>
              <li><strong>Google Tag Manager:</strong> For managing analytics and advertising tags</li>
            </ul>
            <p className="mb-4">
              These services have their own privacy policies. We encourage you to review them. Importantly, none of these services receive your files or documents—only general website usage data.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4">
              Since your files never leave your device, data security is largely in your control. We recommend:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Using a secure, up-to-date web browser</li>
              <li>Ensuring your device has current security updates</li>
              <li>Using DocuPilot on trusted devices and networks</li>
              <li>Clearing your browser cache if using shared computers</li>
            </ul>
            <p className="mb-4">
              Our website uses HTTPS encryption to protect all data transmitted between your browser and our servers (website content, not your files which never leave your device).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="mb-4">
              DocuPilot is not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">
              Since we do not collect personal data through our tools, most data protection rights regarding file content do not apply. However, regarding any analytics data:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>You can opt out of Google Analytics tracking using browser extensions</li>
              <li>You can manage ad personalization through Google's ad settings</li>
              <li>You can clear cookies through your browser settings</li>
            </ul>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
            <p className="mb-4">
              Your continued use of DocuPilot after any changes indicates your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> <a href="mailto:help@docupilot.co.in" className="text-primary hover:underline">help@docupilot.co.in</a>
            </p>
            <p className="mb-4">
              <strong>Website:</strong> <a href="https://docupilot.co.in" className="text-primary hover:underline">https://docupilot.co.in</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold mb-2">The key points to remember:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Your files are processed entirely in your browser and never uploaded</li>
                <li>We cannot see, access, or store your documents</li>
                <li>We collect only anonymous analytics data to improve our services</li>
                <li>We use advertising to keep DocuPilot free for everyone</li>
                <li>Your privacy is our top priority</li>
              </ul>
            </div>
          </section>
        </div>

        <GoogleAdsense />
      </div>
    </div>
  );
}
