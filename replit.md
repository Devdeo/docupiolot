# DocuPilot

## Overview
DocuPilot is a free online document and image processing platform that offers tools for PDF editing, image compression, converters, photo editing, passport photo creation, and more. All processing happens client-side in the browser for 100% privacy.

**Live Domain**: https://docupilot.co.in

## Technology Stack
- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animation**: Framer Motion
- **PDF Processing**: pdf-lib, pdfjs-dist
- **Image Processing**: Client-side browser APIs
- **Document Processing**: docx, xlsx libraries

## Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── (tools)/           # Tool-specific pages (PDF, image converters, etc.)
│   ├── about/             # About page
│   ├── privacy/           # Privacy policy page
│   ├── terms/             # Terms of service page
│   ├── layout.tsx         # Root layout with SEO, analytics
│   └── page.tsx           # Home page
├── components/
│   ├── analytics/         # Google AdSense, Tag Manager components
│   ├── dashboard/         # Main app components and tools
│   ├── layout/            # Header and Footer
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions and tool definitions
```

## Available Tools
- PDF to Image converter
- Image to PDF converter
- PDF Compressor
- Image Compressor
- PDF Editor
- Word to PDF converter
- Excel to PDF converter
- Passport Photo Maker
- Image Format Converter
- And more...

## Configuration

### Development
Run the development server:
```bash
npm run dev
```
Server runs on port 5000 with `--hostname 0.0.0.0` for Replit compatibility.

### Production Build
```bash
npm run build
npm start
```

## Analytics & Advertising
- **Google AdSense**: ca-pub-5651978142792714
- **Google Tag Manager**: GTM-MFJSNB9T

## SEO
- Canonical URL: https://docupilot.co.in
- Open Graph and Twitter Card meta tags configured
- JSON-LD structured data for Organization and WebSite schemas
- Sitemap.ts generating sitemap for all pages

## Key Features
- All file processing is done client-side (no server uploads)
- No file storage on servers
- Privacy-focused design
- Ad-supported free service
- Adblock detection with redirect

## Recent Changes
- December 2024: Initial Replit setup
  - Configured for port 5000
  - Updated domain to docupilot.co.in
  - Added Google AdSense (ca-pub-5651978142792714)
  - Added Google Tag Manager (GTM-MFJSNB9T)
  - Enhanced SEO meta tags

## User Preferences
- Domain: docupilot.co.in
- Target audience: India users
- AdSense Publisher ID: ca-pub-5651978142792714
- GTM Container ID: GTM-MFJSNB9T
