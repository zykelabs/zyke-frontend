"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Share2,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the structure of an Idea and Incoming Idea
interface Idea {
  id: number;
  title: string;
  content: string;
  type: string;
}

type IncomingIdea = [string, string];

// Define the structure of API Response
interface ApiResponse {
  saved: string; // "True" or "False"
}

export default function GeneratedIdeas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Retrieve the 'data' query parameter
  const dataParam = searchParams.get("data");

  // State variables
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [trendName, setTrendName] = useState<string>("");
  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([]);
  const [postsPerIdea, setPostsPerIdea] = useState<number>(3);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState<number>(0);
  const [includeAIIdea, setIncludeAIIdea] = useState<boolean>(false);
  const [customIdeaName, setCustomIdeaName] = useState<string>("");
  const [customIdeaDescription, setCustomIdeaDescription] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const alertRef = useRef<HTMLDivElement>(null);

  // Parse the incoming data parameter
  useEffect(() => {
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        const { name, ideas: incomingIdeas } = parsedData;

        if (!name || !incomingIdeas || !Array.isArray(incomingIdeas)) {
          throw new Error("Invalid data structure.");
        }

        setTrendName(name);

        // Map incoming ideas (nested arrays) to Idea objects
        const mappedIdeas: Idea[] = incomingIdeas.map(
          (idea: IncomingIdea, index) => ({
            id: index + 1, // Assign a unique ID
            title: idea[0], // Use the received title
            content: idea[1], // Use the received content
            type: "generated", // Default type; you can customize as needed
          })
        );

        setIdeas(mappedIdeas);
        setCurrentIdeaIndex(0);
      } catch (err: any) {
        console.error("Error parsing data:", err);
        triggerError("Failed to load ideas. Invalid data.");
      }
    } else {
      triggerError("No data received.");
    }
  }, [dataParam]);

  // Function to trigger error messages
  const triggerError = (message: string) => {
    setErrorMessage(message);
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);

    // Scroll to alert
    setTimeout(() => {
      alertRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleIdeaSelection = (ideaId: number) => {
    setSelectedIdeas((prev) =>
      prev.includes(ideaId)
        ? prev.filter((id) => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  const handlePostsPerIdeaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    if (isNaN(value)) {
      setPostsPerIdea(1);
    } else {
      setPostsPerIdea(Math.min(Math.max(1, value), 5));
    }
  };

  const nextIdea = () => {
    if (currentIdeaIndex === ideas.length - 1) {
      setCurrentIdeaIndex(-1); // Custom idea index
    } else {
      setCurrentIdeaIndex((prev) => prev + 1);
    }
  };

  const prevIdea = () => {
    if (currentIdeaIndex === -1) {
      setCurrentIdeaIndex(ideas.length - 1);
    } else {
      setCurrentIdeaIndex((prev) => prev - 1);
    }
  };

  const handleGenerateContent = async () => {
    // Validation
    const hasNonAIIdea =
      selectedIdeas.includes(-1) || selectedIdeas.some((id) => id >= 1);
    if (includeAIIdea && !hasNonAIIdea) {
      triggerError(
        "Please select at least one non-AI generated idea when including an AI-generated idea."
      );
      return;
    }

    if (selectedIdeas.includes(-1)) {
      // -1 represents Custom Idea
      if (!customIdeaName.trim() || !customIdeaDescription.trim()) {
        triggerError(
          "Please provide both name and description for the custom idea."
        );
        return;
      }
    }

    if (selectedIdeas.length === 0 && !includeAIIdea) {
      triggerError(
        "Please select at least one idea or include an AI-generated idea."
      );
      return;
    }

    if (postsPerIdea < 1 || postsPerIdea > 5) {
      triggerError("Please enter a number of posts between 1 and 5.");
      return;
    }

    setIsLoading(true); // Show loader
    setErrorMessage(null); // Reset any previous error messages

    // Prepare the ideas list
    const ideasList: [string, string][] = selectedIdeas.map((id) => {
      if (id === -1) {
        return [customIdeaName.trim(), customIdeaDescription.trim()];
      }
      const idea = ideas.find((i) => i.id === id);
      return idea ? [idea.title, idea.content] : ["", ""];
    });

    if (includeAIIdea) {
      ideasList.push([
        "AI generated Idea",
        "Create the post, using your own idea, make the idea similar or related to the other ideas provided.",
      ]);
    }

    // Prepare the payload
    const payload = {
      ideas: ideasList,
      num: postsPerIdea,
      platform: selectedPlatform,
    };

    // Retrieve the access token
    const accessToken = session?.accessToken;

    if (!accessToken) {
      triggerError("No access token found.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/idea_to_post/fetch_posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(payload),
      })
  
      const data = await response.json()
  
      setIsLoading(false)
  
      // Ensure the 'saved' field is a boolean
      if (data.saved === true) {
        router.push("/generated-posts")
      } else {
        triggerError("Failed to save the generated content.")
      }
    } catch (err) {
      console.error("Error fetching posts:", err)
      triggerError("Failed to generate content. Please try again.")
      setIsLoading(false)
    }
  };

  // Platform Selection State
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram");

  const handlePlatformChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPlatform(event.target.value);
  };

  // Prevent accessing undefined ideas
  const currentIdea = ideas[currentIdeaIndex];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 relative">
        {/* Error Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              ref={alertRef}
              className="mb-4 border border-red-500 bg-transparent rounded p-4"
            >
              <Alert variant="destructive" className="border-0 bg-transparent">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

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
              <span className="mt-4 text-white text-lg">
                Generating Content...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => router.push("/idea-generator")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trends
        </Button>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Generated Ideas for {trendName}
        </h1>

        {/* Create Custom Idea Button */}
        <Button
          className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold"
          onClick={() => {
            setCurrentIdeaIndex(-1);
            setTimeout(() => {
              // Scroll to the custom idea card
              document
                .getElementById("customIdeaCard")
                ?.scrollIntoView({ behavior: "smooth" });
            }, 100);
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
                      ${
                        currentIdeaIndex === -1
                          ? "border-2 border-indigo-500 bg-indigo-50"
                          : "bg-white"
                      }`}
                  >
                    {currentIdeaIndex === -1 ? (
                      <div id="customIdeaCard">
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
                          Create Your Own Idea
                        </h2>
                        <div className="mb-4">
                          <Label
                            htmlFor="customIdeaName"
                            className="block mb-1"
                          >
                            Idea Name
                          </Label>
                          <Input
                            id="customIdeaName"
                            type="text"
                            value={customIdeaName}
                            onChange={(e) => setCustomIdeaName(e.target.value)}
                            className="w-full"
                            placeholder="Enter idea name..."
                          />
                        </div>
                        <div className="mb-4">
                          <Label
                            htmlFor="customIdeaDescription"
                            className="block mb-1"
                          >
                            Idea Description
                          </Label>
                          <Textarea
                            id="customIdeaDescription"
                            placeholder="Describe your custom idea here..."
                            value={customIdeaDescription}
                            onChange={(e) =>
                              setCustomIdeaDescription(e.target.value)
                            }
                            className="w-full h-32"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedIdeas.includes(-1)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (
                                  customIdeaName.trim() &&
                                  customIdeaDescription.trim()
                                ) {
                                  setSelectedIdeas((prev) => [...prev, -1]);
                                  // Scroll to selected ideas section
                                  document
                                    .getElementById("selectedIdeasSection")
                                    ?.scrollIntoView({ behavior: "smooth" });
                                } else {
                                  triggerError(
                                    "Please provide both name and description for the custom idea."
                                  );
                                }
                              } else {
                                setSelectedIdeas((prev) =>
                                  prev.filter((id) => id !== -1)
                                );
                              }
                            }}
                            disabled={
                              !(
                                customIdeaName.trim() &&
                                customIdeaDescription.trim()
                              )
                            }
                          />
                          <span className="text-gray-700">
                            Select Custom Idea
                          </span>
                        </div>
                      </div>
                    ) : currentIdea ? (
                      <>
                        <h2 className="text-2xl font-semibold mb-4">
                          {currentIdea.title}
                        </h2>
                        <p className="text-gray-600 mb-4">
                          {currentIdea.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {currentIdea.type}
                          </span>
                          <Switch
                            checked={selectedIdeas.includes(currentIdea.id)}
                            onCheckedChange={() =>
                              handleIdeaSelection(currentIdea.id)
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500">Idea not found.</p>
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
                {currentIdeaIndex === -1
                  ? "Custom"
                  : `${currentIdeaIndex + 1} / ${ideas.length}`}
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
              {/* Platform Selection */}
              <div>
                <Label htmlFor="platform" className="block mb-1">
                  Select Platform
                </Label>
                <select
                  id="platform"
                  value={selectedPlatform}
                  onChange={handlePlatformChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              {/* Posts per Idea */}
              <div>
                <Label htmlFor="postsPerIdea" className="block mb-1">
                  Posts per Idea
                </Label>
                <Input
                  id="postsPerIdea"
                  type="number"
                  min={1}
                  max={5}
                  value={postsPerIdea}
                  onChange={handlePostsPerIdeaChange}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500">
                  Maximum of 5 posts per idea.
                </p>
              </div>

              {/* Selected Ideas */}
              <div id="selectedIdeasSection">
                <Label className="block mb-2">Selected Ideas</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {selectedIdeas.map((id) => {
                    if (id === -1) {
                      return (
                        <div
                          key={id}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <span className="text-gray-700">Custom Idea</span>
                          <Switch
                            checked={true}
                            onCheckedChange={() => handleIdeaSelection(id)}
                          />
                        </div>
                      );
                    }
                    const idea = ideas.find((i) => i.id === id);
                    return (
                      <div
                        key={id}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Switch
                          checked={true}
                          onCheckedChange={() => handleIdeaSelection(id)}
                        />
                        <span>{idea?.title}</span>
                      </div>
                    );
                  })}
                </ScrollArea>
              </div>

              {/* Include AI-Generated Idea */}
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100">
                <Switch
                  checked={includeAIIdea}
                  onCheckedChange={setIncludeAIIdea}
                  className="data-[state=checked]:bg-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Include 1 AI-Generated Idea
                </span>
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
  );
}
