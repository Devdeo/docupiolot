import dynamic from 'next/dynamic';

const AddImagesToPdfClient = dynamic(() => import('./add-images-to-pdf-client'), {
  ssr: false,
});

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function AddImagesToPdf({ onBack, title }: ToolProps) {
  return <AddImagesToPdfClient onBack={onBack} title={title} />;
}
