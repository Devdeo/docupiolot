import { ShieldAlert } from 'lucide-react';

export default function AdblockDetectedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <div className="max-w-md">
        <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Ad Blocker Detected</h1>
        <p className="text-muted-foreground mb-6">
          It looks like you're using an ad blocker. Our application relies on ad revenue to remain free for everyone.
        </p>
        <div className="text-left bg-muted p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-foreground mb-3">Please disable your ad blocker to continue</h2>
          <p className="text-sm text-muted-foreground">
            You can usually do this by clicking the ad blocker's icon in your browser's toolbar and choosing to pause it or whitelist our site. After you've disabled it, please refresh this page.
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-8">
          We appreciate your support in helping us keep this service running.
        </p>
      </div>
    </div>
  );
}
