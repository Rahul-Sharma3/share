"use client"
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import RouteLoader from './RouteLoader'

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [prevPath, setPrevPath] = useState(pathname)

  useEffect(() => {
    if (pathname !== prevPath) {
      setIsLoading(true)
      setPrevPath(pathname)
      
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 800)

      return () => clearTimeout(timeout)
    }
  }, [pathname, prevPath])

  return (
    <>
      {isLoading && <RouteLoader />}
      {children}
    </>
  )
} 