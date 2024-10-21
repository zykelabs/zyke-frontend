"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  first_name: string
  last_name: string
}

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const fetchUser = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/generated-ideas')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/protected-route`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          localStorage.removeItem('access_token')
          router.push('/signin?error=Session+expired.+Please+log+in+again.')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/signin?error=An+unexpected+error+occurred.')
      }
    }

    fetchUser()
  }, [isMounted, router])

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold">Welcome, {user.first_name} {user.last_name}!</h1>
        <p className="mt-4">Your email: {user.email}</p>
      </div>
    </div>
  )
}
