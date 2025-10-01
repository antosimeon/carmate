'use client'
import Image from 'next/image'
import { asset } from '@/lib/basePath'

export default function Header() {
  return (
    <header className="header sticky top-0 z-20 h-16 w-full bg-white border-b border-gray-200">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        {/* Logo + brand */}
        <div className="flex items-center gap-3">
          <Image
            src={asset('/favicon-carmate.png')}   // favicon as logo in header
            alt="CarMate"
            width={48}
            height={48}
            className="rounded-md"
            unoptimized
          />
          <h1 className="text-lg font-semibold tracking-wide">CarMate</h1>
        </div>
        {/* Language toggle on the right */}
        <div />
      </div>
    </header>
  )
}

