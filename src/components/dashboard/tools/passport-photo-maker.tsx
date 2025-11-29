import dynamic from 'next/dynamic';

const PassportPhotoMakerClient = dynamic(
  () => import('./passport-photo-maker-client'),
  {
    ssr: false,
  }
);

interface ToolProps {
  onBack: () => void;
  title: string;
}

export function PassportPhotoMaker({ onBack, title }: ToolProps) {
  return <PassportPhotoMakerClient onBack={onBack} title={title} />;
}
