import Link from 'next/link';
import { Logo } from '../logo';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="py-4 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-primary">
            DocuPilot
          </h1>
        </Link>
        <nav className="hidden md:flex gap-4">
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/privacy">Privacy</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/terms">Terms</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
