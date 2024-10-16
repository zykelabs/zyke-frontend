"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"
import {
  User,
  ArrowLeft,
  ArrowRight,
  FilePlus,
  Save,
  Undo,
  X,
  Info,
  Flame,
  Clock,
  Menu,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { Textarea } from "@/components/ui/textarea"
import TemplateCard from "@/components/TemplateCard"

export default function SocialMediaTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showNextPage, setShowNextPage] = useState(false)
  const [selectedBoxes, setSelectedBoxes] = useState<number[]>([])
  const [postsPerIdea, setPostsPerIdea] = useState<number>(1)
  const [showResultPage, setShowResultPage] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [textInputs, setTextInputs] = useState<string[]>([])
  const [trendingTemplates, setTrendingTemplates] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showDescription, setShowDescription] = useState(false)
  const [description, setDescription] = useState("")
  const [totalPosts, setTotalPosts] = useState<number[]>([])
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false)

  const carouselRef = useRef<HTMLDivElement>(null)

  const nextPageTemplates = [
    { name: "How to Build a Solid Portfolio", image: "/images/zyke.png" },
    { name: "The Impact of AI on Digital Design", image: "/images/zyke.png" },
    { name: "A Step-by-Step Guide on Design", image: "/images/zyke.png" },
    { name: "Understanding Minimalist Design", image: "/images/zyke.png" },
    { name: "Branding Essentials for Designers", image: "/images/zyke.png" },
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchTrendingTemplates = async () => {
      setLoading(true)
      try {
        const response = await axios.get("http://127.0.0.1:5000/trending")
        if (Array.isArray(response.data)) {
          setTrendingTemplates(response.data)
        } else {
          console.error("Unexpected response structure:", response.data)
          setError("Unexpected response structure.")
        }
      } catch (error) {
        console.error("Error fetching trending templates:", error)
        setError("Failed to fetch trending templates.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingTemplates()
  }, [])

  const handleTemplateClick = (name: string) => {
    setSelectedTemplate(name)
  }

  const fetchDescription = async (trend: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/trend_description/${trend}`
      )
      setDescription(response.data.description)
      setShowDescription(true)
    } catch (error) {
      console.error("Error fetching description:", error)
      setDescription("Failed to load description. Please try again later.")
      setShowDescription(true)
    }
  }

  const closeDialog = () => {
    setSelectedTemplate(null)
  }

  const closeDescription = () => {
    setShowDescription(false)
  }

  const loadNextPage = () => {
    setSelectedTemplate(null)
    setShowNextPage(true)
  }

  const toggleBoxSelection = (index: number) => {
    if (selectedBoxes.includes(index)) {
      setSelectedBoxes((prev) => prev.filter((i) => i !== index))
      setTextInputs((prev) => prev.filter((_, i) => i !== prev.indexOf("")))
    } else {
      if (selectedBoxes.length >= 3) {
        setShowWarning(true)
        alert("You can only select up to 3 designs.")
      } else {
        setSelectedBoxes((prev) => [...prev, index])
        setTextInputs((prev) => [...prev, ""])
      }
    }
  }

  const giveIdea = () => {
    const ideaNumber = selectedBoxes.length
    if (
      ideaNumber < 1 ||
      ideaNumber > 5 ||
      postsPerIdea < 1
    ) {
      alert(
        "Please select between 1 and 5 ideas and specify at least one post per idea."
      )
      return
    }

    const newTotalPosts = selectedBoxes.flatMap((boxIndex) =>
      Array(postsPerIdea).fill(boxIndex)
    )
    setTotalPosts(newTotalPosts)
    setTextInputs(new Array(newTotalPosts.length).fill(""))
    setShowResultPage(true)
  }

  const handleTextChange = (index: number, text: string) => {
    setTextInputs((prev) => {
      const newInputs = [...prev]
      newInputs[index] = text
      return newInputs
    })
  }

  useEffect(() => {
    if (showResultPage && carouselRef.current) {
      carouselRef.current.scrollTo({
        left: currentImageIndex * carouselRef.current.offsetWidth,
        behavior: "smooth",
      })
    }
  }, [currentImageIndex, showResultPage])

  const renderTrendingTemplates = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {!loading &&
        !error &&
        trendingTemplates.map((trend, index) => (
          <Card
            key={index}
            className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-gray-900">{trend}</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-800"
                      >
                        <Flame className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This template is trending now!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className="text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" /> Updated 2h ago
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between space-x-2">
              <Button
                onClick={() => handleTemplateClick(trend)}
                className="bg-black hover:bg-gray-800 text-white flex-1"
              >
                Use Template
              </Button>
              <Button
                onClick={() => fetchDescription(trend)}
                variant="outline"
                className="border-gray-200 hover:border-gray-300 flex-1 flex items-center justify-center"
              >
                <Info className="h-4 w-4 mr-1" />
                Learn More
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  )

  const renderResultPageContent = () => (
    <Card className="bg-white p-6 md:p-8 rounded-lg w-full max-w-6xl shadow-xl">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl text-gray-900 mb-4">
          Your Design Playground
        </CardTitle>
        <Button
          onClick={() => setShowResultPage(false)}
          className="text-gray-500 hover:text-gray-700"
          variant="ghost"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </Button>
      </CardHeader>
      <CardDescription className="text-gray-500 mb-4">
        Creating {totalPosts.length} posts for {selectedBoxes.length} ideas
      </CardDescription>
      <CardContent className="p-0 relative">
        <Button
          onClick={() => setCurrentImageIndex((prev) => Math.max(prev - 1, 0))}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full z-10"
          disabled={currentImageIndex === 0}
          aria-label="Previous"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={() =>
            setCurrentImageIndex((prev) =>
              Math.min(prev + 1, totalPosts.length - 1)
            )
          }
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full z-10"
          disabled={currentImageIndex === totalPosts.length - 1}
          aria-label="Next"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>

        <div
          ref={carouselRef}
          className="flex overflow-x-scroll scroll-smooth space-x-4 px-8"
        >
          {totalPosts.map((boxIndex, postIndex) => (
            <motion.div
              key={postIndex}
              className="min-w-full flex-shrink-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    {nextPageTemplates[boxIndex].name} - Post {postIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={nextPageTemplates[boxIndex].image}
                    alt={`Template ${boxIndex + 1}`}
                    width={400}
                    height={400}
                    className="object-contain rounded-lg shadow-md mb-4"
                  />
                  <Textarea
                    placeholder={`Enter text for ${nextPageTemplates[boxIndex].name}`}
                    className="h-32 bg-white border-gray-300 text-gray-900 placeholder-gray-400 rounded-md focus:ring-2 focus:ring-gray-400 transition"
                    value={textInputs[postIndex] || ""}
                    onChange={(e) => handleTextChange(postIndex, e.target.value)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-6 space-x-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 flex items-center"
            onClick={() => {
              alert("Undo action triggered")
            }}
          >
            <Undo className="h-5 w-5 mr-2" />
            Undo
          </Button>
          <Button
            onClick={() => {
              setShowResultPage(false)
              setShowNextPage(true)
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
        <Button
          className="bg-black hover:bg-gray-800 text-white flex items-center"
          onClick={() => {
            alert("Save all designs triggered")
          }}
        >
          <Save className="h-5 w-5 mr-2" />
          Save All Designs
        </Button>
      </CardFooter>
    </Card>
  )

  const renderTemplateSelectionDialog = () => (
    <Dialog open={!!selectedTemplate} onOpenChange={closeDialog}>
      <DialogContent className="bg-white text-gray-900">
        <DialogHeader className="flex justify-between items-center">
          <div>
            <DialogTitle className="text-gray-900">
              {selectedTemplate}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Customize your template to fit your brand&apos;s voice and style.
            </DialogDescription>
          </div>
          <Button
            onClick={closeDialog}
            className="text-gray-500 hover:text-gray-700"
            variant="ghost"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>
        <DialogFooter className="flex space-x-4">
          <Button
            variant="outline"
            onClick={closeDialog}
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            Back
          </Button>
          <Button
            onClick={loadNextPage}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const renderWarningDialog = () => (
    <Dialog open={showWarning} onOpenChange={() => setShowWarning(false)}>
      <DialogContent className="bg-white text-gray-900">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-red-600">
            Selection Limit Exceeded
          </DialogTitle>
          <Button
            onClick={() => setShowWarning(false)}
            className="text-gray-500 hover:text-gray-700"
            variant="ghost"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>
        <DialogDescription className="text-gray-600">
          You can only select up to 3 designs. Please deselect one to add
          another.
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={() => setShowWarning(false)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const Navbar = () => (
    <nav className="bg-white text-gray-900 flex items-center justify-between px-4 py-3 shadow-md fixed top-0 w-full z-50">
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => {
            if (isMobile) setMobileSidebarOpen(!mobileSidebarOpen)
          }}
          className="md:hidden bg-transparent hover:bg-gray-100 text-gray-700 p-2 rounded-md"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Zyke Dashboard</h1>
      </div>
      <div className="hidden md:flex space-x-4">
        <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
          Dashboard
        </Button>
        <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
          Templates
        </Button>
        <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
          Settings
        </Button>
        <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
          Profile
        </Button>
      </div>
    </nav>
  )

  const Sidebar = () => (
    <aside
      className={`w-64 bg-white p-6 flex flex-col justify-between border-r border-gray-200 transition-all duration-300 hidden md:flex mt-16`}
    >
      <div className="flex flex-col space-y-4">
        <Button
          onClick={() => console.log("Create new design")}
          className="w-full flex items-center justify-center bg-black hover:bg-gray-800 text-white transition-colors duration-300 rounded-lg p-3 space-x-2"
        >
          <FilePlus className="h-5 w-5" />
          <span>Create Design</span>
        </Button>
      </div>
    </aside>
  )

  const MobileSidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 bg-white p-6 border-r border-gray-200 z-50 md:hidden`}
    >
      <div className="flex flex-col space-y-4">
        <Button
          onClick={() => setMobileSidebarOpen(false)}
          className="self-end text-gray-500 hover:text-gray-700"
          variant="ghost"
          aria-label="Close Sidebar"
        >
          <X className="h-6 w-6" />
        </Button>

        <Button
          onClick={() => console.log("Create new design")}
          className="w-full flex items-center justify-center bg-black hover:bg-gray-800 text-white transition-colors duration-300 rounded-lg p-3 space-x-2"
        >
          <FilePlus className="h-5 w-5" />
          <span>Create Design</span>
        </Button>

        <Button
          variant="outline"
          className="w-full text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center space-x-2"
        >
          Download iOS app
        </Button>
        <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2">
          <span>Upgrade to Pro</span>
        </Button>
        <div className="flex items-center space-x-2 mt-4">
          <User className="h-6 w-6" />
          <p>Tasmay Tibrewal</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Sidebar />
      <MobileSidebar />

      <main className="flex-1 p-6 bg-gray-50 overflow-x-hidden mt-16">
        <AnimatePresence mode="wait">
          {!showNextPage && !showResultPage && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-6 text-gray-900">
                Social Media Post Templates
              </h1>
              <Tabs defaultValue="all" className="mb-6">
                <TabsList className="bg-white">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-gray-200"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="recent"
                    className="data-[state=active]:bg-gray-200"
                  >
                    Recent
                  </TabsTrigger>
                  <TabsTrigger
                    value="popular"
                    className="data-[state=active]:bg-gray-200"
                  >
                    Popular
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  "Trending",
                  "New",
                  "Minimalist",
                  "Illustrations",
                  "Digital Art",
                  "Typography",
                  "Geometric",
                  "Cartoon",
                  "Vintage",
                  "Line Art",
                  "Retro",
                  "Portraits",
                ].map((button, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {button}
                  </Button>
                ))}
              </div>

              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              )}
              {error && (
                <div className="text-red-600 p-4 rounded-md bg-red-100 mb-6">
                  Error: {error}
                </div>
              )}

              {renderTrendingTemplates()}
            </motion.div>
          )}

          {showNextPage && !showResultPage && (
            <motion.div
              key="ideas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <Button
                  onClick={() => setShowNextPage(false)}
                  className="flex items-center bg-white hover:bg-gray-100 text-gray-800 mr-4"
                  aria-label="Back to Trending"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Ideas for Design
                </h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
                {nextPageTemplates.map((template, index) => (
                  <TemplateCard
                    key={index}
                    template={template}
                    isSelected={selectedBoxes.includes(index)}
                    onClick={() => toggleBoxSelection(index)}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label htmlFor="posts-per-idea" className="text-gray-700">
                    Posts per idea:
                  </label>
                  <Input
                    type="number"
                    id="posts-per-idea"
                    min={1}
                    max={5}
                    value={postsPerIdea}
                    onChange={(e) => setPostsPerIdea(Number(e.target.value))}
                    className="w-20 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <Button
                  onClick={giveIdea}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Generate Posts
                </Button>
              </div>
            </motion.div>
          )}

          {showResultPage && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {renderResultPageContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {renderTemplateSelectionDialog()}
      {renderWarningDialog()}

      {showDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
            <Button
              onClick={closeDescription}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              variant="ghost"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </Button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {selectedTemplate}
            </h2>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      )}

      {isMobile && mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={() => setMobileSidebarOpen(false)}></div>
      )}
    </div>
  )
}