import { GoogleAdsense } from '@/components/analytics/google-adsense';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions - DocuPilot | Free Online Document Tools',
  description: 'Terms and conditions for using DocuPilot free online document and image processing tools. Read our terms of service before using our platform.',
  keywords: 'terms of service, terms and conditions, docupilot terms, user agreement',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Last Updated: December 14, 2025
        </p>

        <GoogleAdsense />

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to DocuPilot (accessible at docupilot.co.in). These Terms and Conditions ("Terms") govern your use of our website and all related services (collectively, the "Service"). By accessing or using DocuPilot, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
            </p>
            <p className="mb-4">
              Please read these Terms carefully before using DocuPilot. Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              DocuPilot provides a collection of free online tools for document and image processing, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>PDF compression, editing, and conversion</li>
              <li>Image compression, conversion, and editing</li>
              <li>Document format conversion (Word, Excel, PowerPoint, PSD to PDF)</li>
              <li>Passport photo creation</li>
              <li>PDF page organization and watermarking</li>
            </ul>
            <p className="mb-4">
              All tools operate entirely on the client-side, meaning your files are processed within your web browser on your own device. Your files are never uploaded to our servers.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Acceptance of Terms</h2>
            <p className="mb-4">
              By using DocuPilot, you confirm that:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>You are at least 13 years of age</li>
              <li>You have the legal capacity to enter into binding agreements</li>
              <li>You will use the Service in compliance with all applicable laws and regulations</li>
              <li>You understand and accept these Terms in full</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities and Conduct</h2>
            <p className="mb-4">
              When using DocuPilot, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Use the Service only for lawful purposes</li>
              <li>Not process any files that are illegal, harmful, or violate the rights of others</li>
              <li>Not attempt to interfere with or disrupt the Service</li>
              <li>Not attempt to gain unauthorized access to any systems or networks</li>
              <li>Not use automated tools to access the Service in a manner that overloads our systems</li>
              <li>Not use the Service to create or distribute malware or harmful content</li>
            </ul>
            <p className="mb-4">
              You are solely responsible for the content you process using our tools. DocuPilot does not monitor, review, or control the files you process, as they never leave your device.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
            <p className="mb-4">
              <strong>Our Content:</strong> The DocuPilot website, including its design, code, logos, trademarks, and content, is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our intellectual property without our express written permission.
            </p>
            <p className="mb-4">
              <strong>Your Content:</strong> You retain all rights to the files and content you process using DocuPilot. We claim no ownership or rights over your documents, images, or any output generated from your files.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Handling</h2>
            <p className="mb-4">
              Your privacy is paramount to us. As detailed in our Privacy Policy:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>All file processing occurs locally in your browser</li>
              <li>We do not upload, store, or access your files</li>
              <li>We do not collect personal information through our tools</li>
              <li>We may collect anonymous analytics data to improve our Service</li>
            </ul>
            <p className="mb-4">
              Please review our Privacy Policy for complete details on how we handle data.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Advertising</h2>
            <p className="mb-4">
              DocuPilot is supported by advertising through Google AdSense. By using our Service, you acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Advertisements will be displayed while using the Service</li>
              <li>We are not responsible for the content of third-party advertisements</li>
              <li>Clicking on advertisements will take you to third-party websites not controlled by us</li>
              <li>Ad blockers may interfere with the proper functioning of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Service Availability</h2>
            <p className="mb-4">
              We strive to maintain DocuPilot's availability but cannot guarantee uninterrupted service. The Service may be temporarily unavailable due to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Scheduled maintenance and updates</li>
              <li>Technical issues beyond our control</li>
              <li>Third-party service disruptions</li>
              <li>Force majeure events</li>
            </ul>
            <p className="mb-4">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p className="mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>WARRANTIES OF MERCHANTABILITY</li>
              <li>FITNESS FOR A PARTICULAR PURPOSE</li>
              <li>NON-INFRINGEMENT</li>
              <li>ACCURACY OR RELIABILITY OF RESULTS</li>
              <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
            </ul>
            <p className="mb-4">
              We do not warrant that the Service will meet your specific requirements, that results will be accurate, or that any errors will be corrected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DOCUPILOT AND ITS OWNERS, OPERATORS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Damages resulting from your use or inability to use the Service</li>
              <li>Damages resulting from any content processed through the Service</li>
              <li>Any third-party content, products, or services</li>
            </ul>
            <p className="mb-4">
              Our total liability for any claims arising from your use of the Service shall not exceed the amount you have paid to us for the Service (which, for free users, is zero).
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify, defend, and hold harmless DocuPilot and its owners, operators, employees, and affiliates from any claims, damages, losses, liabilities, costs, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of third parties</li>
              <li>Any content you process using the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. External Links</h2>
            <p className="mb-4">
              The Service may contain links to third-party websites or services that are not owned or controlled by DocuPilot. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. You access external links at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Modifications to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting the updated Terms on this page. The "Last Updated" date at the top of this page indicates when the Terms were last revised.
            </p>
            <p className="mb-4">
              Your continued use of the Service after any changes constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <GoogleAdsense />

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Governing Law and Jurisdiction</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Severability</h2>
            <p className="mb-4">
              If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its intent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">16. Entire Agreement</h2>
            <p className="mb-4">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and DocuPilot regarding your use of the Service. These Terms supersede any prior agreements or understandings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">17. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> <a href="mailto:help@docupilot.co.in" className="text-primary hover:underline">help@docupilot.co.in</a>
            </p>
            <p className="mb-4">
              <strong>Website:</strong> <a href="https://docupilot.co.in" className="text-primary hover:underline">https://docupilot.co.in</a>
            </p>
          </section>
        </div>

        <GoogleAdsense />
      </div>
    </div>
  );
}
