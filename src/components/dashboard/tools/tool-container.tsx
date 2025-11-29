'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleAdsense } from '@/components/analytics/google-adsense';
import { useRouter } from 'next/navigation';

interface ToolContainerProps {
  title: string;
  children: React.ReactNode;
}

export function ToolContainer({ title, children }: ToolContainerProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="relative mb-8 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="absolute left-0 top-1/2 -translate-y-1/2"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
          {title}
        </h2>
      </div>
      <div className="mx-auto max-w-2xl">
        {children}
        <div className="mt-8">
            <GoogleAdsense />
        </div>
      </div>
    </div>
  );
}
