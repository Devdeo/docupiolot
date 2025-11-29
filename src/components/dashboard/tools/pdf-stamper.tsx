import dynamic from 'next/dynamic';

const PdfStamperClient = dynamic(() => import('./pdf-stamper-client'), {
  ssr: false,
});

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function PdfStamper({ onBack, title }: ToolProps) {
  return <PdfStamperClient onBack={onBack} title={title} />;
}
