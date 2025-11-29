import dynamic from 'next/dynamic';

const PdfCompressClient = dynamic(() => import('./pdf-compress-client'), {
  ssr: false,
});

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function PdfCompress({ onBack, title }: ToolProps) {
  return <PdfCompressClient onBack={onBack} title={title} />;
}
