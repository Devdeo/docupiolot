import dynamic from 'next/dynamic';

const ConvertFromPdfClient = dynamic(() => import('./convert-from-pdf-client'), {
  ssr: false,
});

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function ConvertFromPdf({ onBack, title }: ToolProps) {
  return <ConvertFromPdfClient onBack={onBack} title={title} />;
}
