import dynamic from 'next/dynamic';

const PdfResizeClient = dynamic(() => import('./pdf-resize-client'), {
  ssr: false,
});

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function PdfResize({ onBack, title }: ToolProps) {
  return <PdfResizeClient onBack={onBack} title={title} />;
}
