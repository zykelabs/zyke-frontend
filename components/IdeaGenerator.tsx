'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Sparkles, TrendingUp, Hash, Image, Youtube, Globe, Menu, X, MessageCircle, Home, Settings } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import ProtectedRoute from "./ProtectedRoute"
import { useSpring, animated } from "react-spring"
import * as Icons from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes";
interface Trend {
  name: string;
  summary: string;
  description: string;
}

interface IdeaResponse {
  ideas: string[];
}

const contentTypes = [
  { value: "trend", label: "Trend", icon: TrendingUp },
  { value: "blog", label: "Blog", icon: Hash },
  { value: "instagram_post", label: "Instagram Post", icon: Image },
  { value: "news_article", label: "News Article", icon: Globe },
  { value: "tweet", label: "Tweet", icon: Hash },
  { value: "linkedin_post", label: "LinkedIn Post", icon: Hash },
  { value: "product_image", label: "Product Image", icon: Image },
  { value: "reel", label: "Reel", icon: Youtube },
  { value: "youtube_video", label: "YouTube Video", icon: Youtube },
  { value: "text_prompt", label: "Text / Prompt", icon: Hash },
  { value: "hashtag", label: "Hashtags", icon: Hash },
  { value: "website", label: "Website", icon: Globe },
];

const contentTypeDescriptions: { [key: string]: string } = {
  trend: "Generate trending social media topics from the latest trends.",
  blog: "Create engaging social media topics from blog content.",
  instagram_post: "Generate social media topics based on Instagram posts.",
  news_article: "Turn news articles into social media topics that spark conversations.",
  tweet: "Generate social media topics based on existing tweets.",
  linkedin_post: "Create social media topics from professional LinkedIn posts.",
  product_image: "Generate topic ideas for social media based on product images.",
  reel: "Turn Instagram Reels into social media topic ideas.",
  youtube_video: "Create social media topics based on YouTube video content.",
  text_prompt: "Generate social media topics from text prompts or ideas.",
  hashtag: "Create social media topics from trending hashtags.",
  website: "Generate social media topics from website content and updates.",
};

const fetchTrends = async (): Promise<Trend[]> => {
  try {
    const response = await fetch("http://127.0.0.1:5000/trends/fetch_trends");
    const data = await response.json();

    if (data.trends && Array.isArray(data.trends)) {
      const mappedTrends: Trend[] = data.trends.map((trendArr: any[]) => ({
        name: trendArr[0],
        summary: trendArr[1],
        description: trendArr[2],
      }));
      return mappedTrends;
    } else {
      console.error("Unexpected API response structure:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error;
  }
};

// Start of the Navbar Implementation

const navItems = [
  { name: "Dashboard", icon: Icons.LayoutDashboard, href: "/dashboard" },
  { name: "Ideas", icon: Icons.Sparkles, href: "/ideas" },
  { name: "Chatbot", icon: Icons.MessageCircle, href: "/chatbot" },
  { name: "Analytics", icon: Icons.BarChart2, href: "/analytics" },
  { name: "Settings", icon: Icons.Settings, href: "/settings" },
];

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection]);

  return scrollDirection;
};

function LegendaryNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const scrollDirection = useScrollDirection();

  const navAnimation = useSpring({
    transform: scrollDirection === "down" ? "translateY(-100%)" : "translateY(0%)",
    config: { tension: 300, friction: 20 },
  });

  const logoProps = useSpring({
    loop: { reverse: true },
    from: { rotateY: 0 },
    to: { rotateY: 360 },
    config: { duration: 3000 },
  });

  return (
    <animated.nav
      style={navAnimation}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <animated.div style={logoProps}>
              <Icons.Zap className="w-8 h-8 text-primary" />
            </animated.div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Zyke
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* <div className="hidden md:block">
              <Input type="search" placeholder="Search..." className="w-64" />
            </div> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icons.Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5">3</Badge>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem>New message from Alice</DropdownMenuItem>
                <DropdownMenuItem>Your post is trending!</DropdownMenuItem>
                <DropdownMenuItem>You have a new follower</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    <Icons.Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Icons.Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Icons.Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </animated.nav>
  );
}

// End of Navbar Implementation

export default function Component() {
  const router = useRouter()
  const [inputData, setInputData] = useState<{ [key: string]: string }>({})
  const [contentType, setContentType] = useState<string>("")
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [trends, setTrends] = useState<Trend[]>([])
  const [isFetchingTrends, setIsFetchingTrends] = useState<boolean>(false)
  const [charCount, setCharCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrendsData()
  }, [])

  const fetchTrendsData = async () => {
    setIsFetchingTrends(true)
    try {
      const data = await fetchTrends()
      console.log("Fetched trends:", data)
      setTrends(data)
    } catch (error) {
      console.error("Error fetching trends:", error)
      setError("Failed to load trends. Please try again later.")
      setTrends([])
    } finally {
      setIsFetchingTrends(false)
    }
  }

  const handleContentTypeChange = (value: string) => {
    setContentType(value)
    setInputData({})
    setSelectedTrend(null)
    setCharCount(0)
  }

  const handleInputChange = (name: string, value: string) => {
    setInputData((prev) => ({ ...prev, [name]: value }))
    setCharCount(value.length)
  }

  const handleTrendSelect = (value: string) => {
    const trend = trends.find((trend) => trend.name === value) || null
    setSelectedTrend(trend)
    setInputData({ trend: value })
  }

  const handleGenerateIdeas = async () => {
    if (!contentType) {
      setError("Please select a content type.")
      return
    }

    if (contentType === "trend" && !selectedTrend) {
      setError("Please select a trend.")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("http://127.0.0.1:5000/trends/generate_ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          inputData,
          selectedTrend: selectedTrend ? selectedTrend.name : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate ideas")
      }

      const data: IdeaResponse = await response.json()
      router.push(
        `/generated-ideas?ideas=${encodeURIComponent(JSON.stringify(data))}`
      )
    } catch (error) {
      console.error("Error generating ideas:", error)
      setError("Failed to generate ideas. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderInputField = () => {
    switch (contentType) {
      case "trend":
        return isFetchingTrends ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 animate-spin" /> Loading trends...
          </div>
        ) : trends.length > 0 ? (
          <Select onValueChange={handleTrendSelect}>
            <SelectTrigger className="w-full text-left">
              <SelectValue placeholder="Select a trend" />
            </SelectTrigger>
            <SelectContent>
              {trends.map((trend) => (
                <SelectItem key={trend.name} value={trend.name}>
                  <div className="flex flex-col">
                    <span className="font-bold">{trend.name}</span>
                    <span className="text-sm text-gray-500 truncate">{trend.summary}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>No trends available</p>
        )
      case "blog":
      case "news_article":
      case "product_image":
      case "youtube_video":
      case "website":
        return <Input placeholder="Enter URL" onChange={(e) => handleInputChange("url", e.target.value)} className="w-full" />
      case "instagram_post":
      case "tweet":
      case "linkedin_post":
      case "reel":
      case "text_prompt":
      case "hashtag":
        return (
          <>
            <Textarea placeholder="Enter your content (Max 300 characters)" onChange={(e) => handleInputChange("content", e.target.value)} maxLength={300} className="w-full" />
            <p className="text-right text-xs text-gray-500">{charCount}/300 characters</p>
          </>
        )
      default:
        return null
    }
  }

  return (
    <ProtectedRoute>
      <TooltipProvider>
        <div className="flex bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
          {/* Navbar */}
          <LegendaryNavbar />

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-30 mt-16">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800">What do you want to design today?</h1>
            </header>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {contentTypes.map(({ value, label, icon: Icon }) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 md:p-4 bg-white shadow-lg rounded-lg transition ${
                    contentType === value ? "border-2 border-indigo-500" : "border border-transparent"
                  }`}
                  onClick={() => handleContentTypeChange(value)}
                >
                  <Icon className="w-12 h-12 mb-4 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-800 text-center">{label}</h3>
                  <p className="text-sm text-gray-600 mt-2 text-center">{contentTypeDescriptions[value]}</p>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {contentType && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <Card className="mt-8 bg-white w-full max-w-6xl mx-auto">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-800">{contentType === "trend" ? "Select a Trend" : "Enter Details"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {renderInputField()}
                      {selectedTrend && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Trend Description:</h3>
                          <div className="w-full break-words">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-gray-700">
                              {selectedTrend.description}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="mt-6">
                    <Button onClick={handleGenerateIdeas} disabled={isLoading} className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2  h-4 w-4" />}
                      {isLoading ? "Generating..." : "Generate Ideas"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </TooltipProvider>
    </ProtectedRoute>
  );
}
