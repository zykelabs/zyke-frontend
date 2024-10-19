import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Loader2 } from 'lucide-react'

export default function GoogleCallback() {
  const router = useRouter()

  useEffect(() => {
    const { token, error } = router.query

    if (token) {
      // Store the access token securely
      localStorage.setItem('access_token', token as string)
      // Redirect to dashboard or desired page
      router.push('/dashboard')
    } else if (error) {
      // Handle error, possibly show a message
      console.error('Google OAuth Error:', error)
      router.push(`/login?error=${encodeURIComponent(error as string)}`)
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Processing authentication...</p>
      </div>
    </div>
  )
}