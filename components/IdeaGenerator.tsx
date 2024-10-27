// IdeaGenerator.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  Sparkles,
  TrendingUp,
  Globe,
  Image,
  Instagram, // Using Instagram icon for Reel
  Youtube, // Reverted to original YouTube icon (case-sensitive)
  Rocket, // Using Rocket icon for Custom Topic
  Menu,
  X,
  MessageCircle,
  Bell,
  Sun,
  Moon,
  LayoutDashboard,
  BarChart2,
  User,
  CreditCard,
  Users,
  LogOut,
  Settings,
  Zap,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSpring, animated } from "react-spring";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";

interface Trend {
  name: string;
  summary: string;
  description: string;
  ideas?: string[][];
  relevanceScore?: number;
}

interface IdeaResponse {
  cached: boolean;
  ideas: {
    [key: string]: {
      Description: string;
      Ideas: string[][];
      Name: string;
      "Original Position": string;
      "Relevance Score": string;
      Summary: string;
    };
  };
}

interface RepurposeResponse {
  description: string;
  summary: string;
  topic: string;
}

interface RepurposeIdeaResponse {
  cached: boolean;
  ideas: string[][];
}

// Custom Hook: useScrollDirection
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
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

// Content Types Configuration
const contentTypes = [
  { value: "trend", label: "Trend", icon: TrendingUp },
  { value: "instagram_post", label: "Instagram Post", icon: Image },
  { value: "reel", label: "Reel", icon: Instagram }, // Changed to Instagram
  { value: "youtube_video", label: "YouTube Video", icon: Youtube }, // Reverted to original YouTube icon (case-sensitive)
  { value: "blog", label: "Blog", icon: Globe }, // Changed to Globe
  { value: "website", label: "Website", icon: Globe },
  { value: "news_article", label: "News Article", icon: Globe },
  { value: "custom_topic", label: "Custom Topic", icon: Rocket }, // Changed to Rocket
];

const contentTypeDescriptions: { [key: string]: string } = {
  trend: "Generate trending social media topics from the latest trends.",
  instagram_post: "Generate social media topics based on Instagram posts.",
  reel: "Turn Instagram Reels into social media topic ideas.",
  youtube_video: "Create social media topics based on YouTube video content.",
  blog: "Create engaging social media topics from blog content.",
  website: "Generate social media topics from website content and updates.",
  news_article:
    "Turn news articles into social media topics that spark conversations.",
  custom_topic:
    "Enter a custom topic name and its description to generate social media ideas.",
};

// Navbar Implementation
function LegendaryNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const scrollDirection = useScrollDirection();
  const { data: session } = useSession();

  const navAnimation = useSpring({
    transform:
      scrollDirection === "down" ? "translateY(-100%)" : "translateY(0%)",
    config: { tension: 300, friction: 20 },
  });

  const logoProps = useSpring({
    loop: { reverse: true },
    from: { rotateY: 0 },
    to: { rotateY: 360 },
    config: { duration: 3000 },
  });

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Ideas", icon: Sparkles, href: "/ideas" },
    { name: "Chatbot", icon: MessageCircle, href: "/chatbot" },
    { name: "Analytics", icon: BarChart2, href: "/analytics" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <animated.nav
      style={navAnimation}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <animated.div style={logoProps}>
              <Zap className="w-8 h-8 text-primary" />
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
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5">
                    3
                  </Badge>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-w-xs">
                <DropdownMenuItem className="whitespace-normal break-words">
                  New message from Alice
                </DropdownMenuItem>
                <DropdownMenuItem className="whitespace-normal break-words">
                  Your post is trending!
                </DropdownMenuItem>
                <DropdownMenuItem className="whitespace-normal break-words">
                  You have a new follower
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage
                      src={session?.user?.image || "https://github.com/shadcn.png"}
                      alt={session?.user?.name || "@shadcn"}
                    />
                    <AvatarFallback>
                      {session?.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : "SC"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-w-xs">
                {/* Brand Profile Link */}
                <DropdownMenuItem asChild className="whitespace-normal break-words">
                  <Link
                    href="/brandprofile"
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Brand Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="whitespace-normal break-words">
                  <Link href="/billing" className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="whitespace-normal break-words">
                  <Link href="/team" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Team</span>
                  </Link>
                </DropdownMenuItem>
                {/* Theme Toggle */}
                <DropdownMenuItem asChild className="whitespace-normal break-words">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="w-full flex items-center space-x-2"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-4 h-4" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </Button>
                </DropdownMenuItem>
                {/* Logout Handling */}
                <DropdownMenuItem asChild className="whitespace-normal break-words">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="w-full flex items-center space-x-2 text-red-600 hover:bg-red-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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

  // The `LegendaryNavbar` function is defined above and included in the same file.
}

// Main Component

export default function IdeaGenerator() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [inputData, setInputData] = useState<{ [key: string]: string }>({});
  const [contentType, setContentType] = useState<string>("");
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [repurposeData, setRepurposeData] = useState<RepurposeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [combinedTrends, setCombinedTrends] = useState<Trend[]>([]);
  const [isFetchingTrends, setIsFetchingTrends] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Define repurpose content types
  const repurposeContentTypes = [
    "blog",
    "instagram_post",
    "reel",
    "news_article",
    "youtube_video",
    "website",
  ];

  useEffect(() => {
    if (status === "authenticated") {
      if (contentType === "trend") {
        fetchTrendsAndIdeas();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, contentType]);

  // Fetch trends and ideas for "trend" content type
  const fetchTrendsAndIdeas = async () => {
    setIsFetchingTrends(true);
    try {
      const accessToken = session?.accessToken;
      if (!accessToken) {
        setError("No access token found.");
        setIsFetchingTrends(false);
        return;
      }

      // Fetch trends from /trends/fetch_trends
      const trendsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trends/fetch_trends`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (trendsResponse.status === 401) {
        throw new Error("Unauthorized. Please sign in again.");
      }

      const trendsData = await trendsResponse.json();

      if (trendsData.trends && Array.isArray(trendsData.trends)) {
        // Send the exact nested list to /trend_to_idea/generate_ideas
        const ideasResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trend_to_idea/generate_ideas`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              use: "trend",
              text: trendsData.trends, // Sending the nested list as is
            }),
          }
        );

        if (ideasResponse.status === 401) {
          throw new Error(
            "Unauthorized when generating ideas. Please sign in again."
          );
        }

        if (ideasResponse.status === 422) {
          throw new Error("Unprocessable Entity. Please check the trends data.");
        }

        if (!ideasResponse.ok) {
          throw new Error("Failed to generate ideas.");
        }

        const ideasData: IdeaResponse = await ideasResponse.json();

        if (
          ideasData.ideas &&
          typeof ideasData.ideas === "object" &&
          !Array.isArray(ideasData.ideas)
        ) {
          // Transform the ideasData into combinedTrends
          const combined: Trend[] = Object.keys(ideasData.ideas).map((key) => ({
            name: key,
            summary: ideasData.ideas[key].Summary,
            description: ideasData.ideas[key].Description,
            ideas: ideasData.ideas[key].Ideas,
            relevanceScore: parseFloat(ideasData.ideas[key]["Relevance Score"]),
          }));

          // Sort the combined trends by relevance score descending
          combined.sort(
            (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
          );

          setCombinedTrends(combined);
        } else {
          console.error(
            "Unexpected generate ideas response structure:",
            ideasData
          );
          setError("Failed to process ideas data.");
        }
      } else {
        console.error("Unexpected fetch trends response structure:", trendsData);
        setError("Failed to load trends data.");
      }
    } catch (error: any) {
      console.error("Error fetching trends and ideas:", error);
      setError(
        error.message ||
          "Failed to load trends and ideas. Please try again later."
      );
      setCombinedTrends([]);
    } finally {
      setIsFetchingTrends(false);
    }
  };

  // Handle content type selection
  const handleContentTypeChange = (value: string) => {
    setContentType(value);
    setInputData({});
    setSelectedTrend(null);
    setRepurposeData(null);
    setCharCount(0);
    setError(null); // Clear any existing errors
  };

  // Handle input changes
  const handleInputChange = (name: string, value: string) => {
    setInputData((prev) => ({ ...prev, [name]: value }));
    setCharCount(value.length);
  };

  // Handle trend selection
  const handleTrendSelect = (value: string) => {
    const trend = combinedTrends.find((trend) => trend.name === value) || null;
    setSelectedTrend(trend);
    setError(null); // Clear any existing errors
  };

  // Handle "Get Topic" for repurpose and custom topic content types
  const handleGetTopic = async () => {
    if (contentType === "custom_topic") {
      // For Custom Topic, get both name and description
      const customTopicName = inputData["topicName"];
      const customTopicDescription = inputData["topicDescription"];

      if (!customTopicName || !customTopicDescription) {
        setError("Please enter both the topic name and description.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const accessToken = session?.accessToken;
        if (!accessToken) {
          setError("No access token found.");
          setIsLoading(false);
          return;
        }

        // Make a POST request with JSON body
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trend_to_idea/generate_ideas`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              use: "manual",
              text: {
                name: customTopicName,
                description: customTopicDescription,
              },
            }),
          }
        );

        if (response.status === 401) {
          throw new Error("Unauthorized. Please sign in again.");
        }

        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Bad Request.");
        }

        if (!response.ok) {
          throw new Error("Failed to generate ideas.");
        }

        const ideasData: RepurposeIdeaResponse = await response.json();

        if (ideasData.ideas && Array.isArray(ideasData.ideas)) {
          // Prepare the data to send: name and ideas nested list
          const dataToSend = {
            name: customTopicName, // Use the entered topic name
            ideas: ideasData.ideas,
          };

          console.log("Manual Input Data:", dataToSend); // Logging for manual input

          // Serialize the data as JSON and encode it for URL
          const serializedData = encodeURIComponent(JSON.stringify(dataToSend));

          // Navigate to the GeneratedIdeas page with the serialized data as a query parameter
          router.push(`/generated-ideas?data=${serializedData}`);
        } else {
          console.error(
            "Unexpected generate ideas response structure:",
            ideasData
          );
          setError("Failed to process ideas data.");
        }
      } catch (error: any) {
        console.error("Error generating ideas:", error);
        setError(
          error.message ||
            "Failed to generate ideas. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // For repurpose content types
      const url = inputData["url"];
      if (!url) {
        setError("Please enter a URL.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const accessToken = session?.accessToken;
        if (!accessToken) {
          setError("No access token found.");
          setIsLoading(false);
          return;
        }

        // Determine content_type based on selected contentType
        const contentTypeMapping: { [key: string]: string } = {
          blog: "blog",
          instagram_post: "post",
          reel: "reel",
          news_article: "news-article",
          youtube_video: "yt-video",
          website: "website",
        };

        const mappedContentType = contentTypeMapping[contentType];
        if (!mappedContentType) {
          setError("Invalid content type selected.");
          setIsLoading(false);
          return;
        }

        // Make a POST request with JSON body
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/repurpose/repurpose_url`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: url,
              content_type: mappedContentType,
            }),
          }
        );

        if (response.status === 401) {
          throw new Error("Unauthorized. Please sign in again.");
        }

        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Bad Request.");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch topic data.");
        }

        const data: RepurposeResponse = await response.json();
        setRepurposeData(data);
      } catch (error: any) {
        console.error("Error fetching repurpose topic:", error);
        setError(
          error.message ||
            "Failed to fetch topic data. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle "Generate Ideas" button click
  const handleGenerateIdeas = async () => {
    if (!contentType) {
      setError("Please select a content type.");
      return;
    }

    // Handle trends
    if (contentType === "trend") {
      if (!selectedTrend) {
        setError("Please select a trend.");
        return;
      }

      if (selectedTrend.ideas) {
        // Prepare the data to send: name and ideas list
        const dataToSend = {
          name: selectedTrend.name,
          ideas: selectedTrend.ideas,
        };

        console.log("Trend Data:", dataToSend); // Logging for trend

        // Serialize the data as JSON and encode it for URL
        const serializedData = encodeURIComponent(JSON.stringify(dataToSend));

        // Navigate to the GeneratedIdeas page with the serialized data as a query parameter
        router.push(`/generated-ideas?data=${serializedData}`);
      } else {
        setError("No ideas available for the selected trend.");
      }
    }
    // Handle repurpose content types
    else if (repurposeContentTypes.includes(contentType)) {
      if (!repurposeData) {
        setError("Please get the topic first.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const accessToken = session?.accessToken;
        if (!accessToken) {
          setError("No access token found.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trend_to_idea/generate_ideas`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              use: "topic",
              text: {
                topic: repurposeData.topic,
                summary: repurposeData.summary,
                description: repurposeData.description,
              },
            }),
          }
        );

        if (response.status === 401) {
          throw new Error("Unauthorized. Please sign in again.");
        }

        if (!response.ok) {
          throw new Error("Failed to generate ideas.");
        }

        const ideasData: RepurposeIdeaResponse = await response.json();

        if (ideasData.ideas && Array.isArray(ideasData.ideas)) {
          // Prepare the data to send: name and ideas nested list
          const dataToSend = {
            name: repurposeData.topic, // Changed from 'topic' to 'name' for consistency
            ideas: ideasData.ideas,
          };

          console.log("Repurpose Data:", dataToSend); // Logging for repurpose

          // Serialize the data as JSON and encode it for URL
          const serializedData = encodeURIComponent(JSON.stringify(dataToSend));

          // Navigate to the GeneratedIdeas page with the serialized data as a query parameter
          router.push(`/generated-ideas?data=${serializedData}`);
        } else {
          console.error(
            "Unexpected generate ideas response structure:",
            ideasData
          );
          setError("Failed to process ideas data.");
        }
      } catch (error: any) {
        console.error("Error generating ideas:", error);
        setError(
          error.message ||
            "Failed to generate ideas. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }
    // Handle custom_topic is already handled in handleGetTopic
    else {
      // No additional handling required
    }
  };

  // Render input fields based on content type
  const renderInputField = () => {
    switch (contentType) {
      case "trend":
        return isFetchingTrends ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 animate-spin" /> Loading trends...
          </div>
        ) : combinedTrends.length > 0 ? (
          <Select onValueChange={handleTrendSelect}>
            <SelectTrigger className="w-64 h-auto">
              <SelectValue placeholder="Select a trend" className="whitespace-normal" />
            </SelectTrigger>
            <SelectContent className="w-64">
              {combinedTrends.map((trend) => (
                <SelectItem key={trend.name} value={trend.name}>
                  <div className="flex flex-col">
                    <span className="font-bold break-words">{trend.name}</span>
                    <span className="text-sm text-gray-500 break-words">
                      {trend.summary}
                    </span>
                    <span className="text-xs text-gray-400">
                      Relevance Score: {trend.relevanceScore}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>No trends available</p>
        );
      case "blog":
      case "instagram_post":
      case "reel":
      case "news_article":
      case "youtube_video":
      case "website":
        return (
          <>
            <Input
              placeholder="Enter URL"
              value={inputData["url"] || ""}
              onChange={(e) => handleInputChange("url", e.target.value)}
              className="w-64"
            />
            <Button
              onClick={handleGetTopic}
              disabled={isLoading}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Get Topic"
              )}
            </Button>
            {repurposeData && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold">{repurposeData.topic}</h2>
                <p className="mt-2 text-gray-700">{repurposeData.summary}</p>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="mt-2 text-gray-600"
                >
                  {repurposeData.description}
                </ReactMarkdown>
              </div>
            )}
          </>
        );
      case "custom_topic":
        return (
          <div className="w-full">
            <Input
              placeholder="Enter Topic Name"
              value={inputData["topicName"] || ""}
              onChange={(e) => handleInputChange("topicName", e.target.value)}
              className="w-full"
            />
            <Textarea
              placeholder="Enter Topic Description"
              value={inputData["topicDescription"] || ""}
              onChange={(e) => handleInputChange("topicDescription", e.target.value)}
              className="w-full mt-4"
            />
            <Button
              onClick={handleGetTopic}
              disabled={isLoading}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Generate Ideas"
              )}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {/* Navbar */}
        <LegendaryNavbar />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 mt-16">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              What do you want to design today?
            </h1>
          </header>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {/* Responsive grid layout */}
            {contentTypes.map(({ value, label, icon: Icon }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 md:p-4 bg-white shadow-lg rounded-lg transition ${
                  contentType === value
                    ? "border-2 border-indigo-500"
                    : "border border-transparent"
                } w-full`}
                onClick={() => handleContentTypeChange(value)}
              >
                <Icon className="w-12 h-12 mb-4 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {label}
                </h3>
                <p className="text-sm text-gray-600 mt-2 text-center break-words">
                  {contentTypeDescriptions[value]}
                </p>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {contentType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <Card className="bg-white w-full max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {contentType === "trend"
                        ? "Select a Trend"
                        : contentType === "custom_topic"
                        ? "Your Custom Topic"
                        : "Enter Details"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderInputField()}
                    {contentType === "trend" && selectedTrend && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Trend Description:
                        </h3>
                        <div className="w-full break-words">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            className="text-gray-700"
                          >
                            {selectedTrend.description}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Generate Ideas Button */}
                {contentType !== "custom_topic" && (
                  <div className="mt-6">
                    <Button
                      onClick={handleGenerateIdeas}
                      disabled={isLoading}
                      className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? "Generating..." : "Generate Ideas"}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </TooltipProvider>
  );
}
