"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login?error=Please+log+in+to+access+this+page.')
    }
  }, [router])

  return <>{children}</>
}

export default ProtectedRoute
