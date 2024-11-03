import GeneratedPosts from "@/components/GeneratedPosts"
import ProtectedRoute from "@/components/ProtectedRoute"


const Posts = () => {
  return (
    <ProtectedRoute requireBrandVoice>
      <GeneratedPosts/>
    </ProtectedRoute>
  )
}

export default Posts
