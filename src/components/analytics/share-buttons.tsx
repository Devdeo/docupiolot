'use client';

import { Facebook, Twitter, Share2, MessageCircle, Linkedin, Mail } from 'lucide-react';

const SITE_URL = 'https://docupilot.co.in';
const SITE_TITLE = 'DocuPilot - Free PDF, Image & Document Tools';
const SITE_DESCRIPTION = 'Free online tools for PDF editing, image compression, converters, photo editing, and more. Fast, secure & 100% private. All processing happens in your browser.';

const shareLinks = [
  {
    name: 'Twitter',
    icon: Twitter,
    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SITE_TITLE)}&url=${encodeURIComponent(SITE_URL)}&hashtags=docupilot,pdftools,imageeditor`,
    color: 'hover:text-blue-400',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(SITE_TITLE)}`,
    color: 'hover:text-blue-600',
  },
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    url: `https://wa.me/?text=${encodeURIComponent(SITE_TITLE + ' ' + SITE_URL)}`,
    color: 'hover:text-green-500',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`,
    color: 'hover:text-blue-700',
  },
  {
    name: 'Telegram',
    icon: Share2,
    url: `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(SITE_TITLE)}`,
    color: 'hover:text-blue-500',
  },
  {
    name: 'Email',
    icon: Mail,
    url: `mailto:?subject=${encodeURIComponent(SITE_TITLE)}&body=${encodeURIComponent(SITE_DESCRIPTION + '\n\n' + SITE_URL)}`,
    color: 'hover:text-gray-600',
  },
];

export function ShareButtons() {
  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-3 justify-center flex-wrap">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">Share with friends:</span>
      <div className="flex gap-2 flex-wrap justify-center">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.name}
              onClick={() => handleShare(link.url)}
              className={`p-2 rounded-full border border-slate-300 dark:border-slate-600 transition-all hover:scale-110 ${link.color}`}
              title={`Share on ${link.name}`}
              aria-label={`Share on ${link.name}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
