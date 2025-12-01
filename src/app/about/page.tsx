import { GoogleAdsense } from '@/components/analytics/google-adsense';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About DocuPilot</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your all-in-one document processing assistant.
        </p>

        <GoogleAdsense />

        <div className="space-y-6 text-foreground">
          <p>
            DocuPilot was born from a simple idea: document and image processing should be easy, secure, and accessible to everyone. We noticed that many online tools either required uploading sensitive files to unknown servers or were locked behind expensive subscriptions. We wanted to create a better alternative.
          </p>

          <GoogleAdsense />

          <p>
            Our mission is to provide a suite of powerful, professional-grade tools that run entirely in your browser. This means your files never leave your computer. Whether you're resizing an image, compressing a PDF, or converting a document, all the processing is done locally. Your privacy and data security are guaranteed.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Our Commitment</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Privacy First:</strong> We will never ask you to upload your files to our servers. All tools work offline in your browser.
            </li>
            <li>
              <strong>Free and Accessible:</strong> We believe essential tools should be available to everyone without cost.
            </li>
            <li>
              <strong>User-Friendly Design:</strong> We strive to make our tools intuitive and easy to use, regardless of your technical skill level.
            </li>
          </ul>

          <GoogleAdsense />

          <p>
            Thank you for choosing DocuPilot. We're constantly working to add new tools and improve existing ones.
          </p>
        </div>

        <GoogleAdsense />
      </div>
    </div>
  );
}
