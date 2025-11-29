export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-foreground prose lg:prose-xl">
          <p>
            Welcome to DocuPilot! These terms and conditions outline the rules and regulations for the use of our website and services.
          </p>

          <h2 className="text-2xl font-semibold pt-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
          </p>

          <h2 className="text-2xl font-semibold pt-4">2. Service Description</h2>
          <p>
            DocuPilot provides a collection of online tools for document and image processing. All tools operate entirely on the client-side, meaning your files are processed within your web browser and are never uploaded to our servers.
          </p>

          <h2 className="text-2xl font-semibold pt-4">3. User Conduct and Responsibilities</h2>
          <p>
            You are solely responsible for the content you process using our tools. You agree not to use the service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.
          </p>
            
          <h2 className="text-2xl font-semibold pt-4">4. No Data Storage</h2>
          <p>
            We do not store, view, or manage any of your personal files. The security and privacy of your documents are your responsibility and remain in your control, as they never leave your computer.
          </p>

          <h2 className="text-2xl font-semibold pt-4">5. Disclaimer of Warranties</h2>
          <p>
            The service is provided "as is" and "as available" without any warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, timely, secure, or error-free. We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable.
          </p>

          <h2 className="text-2xl font-semibold pt-4">6. Limitation of Liability</h2>
          <p>
            In no event shall DocuPilot, nor its owners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>

          <h2 className="text-2xl font-semibold pt-4">7. Governing Law</h2>
          <p>
            These terms shall be governed and construed in accordance with the laws of the jurisdiction in which the website owner resides, without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </div>
  );
}
