import { GoogleAdsense } from '@/components/analytics/google-adsense';
import { Metadata } from 'next';
import { Mail, Globe, Clock, MessageSquare, HelpCircle, Bug, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - DocuPilot | Get Help & Support',
  description: 'Contact the DocuPilot team for support, feedback, or inquiries. We are here to help you with any questions about our free document and image processing tools.',
  keywords: 'contact docupilot, support, help, feedback, customer service',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We would love to hear from you! Whether you have questions, feedback, or need assistance, our team is here to help.
        </p>

        <GoogleAdsense />

        <div className="space-y-8">
          {/* Contact Methods */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Email Us</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we will get back to you as soon as possible.
                </p>
                <a 
                  href="mailto:help@docupilot.co.in" 
                  className="text-primary hover:underline font-medium text-lg"
                >
                  help@docupilot.co.in
                </a>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Website</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Visit our website for tools, resources, and more information.
                </p>
                <a 
                  href="https://docupilot.co.in" 
                  className="text-primary hover:underline font-medium text-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  docupilot.co.in
                </a>
              </div>
            </div>
          </section>

          <GoogleAdsense />

          {/* Response Time */}
          <section>
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Response Time</h3>
              </div>
              <p className="text-muted-foreground">
                We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, please indicate this in your email subject line.
              </p>
            </div>
          </section>

          {/* Types of Inquiries */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">How Can We Help You?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg w-fit mb-4">
                  <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">General Support</h3>
                <p className="text-muted-foreground text-sm">
                  Questions about how to use our tools, troubleshooting issues, or general inquiries about DocuPilot.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg w-fit mb-4">
                  <Bug className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Report a Bug</h3>
                <p className="text-muted-foreground text-sm">
                  Found something not working correctly? Let us know so we can fix it and improve the experience for everyone.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg w-fit mb-4">
                  <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Feature Requests</h3>
                <p className="text-muted-foreground text-sm">
                  Have ideas for new tools or features? We love hearing suggestions from our users to make DocuPilot even better.
                </p>
              </div>
            </div>
          </section>

          <GoogleAdsense />

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Is DocuPilot really free?</h3>
                <p className="text-muted-foreground">
                  Yes! All our tools are completely free to use with no hidden charges, no watermarks, and no usage limits. We are supported by advertising which allows us to keep everything free.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Are my files safe and private?</h3>
                <p className="text-muted-foreground">
                  Absolutely. All file processing happens entirely in your browser on your own device. Your files are never uploaded to our servers, and we cannot see or access them in any way.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Do I need to create an account?</h3>
                <p className="text-muted-foreground">
                  No registration is required. You can use all our tools immediately without signing up or providing any personal information.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">What browsers are supported?</h3>
                <p className="text-muted-foreground">
                  DocuPilot works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. For the best experience, we recommend using the latest version of your browser.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Can I use DocuPilot on mobile devices?</h3>
                <p className="text-muted-foreground">
                  Yes! DocuPilot is fully responsive and works on smartphones and tablets. You can also install it as a Progressive Web App (PWA) for a more app-like experience.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">How do I compress a PDF to a specific size?</h3>
                <p className="text-muted-foreground">
                  Simply upload your PDF to our PDF Compressor tool, enter your desired target size in KB or MB, and click compress. The tool will optimize your PDF to meet your exact size requirements.
                </p>
              </div>
            </div>
          </section>

          <GoogleAdsense />

          {/* Additional Info */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Additional Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Feedback</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Your feedback helps us improve! We genuinely want to know what you think about DocuPilot—what you love, what could be better, and what new features would help you most.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Business Inquiries</h3>
                <p className="text-muted-foreground mb-4">
                  For partnerships, advertising inquiries, or business-related matters, please reach out via email with the subject line "Business Inquiry" for priority handling.
                </p>
              </div>
            </div>
          </section>

          {/* Thank You Note */}
          <section>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Thank You for Using DocuPilot!</h3>
              <p className="text-muted-foreground">
                We appreciate your support and trust in our platform. Every user who finds DocuPilot helpful makes our work worthwhile. If you enjoy our tools, please consider sharing DocuPilot with friends and colleagues who might benefit from free, privacy-focused document processing.
              </p>
            </div>
          </section>
        </div>

        <GoogleAdsense />
      </div>
    </div>
  );
}
