"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  X,
  Plus,
  Building,
  Globe,
  Instagram,
  Twitter,
  Loader2,
} from "lucide-react"

// Import shadcn Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface TagInputProps {
  label: string
  tags: string[]
  setTags: (tags: string[]) => void
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  setTags,
}) => {
  const [input, setInput] = useState("")

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      setTags([...tags, input.trim()])
      setInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-md">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-sm py-1 px-2 bg-gray-200 text-gray-800 flex items-center"
          >
            {tag}
            <X
              className="h-3 w-3 ml-1 cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          id={label.toLowerCase()}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="flex-grow bg-white text-black border-gray-300"
        />
        <Button
          onClick={addTag}
          size="sm"
          variant="secondary"
          className="bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  )
}

export default function BrandVoice() {
  const router = useRouter() // Initialize router
  const [brandName, setBrandName] = useState("Corporation")
  const [brandDescription, setBrandDescription] = useState(
    "Leading provider of innovative solutions"
  )
  const [website, setWebsite] = useState("https://www.corp.com")
  const [instagramHandle, setInstagramHandle] = useState("@corp")
  const [twitterHandle, setTwitterHandle] = useState("@corp")

  const [voiceName, setVoiceName] = useState("Corporation Voice 1")
  const [purpose, setPurpose] = useState(
    "To communicate our brand's commitment to innovation and quality solutions"
  )
  const [audience, setAudience] = useState(
    "Business professionals and technology enthusiasts"
  )
  const [tone, setTone] = useState([
    "Professional",
    "Innovative",
    "Trustworthy",
  ])
  const [emotion, setEmotion] = useState(["Confident", "Enthusiastic"])
  const [character, setCharacter] = useState(["Expert", "Visionary"])
  const [syntax, setSyntax] = useState(
    "Use clear, concise language with industry-specific terminology when appropriate"
  )

  // State for Loader and Dialog
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSave = () => {
    // Optionally, handle data persistence here (e.g., API call)

    // Start loading
    setIsLoading(true)

    // Simulate a delay of 5 seconds
    setTimeout(() => {
      setIsLoading(false)
      setIsDialogOpen(true)
    }, 5000)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    router.push("/idea-generator")
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Brand Profile & Voice Editor
        </h1>

        {/* Loader Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
            <Loader2 className="animate-spin h-12 w-12 text-white" />
            <span className="mt-4 text-white text-lg">
              Generating Brand Voice...
            </span>
          </div>
        )}

        {/* Dialog Box */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Brand Voice Generated</DialogTitle>
              <DialogDescription>
                Your brand profile and voice have been successfully generated.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleDialogClose} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Go to Idea Generator
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-200">
              Brand Profile
            </TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-gray-200">
              Brand Voice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-white text-black shadow-xl border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Brand Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" alt={brandName} />
                    <AvatarFallback>
                      <Building className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{brandName}</h2>
                    <p className="text-gray-600">{brandDescription}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand-description">Brand Description</Label>
                  <Textarea
                    id="brand-description"
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    rows={3}
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600">
                      <Globe className="h-5 w-5" />
                    </span>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="flex-1 rounded-none rounded-r-md bg-white text-black border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600">
                      <Instagram className="h-5 w-5" />
                    </span>
                    <Input
                      id="instagram"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      className="flex-1 rounded-none rounded-r-md bg-white text-black border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter Handle</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600">
                      <Twitter className="h-5 w-5" />
                    </span>
                    <Input
                      id="twitter"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      className="flex-1 rounded-none rounded-r-md bg-white text-black border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice">
            <Card className="bg-white text-black shadow-xl border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Brand Voice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="voice-name">Voice Name</Label>
                  <Input
                    id="voice-name"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Audience</Label>
                  <Textarea
                    id="audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    rows={2}
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <TagInput label="Tone" tags={tone} setTags={setTone} />
                <TagInput label="Emotion" tags={emotion} setTags={setEmotion} />
                <TagInput
                  label="Character"
                  tags={character}
                  setTags={setCharacter}
                />

                <div className="space-y-2">
                  <Label htmlFor="syntax">Syntax</Label>
                  <Textarea
                    id="syntax"
                    value={syntax}
                    onChange={(e) => setSyntax(e.target.value)}
                    rows={2}
                    className="bg-white text-black border-gray-300"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button
            onClick={handleSave}
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={isLoading} // Disable button while loading
          >
            Save Brand Profile & Voice
          </Button>
        </div>
      </div>
    </div>
  )
}
