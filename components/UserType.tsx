"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {CheckCircle, XCircle, Loader2, Building2, PersonStanding, Zap, Shield, Globe, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent,} from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function UserType() {
  const [selectedOption, setSelectedOption] = useState<"individual" | "business" | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const router = useRouter()

  const features = {
    individual: [
      { icon: PenTool, text: "Create and sell digital content" },
      { icon: Globe, text: "Build your personal brand" },
      { icon: Zap, text: "Fast and easy setup" }
    ],
    business: [
      { icon: Building2, text: "Multiple team members" },
      { icon: Shield, text: "Enhanced security features" },
      { icon: Zap, text: "API access and integrations" }
    ]
  }

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

  const FeatureCard = ({ type }: { type: "individual" | "business" }) => {
    const isSelected = selectedOption === type
    const Icon = type === "individual" ? PersonStanding : Building2
    const title = type === "individual" ? "Individual or Creator" : "Business Firm or Brand"
    const description = type === "individual" 
      ? "Perfect for freelancers, creators, and individuals" 
      : "Ideal for teams, companies, and organizations"

    return (
      <Card 
        className={`relative overflow-hidden transition-all duration-500 ${
          isSelected 
            ? 'border-primary shadow-2xl scale-105' 
            : 'border-muted hover:border-primary/50 hover:scale-102'
        } cursor-pointer group`}
        onClick={() => handleOptionSelect(type)}
      >
        <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-500 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`} />
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${
              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
            } transition-colors duration-300`}>
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {features[type].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 transition-all duration-300"
                onMouseEnter={() => setHoveredFeature(`${type}-${index}`)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <feature.icon className={`h-5 w-5 ${
                  hoveredFeature === `${type}-${index}` ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className={hoveredFeature === `${type}-${index}` ? 'text-primary' : 'text-muted-foreground'}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {isSelected && (
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              Selected
            </Badge>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Choose Your Journey</h1>
          <p className="text-muted-foreground text-lg">Select the account type that best fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard type="individual" />
          <FeatureCard type="business" />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedOption}
            className="w-full max-w-md h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
          >
            Continue with {selectedOption === 'individual' ? 'Individual' : 'Business'} Account
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">Confirm Your Choice</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 py-4">
            <div className={`p-3 rounded-full ${
              selectedOption === 'individual' ? 'bg-blue-100' : 'bg-green-100'
            } inline-block`}>
              {selectedOption === 'individual' ? (
                <PersonStanding className="h-8 w-8 text-primary" />
              ) : (
                <Building2 className="h-8 w-8 text-primary" />
              )}
            </div>
            <p className="text-lg">
              You&apos;re about to create an
              <span className="font-semibold text-primary"> {selectedOption === 'individual' ? 'Individual' : 'Business'} </span>
              account
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              <XCircle className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Up...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}