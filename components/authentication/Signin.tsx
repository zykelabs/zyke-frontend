"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Briefcase, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export default function SignInPage() {
  const [selectedOption, setSelectedOption] = useState<"individual" | "business" | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleOptionSelect = (option: "individual" | "business") => {
    setSelectedOption(option)
  }

  const handleConfirm = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsModalOpen(false)
      router.push("/dashboard")
    }, 2000)
  }

  const handleProceed = () => {
    setIsModalOpen(true)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 p-4 relative">
        <div className="max-w-2xl w-full">
          <Card className="shadow-xl bg-white border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-gray-800">Choose Your Account Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AccountOption
                  icon={<User className="h-12 w-12 text-blue-600" />}
                  title="Individual or Creator"
                  description="For individual creators and freelancers"
                  isSelected={selectedOption === "individual"}
                  onClick={() => handleOptionSelect("individual")}
                />
                <AccountOption
                  icon={<Briefcase className="h-12 w-12 text-green-600" />}
                  title="Business Firm or Brand"
                  description="For businesses and brands"
                  isSelected={selectedOption === "business"}
                  onClick={() => handleOptionSelect("business")}
                />
              </div>

              <div className="text-center mt-8">
                <Button
                  onClick={handleProceed}
                  disabled={!selectedOption}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Proceed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        {selectedOption && (
          <div className="fixed bottom-8 w-1/2 max-w-md">
            <Progress value={selectedOption ? 50 : 0} className="h-2 bg-blue-200" />
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          selectedOption={selectedOption}
          isLoading={isLoading}
        />
      </div>
    </TooltipProvider>
  )
}

function AccountOption({ icon, title, description, isSelected, onClick }: { icon: React.ReactNode, title: string, description: string, isSelected: boolean, onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`p-6 rounded-lg border-2 transition-all duration-300 ease-in-out ${
            isSelected
              ? "border-blue-600 bg-blue-50 shadow-md"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          } cursor-pointer`}
          onClick={onClick}
        >
          <div className="flex flex-col items-center">
            {icon}
            <h3 className="text-xl font-semibold text-gray-800 mt-4">{title}</h3>
            <p className="text-center text-gray-600 mt-2">{description}</p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function ConfirmationModal({ isOpen, onClose, onConfirm, selectedOption, isLoading }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, selectedOption: "individual" | "business" | null, isLoading: boolean }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">Confirm Your Selection</DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <p>
            You have selected <strong>{selectedOption === "individual" ? "Individual or Creator" : "Business Firm or Brand"}</strong> account type.
          </p>
        </div>
        <DialogFooter className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onClose} className="text-gray-600 hover:bg-gray-100">
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}