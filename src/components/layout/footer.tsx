import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              Privacy You Can Trust
            </p>
            <p className="text-sm max-w-md mt-1">
             DocuPilot never stores your files. All processing happens **locally in your browser**, ensuring 100% privacy and complete data security.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-sm">
            <nav className="flex gap-4">
              <Link href="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </nav>
            <p className="text-xs mt-2">
              © {new Date().getFullYear()} DocuPilot | docupilot.co.in - All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
