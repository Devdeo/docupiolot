import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
    >
      <path
        d="M6 2L18 2C22.4183 2 26 5.58172 26 10V22C26 26.4183 22.4183 30 18 30H6V2Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M12 8H6V24H12C16.4183 24 20 20.4183 20 16C20 11.5817 16.4183 8 12 8Z"
        fill="currentColor"
      />
    </svg>
  );
}
