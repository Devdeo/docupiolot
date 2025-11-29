export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-foreground prose lg:prose-xl">
          <h2 className="text-2xl font-semibold">1. The Most Important Thing: We Don't Store Your Files</h2>
          <p>
            DocuPilot is designed with privacy as a core feature. All document and image processing performed by our tools happens entirely within your web browser on your own computer ("client-side").
          </p>
          <p>
            <strong>Your files are never uploaded to, processed on, or stored on our servers or any third-party servers.</strong> They do not leave your device. This means you have full control over your data at all times.
          </p>

          <h2 className="text-2xl font-semibold pt-4">2. Information We Collect</h2>
          <p>
            We do not collect any personal information. We do not use cookies or any tracking technologies for advertising purposes. We may use simple, anonymous analytics to understand how many visitors use our site and which tools are most popular, but this data is aggregated and cannot be tied to any individual.
          </p>

          <h2 className="text-2xl font-semibold pt-4">3. How We Use Information</h2>
          <p>
            Since we don't collect your personal information or files, we don't use them for anything. The anonymous usage data we might collect is used solely to improve the application and decide which features to build next.
          </p>

          <h2 className="text-2xl font-semibold pt-4">4. Third-Party Services</h2>
          <p>
            Our application does not integrate with any third-party services that would receive your data.
          </p>

          <h2 className="text-2xl font-semibold pt-4">5. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page. Your continued use of the service after any change in this Privacy Policy will constitute your acceptance of such change.
          </p>

          <h2 className="text-2xl font-semibold pt-4">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please feel free to contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
