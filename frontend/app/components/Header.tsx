'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[var(--border)] z-20 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Image 
          src="/hawkai_logo.png" 
          alt="HawkAI Logo" 
          width={32} 
          height={32}
          className="object-contain"
        />
        <h1 className="text-xl font-bold text-[var(--text-primary)]">HawkAI</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="rounded-full">
          Profile
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <span className="text-sm font-semibold text-[var(--text-primary)]">U</span>
        </Button>
      </div>
    </header>
  );
}
