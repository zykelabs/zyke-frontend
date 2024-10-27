// GenerateIdeas.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ChevronLeft, ChevronRight, Rocket, Share2, ThumbsUp, Loader2 } from "lucide-react"

// Define the structure of an Idea and Incoming Idea
interface Idea {
  id: number
  title: string
  content: string
  type: string
}

type IncomingIdea = [string, string]

export default function GenerateIdeas() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Retrieve the 'data' query parameter
  const dataParam = searchParams.get("data")

  // State variables
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [trendName, setTrendName] = useState<string>("")
  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([])
  const [postsPerIdea, setPostsPerIdea] = useState<number>(3)
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState<number>(0)
  const [customIdea, setCustomIdea] = useState<string>("")
  const [includeAIIdea, setIncludeAIIdea] = useState<boolean>(false)
  const [includeCustomIdea, setIncludeCustomIdea] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false) // Loading state
  const [error, setError] = useState<string | null>(null)

  const customIdeaRef = useRef<HTMLDivElement>(null)

  // Parse the incoming data parameter
  useEffect(() => {
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam))
        const { name, ideas: incomingIdeas } = parsedData

        if (!name || !incomingIdeas || !Array.isArray(incomingIdeas)) {
          throw new Error("Invalid data structure.")
        }

        setTrendName(name)

        // Map incoming ideas (nested arrays) to Idea objects
        const mappedIdeas: Idea[] = incomingIdeas.map((idea: IncomingIdea, index) => ({
          id: index + 1, // Assign a unique ID
          title: idea[0], // Use the received title
          content: idea[1], // Use the received content
          type: "generated" // Default type; you can customize as needed
        }))

        setIdeas(mappedIdeas)
        setCurrentIdeaIndex(0)
      } catch (err: any) {
        console.error("Error parsing data:", err)
        setError("Failed to load ideas. Invalid data.")
      }
    } else {
      setError("No data received.")
    }
  }, [dataParam])

  const handleIdeaSelection = (ideaId: number) => {
    setSelectedIdeas(prev => 
      prev.includes(ideaId) 
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    )
  }

  const handlePostsPerIdeaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    setPostsPerIdea(isNaN(value) ? 0 : Math.max(0, value))
  }

  const nextIdea = () => {
    if (currentIdeaIndex === ideas.length - 1) {
      setCurrentIdeaIndex(-1) // Custom idea index
    } else {
      setCurrentIdeaIndex(prev => prev + 1)
    }
  }

  const prevIdea = () => {
    if (currentIdeaIndex === -1) {
      setCurrentIdeaIndex(ideas.length - 1)
    } else {
      setCurrentIdeaIndex(prev => prev - 1)
    }
  }

  const handleGenerateContent = () => {
    if (
      selectedIdeas.length === 0 &&
      (!customIdea || !includeCustomIdea) &&
      !includeAIIdea
    ) {
      alert("Please select at least one idea, create a custom idea, or include an AI-generated idea.")
      return
    }
    if (postsPerIdea === 0) {
      alert("Please enter a number of posts greater than 0.")
      return
    }

    setIsLoading(true) // Show loader

    // Prepare query parameters
    const selectedIdeasParam = selectedIdeas.join(',')
    const customIdeaParam = includeCustomIdea && customIdea ? encodeURIComponent(customIdea) : ''
    const aiIdeaParam = includeAIIdea ? '&includeAI=true' : ''

    // Set a timeout for 5 seconds before redirecting
    setTimeout(() => {
      router.push(`/generated-posts?ideas=${selectedIdeasParam}&postsPerIdea=${postsPerIdea}&customIdea=${customIdeaParam}${aiIdeaParam}`)
    }, 5000)
  }

  const handleIncludeCustomIdeaChange = (checked: boolean) => {
    setIncludeCustomIdea(checked)
    if (!checked) {
      setCustomIdea("")
      if (currentIdeaIndex === -1) {
        setCurrentIdeaIndex(0) // Navigate away from custom idea section
      }
    } else {
      setCurrentIdeaIndex(-1)
      setTimeout(() => {
        customIdeaRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  // Prevent accessing undefined ideas
  const currentIdea = ideas[currentIdeaIndex]

  if (error) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 relative flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push('/idea-generator')} className="w-full">
                Go Back
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TooltipProvider>
    )
  }

  // Show loading state if ideas are not yet loaded
  if (dataParam && ideas.length === 0 && !error) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 relative flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
            <span className="mt-4 text-lg text-gray-700">Loading ideas...</span>
          </div>
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 relative">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="animate-spin h-12 w-12 text-white" />
              <span className="mt-4 text-white text-lg">Generating Content...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        <Button variant="ghost" className="mb-8" onClick={() => router.push('/idea-generator')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trends
        </Button>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Generated Ideas for {trendName}</h1>

        {/* Create Custom Idea Button */}
        <Button 
          className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold"
          onClick={() => {
            setCurrentIdeaIndex(-1)
            setIncludeCustomIdea(true)
            setTimeout(() => {
              customIdeaRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
          }}
        >
          + Create Your Own Custom Idea
        </Button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Idea Flashcards */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Idea Flashcards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdeaIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className={`p-6 rounded-lg shadow-lg min-h-[200px] 
                      ${currentIdeaIndex === -1 ? 'border-2 border-indigo-500 bg-indigo-50' : 'bg-white'}
                    `}
                  >
                    {currentIdeaIndex === -1 ? (
                      <div ref={customIdeaRef} id="customIdeaSection">
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Create Your Own Idea</h2>
                        <Textarea
                          placeholder="Describe your custom idea here..."
                          value={customIdea}
                          onChange={(e) => setCustomIdea(e.target.value)}
                          className="w-full h-32"
                        />
                        {customIdea && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                              setCustomIdea("")
                              setIncludeCustomIdea(false)
                            }}
                          >
                            Remove Custom Idea
                          </Button>
                        )}
                      </div>
                    ) : (
                      currentIdea ? (
                        <>
                          <h2 className="text-2xl font-semibold mb-4">{currentIdea.title}</h2>
                          <p className="text-gray-600 mb-4">{currentIdea.content}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-indigo-600">{currentIdea.type}</span>
                            <Switch
                              checked={selectedIdeas.includes(currentIdea.id)}
                              onCheckedChange={() => handleIdeaSelection(currentIdea.id)}
                            />
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500">Idea not found.</p>
                      )
                    )}
                  </motion.div>
                </AnimatePresence>
                {/* Previous Button */}
                <Button 
                  variant="ghost" 
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full bg-white rounded-full shadow-md"
                  onClick={prevIdea}
                  aria-label="Previous Idea"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                {/* Next Button */}
                <Button 
                  variant="ghost" 
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full bg-white rounded-full shadow-md"
                  onClick={nextIdea}
                  aria-label="Next Idea"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="text-sm text-gray-500">
                {currentIdeaIndex === -1 ? 'Custom' : `${currentIdeaIndex + 1} / ${ideas.length}`}
              </div>
              <div className="space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Like this idea</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share this idea</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardFooter>
          </Card>

          {/* Idea Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Idea Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Posts per Idea */}
              <div>
                <Label htmlFor="postsPerIdea">Posts per Idea</Label>
                <Input
                  id="postsPerIdea"
                  type="number"
                  min={1}
                  value={postsPerIdea}
                  onChange={handlePostsPerIdeaChange}
                  className="mt-1"
                />
              </div>
              {/* Selected Ideas */}
              <div>
                <Label>Selected Ideas</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {selectedIdeas.map(id => {
                    const idea = ideas.find(i => i.id === id)
                    return (
                      <div key={id} className="flex items-center space-x-2 mb-2">
                        <Switch 
                          checked={true} 
                          onCheckedChange={() => handleIdeaSelection(id)} 
                        />
                        <span>{idea?.title}</span>
                      </div>
                    )
                  })}
                  {includeCustomIdea && customIdea && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Switch 
                        checked={includeCustomIdea} 
                        onCheckedChange={(checked) => handleIncludeCustomIdeaChange(checked)} 
                      />
                      <span>Custom Idea</span>
                    </div>
                  )}
                </ScrollArea>
              </div>
              {/* Include AI-Generated Idea */}
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100">
                <Switch
                  checked={includeAIIdea}
                  onCheckedChange={setIncludeAIIdea}
                  className="data-[state=checked]:bg-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Include 1 more AI-Generated Idea</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full flex items-center justify-center"
                onClick={handleGenerateContent}
                disabled={isLoading} // Disable button while loading
              >
                <Rocket className="mr-2 h-4 w-4" /> Generate Content
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
