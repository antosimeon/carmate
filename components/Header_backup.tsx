'use client'
import Image from 'next/image'
import { asset } from '@/lib/basePath'
import LanguageToggle from '@/components/LanguageToggle'

export default function Header() {
  return (
    <header className="header sticky top-0 z-20 h-16 w-full bg-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        {/* Logo + brand */}
        <div className="flex items-center gap-3">
          <Image
            src={asset('/favicon-carmate.png')}   // favicon come logo in header
            alt="CarMate"
            width={48}
            height={48}
            className="rounded-md"
            unoptimized
          />
	  <h1 className="text-lg font-semibold tracking-wide">{('CarMate')}</h1>
        </div>
        {/* Toggle lingua a destra */}
        <LanguageToggle />
      </div>
    </header>
  )
}

