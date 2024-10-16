"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ChevronLeft, ChevronRight, Rocket, Share2, ThumbsUp } from "lucide-react"

const ideas = [
  {
    id: 1,
    title: "SpaceX vs Zomato Infographics",
    content: "Create sleek infographics comparing SpaceX's precision in catching boosters to Zomato's accuracy in delivering orders. Compare Zomato delivery partner's speed with a rocket. Highlight metrics like delivery speed, order accuracy, and customer satisfaction with visually appealing space-themed graphics. Include fun facts about both SpaceX and Zomato's operations.",
    type: "infographic"
  },
  {
    id: 2,
    title: "Zomato Mission Control",
    content: "Share a behind-the-scenes look at Zomato's delivery operations styled as a mission control center. Use playful graphics and animations to show how orders are managed with the same dedication and teamwork as SpaceX's missions. Include interviews or fun facts about the delivery team, adding a human touch that resonates with followers. Present it as a cartoony comic and meme structure.",
    type: "comic"
  },
  {
    id: 3,
    title: "Telee..port Your Orders",
    content: "Playfully one-up SpaceX by claiming Zomato has developed teleportation for food delivery. Create a surprising visual where a meal materializes instantly on a dining table with sci-fi effects, adding humor by 'out-teching' the tech giants.",
    type: "challenge"
  },
  {
    id: 4,
    title: "Lightspeed Delivery",
    content: "Craft a humorous comparison showing Zomato's delivery speed outpacing the precision of SpaceX's mechanical arms. Use an unexpected twist where a Zomato delivery person intercepts the booster mid-air to hand over an order, emphasizing lightning-fast service.",
    type: "challenge"
  }
]

export default function GenerateIdeas() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contentType = searchParams.get("type")
  const trend = searchParams.get("trend")

  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([])
  const [postsPerIdea, setPostsPerIdea] = useState(3)
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0)
  const [customIdea, setCustomIdea] = useState("")
  const [includeAIIdea, setIncludeAIIdea] = useState(false)
  const [includeCustomIdea, setIncludeCustomIdea] = useState(false)

  const customIdeaRef = useRef<HTMLDivElement>(null)

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
    const ideasParam = selectedIdeas.join(',')
    const customIdeaParam = includeCustomIdea && customIdea ? encodeURIComponent(customIdea) : ''
    const aiIdeaParam = includeAIIdea ? '&includeAI=true' : ''
    router.push(`/generated-posts?ideas=${ideasParam}&postsPerIdea=${postsPerIdea}&customIdea=${customIdeaParam}${aiIdeaParam}`)
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <Button variant="ghost" className="mb-8" onClick={() => window.location.href='/idea-generator'}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trends
        </Button>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">Generated Ideas for {trend}</h1>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      <>
                        <h2 className="text-2xl font-semibold mb-4">{ideas[currentIdeaIndex].title}</h2>
                        <p className="text-gray-600 mb-4">{ideas[currentIdeaIndex].content}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-indigo-600">{ideas[currentIdeaIndex].type}</span>
                          <Switch
                            checked={selectedIdeas.includes(ideas[currentIdeaIndex].id)}
                            onCheckedChange={() => handleIdeaSelection(ideas[currentIdeaIndex].id)}
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
                <Button 
                  variant="ghost" 
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full bg-white rounded-full shadow-md"
                  onClick={prevIdea}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full bg-white rounded-full shadow-md"
                  onClick={nextIdea}
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

          <Card>
            <CardHeader>
              <CardTitle>Idea Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
              <Button className="w-full" onClick={handleGenerateContent}>
                <Rocket className="mr-2 h-4 w-4" /> Generate Content
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
