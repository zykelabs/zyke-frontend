import Credits from "@/components/payment/Credits"
import ProtectedRoute from "@/components/ProtectedRoute"

const CreditsPage = () => {
  return (
    <ProtectedRoute requireBrandVoice>
      <Credits/>
    </ProtectedRoute>
  )
}

export default CreditsPage
