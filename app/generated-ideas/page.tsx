import GeneratedIdeas from '@/components/GeneratedIdeas'
import ProtectedRoute from '@/components/ProtectedRoute'

const Ideas = () => {
  return (
    <ProtectedRoute>
      <GeneratedIdeas/>
    </ProtectedRoute>
  )
}

export default Ideas
