import dynamic from 'next/dynamic';

const PdfToImageClient = dynamic(() => import('./pdf-to-image-client'), {
  ssr: false,
});

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function PdfToImage({ onBack, title }: ToolProps) {
  return <PdfToImageClient onBack={onBack} title={title} />;
}
