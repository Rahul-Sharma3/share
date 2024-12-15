'use client'
import CreateRoom from './CreateRoom'
import { Toaster } from 'react-hot-toast'
import { MoveRight, ChevronRight } from 'lucide-react'

function Page() {
  return (
    <div className="h-screen bg-gradient-to-b from-white to-gray-50">
      <Toaster position="top-right" />
      <section className="h-full">
        <div className="mx-auto max-w-screen-xl px-4 pt-8 h-full">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              Instant Share
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-gray-600 sm:text-lg">
              Transfer files directly with your friend.
            </p>         
            <div className="mt-4">
              <CreateRoom />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page