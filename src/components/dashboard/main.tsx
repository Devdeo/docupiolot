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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">DocuPilot – Smart Document Processing Made Simple</h1>
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg mt-4">
             Your all-in-one suite for fast, secure, and professional document editing. Convert, resize, compress, and optimize your files instantly — all inside your browser.
            </p>
          </div>
        </header>
        <main className="container mx-auto px-4 pb-16">
          <div className="mb-8">
            <GoogleAdsense />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-8">Powerful Tools to Boost Your Workflow</h2>
          <ToolGrid tools={toolDefinitions} />
        </main>
      </motion.div>
    </div>
  );
}
