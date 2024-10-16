'use client'

import { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, ChevronsUpDown, Sparkles, Zap, HelpCircle, Save, RefreshCw, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type BrandVoice = {
  tone: string
  product: string
  voice: string
  audience: string[]
  contentTypes: string[]
  personalityTraits: { trait: string; value: number; opposite: string }[]
  keywords: string[]
  industryFocus: string
}

const audienceOptions = [
  "Millennials", "Gen Z", "Professionals", "Parents", "Students", "Entrepreneurs", "Tech enthusiasts", "Fitness lovers", "Travelers", "Foodies"
]

const contentTypeOptions = [
  "Blog posts", "Social media", "Video scripts", "Podcasts", "Email newsletters", "Product descriptions", "Whitepapers", "Case studies", "Infographics", "Webinars"
]

const personalityTraits = [
  { trait: "Formal", opposite: "Casual" },
  { trait: "Serious", opposite: "Playful" },
  { trait: "Traditional", opposite: "Modern" },
  { trait: "Reserved", opposite: "Bold" },
  { trait: "Professional", opposite: "Conversational" }
]

const industryOptions = [
  "Technology", "Healthcare", "Finance", "Education", "Entertainment", "Retail", "Manufacturing", "Real Estate", "Travel", "Food & Beverage"
]

export default function IndividualUser() {
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({
    tone: '',
    product: '',
    voice: '',
    audience: [],
    contentTypes: [],
    personalityTraits: personalityTraits.map(pt => ({ ...pt, value: 50 })),
    keywords: [],
    industryFocus: ''
  })
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [openIndustry, setOpenIndustry] = useState(false)
  const [alert, setAlert] = useState<{ title: string; description: string } | null>(null)
  const [brandVoiceDescription, setBrandVoiceDescription] = useState<string>('')

  useEffect(() => {
    const calculateCompletion = () => {
      let completed = 0
      if (brandVoice.tone) completed++
      if (brandVoice.product) completed++
      if (brandVoice.voice) completed++
      if (brandVoice.audience.length > 0) completed++
      if (brandVoice.contentTypes.length > 0) completed++
      if (brandVoice.keywords.length > 0) completed++
      if (brandVoice.industryFocus) completed++
      return (completed / 7) * 100
    }
    setCompletionPercentage(calculateCompletion())
  }, [brandVoice])

  const handlePersonalityChange = (trait: string, value: number) => {
    setBrandVoice(prev => ({
      ...prev,
      personalityTraits: prev.personalityTraits.map(pt => 
        pt.trait === trait ? { ...pt, value } : pt
      )
    }))
  }

  const handleAudienceChange = (audience: string) => {
    setBrandVoice(prev => ({
      ...prev,
      audience: prev.audience.includes(audience)
        ? prev.audience.filter(a => a !== audience)
        : [...prev.audience, audience]
    }))
  }

  const handleContentTypeChange = (contentType: string) => {
    setBrandVoice(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(contentType)
        ? prev.contentTypes.filter(ct => ct !== contentType)
        : [...prev.contentTypes, contentType]
    }))
  }

  const handleKeywordAdd = (keyword: string) => {
    if (keyword && !brandVoice.keywords.includes(keyword)) {
      setBrandVoice(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }))
    }
  }

  const handleKeywordRemove = (keyword: string) => {
    setBrandVoice(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const generateBrandVoiceDescription = () => {
    setIsGenerating(true)
    // Simulating API call
    setTimeout(() => {
      const description = `Your ${brandVoice.industryFocus} brand voice is ${brandVoice.tone} and ${brandVoice.voice}. It's designed to appeal to ${brandVoice.audience.join(', ')} through ${brandVoice.contentTypes.join(', ')}. Your communication style tends to be ${brandVoice.personalityTraits.map(pt => pt.value > 50 ? pt.trait : pt.opposite).join(', ')}. Key themes include: ${brandVoice.keywords.join(', ')}.`
      setBrandVoiceDescription(description)
      setIsGenerating(false)
      setAlert({
        title: "Brand Voice Generated",
        description: "Your unique brand voice has been created successfully."
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Brand Voice Creator</h1>
          <p className="text-muted-foreground mt-2">Define your unique brand personality</p>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder-avatar.jpg" alt="Brand" />
          <AvatarFallback>BD</AvatarFallback>
        </Avatar>
      </div>

      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">{completionPercentage.toFixed(0)}% complete</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="basics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="industry">Industry</TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <Card>
            <CardHeader>
              <CardTitle>Brand Basics</CardTitle>
              <CardDescription>Define the core elements of your brand voice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="tone" className="text-sm font-medium">Brand Tone</label>
                <Input
                  id="tone"
                  placeholder="e.g., Friendly, Professional, Energetic"
                  value={brandVoice.tone}
                  onChange={(e) => setBrandVoice(prev => ({ ...prev, tone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="product" className="text-sm font-medium">Product or Service</label>
                <Input
                  id="product"
                  placeholder="What do you offer?"
                  value={brandVoice.product}
                  onChange={(e) => setBrandVoice(prev => ({ ...prev, product: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="voice" className="text-sm font-medium">Brand Voice</label>
                <Textarea
                  id="voice"
                  placeholder="Describe your brand&apos;s unique voice..."
                  value={brandVoice.voice}
                  onChange={(e) => setBrandVoice(prev => ({ ...prev, voice: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Who are you speaking to?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {audienceOptions.map((audience) => (
                  <Badge
                    key={audience}
                    variant={brandVoice.audience.includes(audience) ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-white"
                    onClick={() => handleAudienceChange(audience)}
                  >
                    {audience}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Types</CardTitle>
              <CardDescription>What kind of content do you create?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {contentTypeOptions.map((contentType) => (
                  <Badge
                    key={contentType}
                    variant={brandVoice.contentTypes.includes(contentType) ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-white"
                    onClick={() => handleContentTypeChange(contentType)}
                  >
                    {contentType}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality">
          <Card>
            <CardHeader>
              <CardTitle>Personality Traits</CardTitle>
              <CardDescription>Fine-tune your brand&apos;s personality.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {brandVoice.personalityTraits.map((pt) => (
                <div key={pt.trait} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{pt.opposite}</span>
                    <span>{pt.trait}</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[pt.value]}
                    onValueChange={([value]) => handlePersonalityChange(pt.trait, value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Brand Keywords</CardTitle>
              <CardDescription>Add keywords that represent your brand.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {brandVoice.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="cursor-pointer flex items-center"
                    onClick={() => handleKeywordRemove(keyword)}
                  >
                    {keyword}
                    <button className="ml-1 text-xs">×</button>
                  </Badge>
                ))}
              </div>
              <form onSubmit={(e) => {
                e.preventDefault()
                const input = e.currentTarget.keyword as HTMLInputElement
                handleKeywordAdd(input.value.trim())
                input.value = ''
              }}>
                <div className="flex gap-2">
                  <Input name="keyword" placeholder="Enter a keyword" />
                  <Button type="submit">Add</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industry">
          <Card>
            <CardHeader>
              <CardTitle>Industry Focus</CardTitle>
              <CardDescription>Select your primary industry.</CardDescription>
            </CardHeader>
            <CardContent>
              <Popover open={openIndustry} onOpenChange={setOpenIndustry}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openIndustry}
                    className="w-full justify-between"
                  >
                    {brandVoice.industryFocus || "Select industry..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search industry..." />
                    <CommandEmpty>No industry found.</CommandEmpty>
                    <CommandGroup>
                      {industryOptions.map((industry) => (
                        <CommandItem
                          key={industry}
                          onSelect={() => {
                            setBrandVoice(prev => ({ ...prev, industryFocus: industry }))
                            setOpenIndustry(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${brandVoice.industryFocus === industry ? "opacity-100" : "opacity-0"}`}
                          />
                          {industry}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Your Brand Voice
          </CardTitle>
          <CardDescription>Based on your inputs, here&apos;s a summary of your brand voice.</CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating brand voice description...</span>
            </div>
          ) : (
            <p className="text-lg">{brandVoiceDescription || "Click 'Generate Content' to create your brand voice description."}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setAlert({ title: "Profile Saved", description: "Your brand voice profile has been saved successfully." })}>
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
          <Button onClick={generateBrandVoiceDescription} disabled={isGenerating || completionPercentage < 100}>
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 flex justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <HelpCircle className="w-4 h-4 mr-2" />
              Need Help?
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <h3 className="font-medium mb-2">Brand Voice Creator Help</h3>
            <p className="text-sm text-muted-foreground">
              This tool helps you define your brand&apos;s unique voice. Fill out each section to create a comprehensive brand profile. If you need more assistance, please contact our support team.
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
