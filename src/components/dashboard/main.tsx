'use client';

import { motion } from 'framer-motion';
import { tools as toolDefinitions } from '@/lib/tools';
import { ToolGrid } from './tool-grid';
import { GoogleAdsense } from '../analytics/google-adsense';

export function DocuPilotApp() {
  return (
    <div className="w-full bg-background text-foreground">
      <motion.div
        key="grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <header className="py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
              Your all-in-one document processing assistant. Resize, convert, and edit with professional-grade tools.
            </p>
          </div>
        </header>
        <main className="container mx-auto px-4 pb-16">
          <div className="mb-8">
            <GoogleAdsense />
          </div>
          <ToolGrid tools={toolDefinitions} />
        </main>
      </motion.div>
    </div>
  );
}
