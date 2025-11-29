import type {NextConfig} from 'next';
import path from 'path';
import fs from 'fs';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is the correct way to handle the pdf.js worker in Next.js
    const pdfjsWorkerPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
    const pdfjsWorkerFile = path.join(pdfjsWorkerPath, 'build', 'pdf.worker.min.js');

    // Copy the worker to the public directory
    if (!isServer) {
        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }
        const dest = path.join(publicDir, 'pdf.worker.min.js');
        if (!fs.existsSync(dest)) {
            fs.copyFileSync(pdfjsWorkerFile, dest);
        }
    }

    return config;
  }
};

export default nextConfig;
