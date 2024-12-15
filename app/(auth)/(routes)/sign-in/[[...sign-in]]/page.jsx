"use client"
import { SignIn } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Share Vault"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Link href="/" className="inline-flex items-center gap-2 text-blue-600 mb-8">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="currentColor" 
                className="mr-1"
              >
                <path d="M6.83 2.72a.75.75 0 0 0-1.06 0L.44 8.05a1.5 1.5 0 0 0 0 2.12l5.33 5.33a.75.75 0 0 0 1.06-1.06L2.12 9.72a.75.75 0 0 1 0-1.06L6.83 3.94a.75.75 0 0 0 0-1.22Z" />
                <path d="M1.72 8.49h13.53a.75.75 0 0 1 0 1.5H1.72a.75.75 0 0 1 0-1.5Z" />
              </svg>
              Back to Home
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl mb-8">
              Welcome back
            </h1>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Loading sign in form...</p>
              </div>
            ) : (
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-25",
                    card: "shadow-none p-0 ",
                    formButtonPrimary: "inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500",
                  },
                }}
              />
            )}
          </div>
        </main>
      </div>
    </section>
  )
}