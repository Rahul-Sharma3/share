"use client"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <div className="hidden md:block fixed left-8 top-24 z-50">
      <button
        onClick={() => router.back()}
        className="group relative flex items-center gap-2 overflow-hidden rounded-full
          backdrop-blur-md bg-white/10 px-7 py-4 
          transition-all duration-300 hover:pr-9
          border border-white/10 hover:border-white/20
          shadow-[0_0_20px_rgba(0,0,0,0.1)]
          hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]"
      >
        <ArrowLeft className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-white font-medium">Back</span>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 
          transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Animated glow effect */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10 
          animate-gradient-shift opacity-0 group-hover:opacity-100" />
      </button>
    </div>
  )
} 