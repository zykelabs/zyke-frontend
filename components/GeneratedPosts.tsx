"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

// Utility function to combine class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) => {
  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-200",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  const sizeStyles = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
    icon: "p-2",
  };

  return (
    <button
      className={cn(
        "rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-100",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("bg-white rounded-lg shadow-md p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
};

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h2 className={cn("text-xl font-semibold", className)} {...props}>
      {children}
    </h2>
  );
};

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

// ScrollArea Component
const ScrollArea: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("overflow-y-auto", className)} {...props}>
      {children}
    </div>
  );
};

// Define the Idea Type
interface Idea {
  id: number | string;
  title: string;
  content: string;
  type: string;
}

// ImageModal Component
interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onImageUpdate: (newImage: string, imageHistory: string[]) => void; // Function to update image in parent component
  originalImageSrc: string; // Original image to allow reverting back
  imageHistory: string[];
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onImageUpdate,
  imageHistory: initialImageHistory,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [masks, setMasks] = useState<string[]>([]);
  const [selectedMask, setSelectedMask] = useState<string | null>(null);
  const [displayedImage, setDisplayedImage] = useState<string>(imageSrc);
  const [imageHistory, setImageHistory] =
    useState<string[]>(initialImageHistory);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(
    initialImageHistory.length - 1
  );
  const [isMaskSelectionReady, setIsMaskSelectionReady] = useState(false);
  const [isSelectMaskActive, setIsSelectMaskActive] = useState(false); // To change activation state

  const hardcodedMasks = [
    "/masks/L_Model_blended_img_1.png",
    "/masks/L_Model_blended_img_2.png",
    "/masks/L_Model_blended_img_3.png",
    "/masks/L_Model_blended_img_4.png",
    "/masks/L_Model_blended_img_5.png",
    "/masks/L_Model_blended_img_6.png",
  ];

  const fixedGeneratedImage = "/generated/fixed.png"; // Placeholder image for no mask generation

  useEffect(() => {
    if (isOpen) {
      setPrompt("");
      setIsGenerating(false);
      setMasks([]);
      setSelectedMask(null);
      setDisplayedImage(imageHistory[currentHistoryIndex]);
      setIsMaskSelectionReady(false);
      setIsSelectMaskActive(false);
    }
  }, [isOpen, imageHistory, currentHistoryIndex]);

  const handleGenerate = () => {
    if (isGenerating) return;

    setIsGenerating(true);

    // Simulate API call with a 1-second delay for demo purposes
    setTimeout(() => {
      let newImage = fixedGeneratedImage; // Default image if no mask is selected

      if (selectedMask) {
        // If a mask is selected, use a corresponding generated image
        const maskIndex = hardcodedMasks.indexOf(selectedMask);
        // For demonstration, assuming predecided generated images
        const predecidedImages = [
          "/generated/generated1.png",
          "/generated/generated2.png",
          "/generated/generated3.png",
          "/generated/generated4.png",
          "/generated/generated5.png",
          "/generated/generated6.png",
        ];
        newImage =
          maskIndex !== -1
            ? predecidedImages[maskIndex % predecidedImages.length]
            : fixedGeneratedImage;
      }

      // Update image history
      const newImageHistory = [
        ...imageHistory.slice(0, currentHistoryIndex + 1),
        newImage,
      ];
      setImageHistory(newImageHistory);
      setCurrentHistoryIndex(newImageHistory.length - 1);
      setDisplayedImage(newImage);
      setIsGenerating(false);

      // Update image in parent component
      onImageUpdate(newImage, newImageHistory);
    }, 1000); // Faster generation for demo purposes
  };

  const handleSelectMask = () => {
    // Toggle mask selection mode
    const canActivate = !isCurrentImageMask && !isGenerating;

    if (!canActivate) return;

    setIsMaskSelectionReady(!isMaskSelectionReady);
    setIsSelectMaskActive(!isSelectMaskActive);

    if (!isMaskSelectionReady) {
      // Activating mask selection
      setMasks([]);
      setSelectedMask(null);
    } else {
      // Deactivating mask selection
      setMasks([]);
      setSelectedMask(null);
    }
  };

  const handleImageClick = () => {
    if (isSelectMaskActive && masks.length === 0) {
      // Load masks when user clicks on the image after selecting mask
      setMasks(hardcodedMasks);
      setSelectedMask(null); // Reset any previously selected mask
      // Deactivate the select mask button
      setIsSelectMaskActive(false);
      setIsMaskSelectionReady(false);
    }
  };

  const handleMaskSelection = (mask: string) => {
    setSelectedMask(mask);
    setDisplayedImage(mask);
    setImageHistory((prev) => [
      ...prev.slice(0, currentHistoryIndex + 1),
      mask,
    ]);
    setCurrentHistoryIndex((prev) => prev + 1);
    setMasks([]); // Hide masks after selection
    // Make button non-clickable when viewing a mask
    setIsSelectMaskActive(false);
    setIsMaskSelectionReady(false);
  };

  const handleRevert = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousImage = imageHistory[newIndex];
      setCurrentHistoryIndex(newIndex);
      setDisplayedImage(previousImage);
      setSelectedMask(null);

      // Update parent component
      onImageUpdate(previousImage, imageHistory.slice(0, newIndex + 1));
    }
  };

  // Navigate to previous image in history
  const handlePrevImage = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setDisplayedImage(imageHistory[newIndex]);
      onImageUpdate(
        imageHistory[newIndex],
        imageHistory.slice(0, newIndex + 1)
      );
    }
  }, [currentHistoryIndex, imageHistory, onImageUpdate]);

  // Navigate to next image in history
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleNextImage = () => {
    if (currentHistoryIndex < imageHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setDisplayedImage(imageHistory[newIndex]);
      onImageUpdate(
        imageHistory[newIndex],
        imageHistory.slice(0, newIndex + 1)
      );
    }
  };

  // Determine if the current image is a mask
  const isCurrentImageMask = hardcodedMasks.includes(displayedImage);

  // Handle backdrop click
  const handleBackdropClick = () => {
    onClose();
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [isOpen, handlePrevImage, handleNextImage, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto w-full max-w-3xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              className="absolute top-4 right-4 z-10"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Image Display */}
            <div
              className="flex justify-center relative"
              onClick={handleImageClick}
            >
              <Image
                src={displayedImage}
                alt="Expanded Image"
                width={350}
                height={500}
                className="object-contain rounded-md cursor-pointer"
              />
              {/* Navigation Buttons */}
              {imageHistory.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-4 transform -translate-y-1/2"
                    onClick={handlePrevImage}
                    disabled={currentHistoryIndex === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-4 transform -translate-y-1/2"
                    onClick={handleNextImage}
                    disabled={currentHistoryIndex === imageHistory.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Revert Button */}
            {currentHistoryIndex > 0 && (
              <div className="mt-2 flex justify-center">
                <Button variant="ghost" onClick={handleRevert}>
                  Revert to Previous Image
                </Button>
              </div>
            )}

            {/* Select Point for Masking Button */}
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={handleSelectMask}
                disabled={isCurrentImageMask || isGenerating}
                className={
                  isSelectMaskActive && !isCurrentImageMask
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "hover:bg-gray-200"
                }
                style={{
                  transition:
                    "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                  cursor:
                    isCurrentImageMask || isGenerating
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Select Point for Masking
              </Button>
            </div>

            {/* Segmentation Masks */}
            {masks.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {masks.map((mask, index) => (
                  <div key={index} className="relative">
                    <Button
                      variant={selectedMask === mask ? "default" : "outline"}
                      className="p-0.5"
                      onClick={() => handleMaskSelection(mask)}
                    >
                      <Image
                        src={mask}
                        alt={`Mask ${index + 1}`}
                        width={60}
                        height={60}
                        className={cn(
                          "object-contain rounded-md cursor-pointer",
                          selectedMask === mask
                            ? "border-2 border-indigo-600"
                            : "border-2 border-transparent"
                        )}
                      />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Prompt Input and Generate Button */}
            <div className="mt-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt"
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isGenerating}
              />
              <Button
                className="mt-2 w-full flex items-center justify-center"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                style={{
                  backgroundColor: isGenerating ? "#a5b4fc" : undefined,
                  transition: "background-color 0.2s ease-in-out",
                }}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>

            {/* Loader */}
            {isGenerating && (
              <div className="mt-4 flex justify-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            )}

            {/* Inline Styles for Loader and Scrollbar */}
            <style jsx>{`
              .loader {
                border-top-color: #3498db;
                animation: spin 1s infinite linear;
              }

              @keyframes spin {
                to {
                  transform: rotate(360deg);
                }
              }

              /* Custom Scrollbar */
              ::-webkit-scrollbar {
                width: 8px;
              }

              ::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
              }

              ::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
              }

              ::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main GeneratedPosts Component
export default function GeneratedPosts() {
  const searchParams = useSearchParams();
  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([]);
  const [postsPerIdea, setPostsPerIdea] = useState(3);
  const [customIdea, setCustomIdea] = useState("");
  const [includeAI, setIncludeAI] = useState(false);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUpdateIndex, setImageUpdateIndex] = useState<number | null>(null);
  const [currentImageKey, setCurrentImageKey] = useState<string>("");
  const [modalImageHistory, setModalImageHistory] = useState<string[]>([]);
  const [imageHistories, setImageHistories] = useState<{
    [key: string]: string[];
  }>({});

  // Define your ideas
  const ideas: Idea[] = [
    {
      id: 1,
      title: "SpaceX vs Zomato Infographics",
      content:
        "Create sleek infographics comparing SpaceX's precision in catching boosters to Zomato's accuracy in delivering orders. Compare Zomato delivery partner's speed with a rocket. Highlight metrics like delivery speed, order accuracy, and customer satisfaction with visually appealing space-themed graphics. Include fun facts about both SpaceX and Zomato's operations.",
      type: "infographic",
    },
    {
      id: 2,
      title: "Zomato Mission Control",
      content:
        "Share a behind-the-scenes look at Zomato's delivery operations styled as a mission control center. Use playful graphics and animations to show how orders are managed with the same dedication and teamwork as SpaceX's missions. Include interviews or fun facts about the delivery team, adding a human touch that resonates with followers. Present it as a cartoony comic and meme structure.",
      type: "comic",
    },
    {
      id: 3,
      title: "Telee..port Your Orders",
      content:
        "Playfully one-up SpaceX by claiming Zomato has developed teleportation for food delivery. Create a surprising visual where a meal materializes instantly on a dining table with sci-fi effects, adding humor by 'out-teching' the tech giants.",
      type: "challenge",
    },
    {
      id: 4,
      title: "Lightspeed Delivery",
      content:
        "Craft a humorous comparison showing Zomato's delivery speed outpacing the precision of SpaceX's mechanical arms. Use an unexpected twist where a Zomato delivery person intercepts the booster mid-air to hand over an order, emphasizing lightning-fast service.",
      type: "challenge",
    },
  ];

  // Cleaned-up dummyImages array without duplicates
  const dummyImages = [
    // Idea 1 Post 1 Images (Indices 0-2)
    "/posts/Idea1Post1Img1.jpg",
    "/posts/Idea1Post1Img2.png",
    "/posts/Idea1Post1Img3.png",

    // Idea 2 Post 1 Images (Indices 3-5)
    "/posts/Idea2Post1Img2.png",
    "/posts/Idea2Post1Img3.png",
    "/posts/Idea2Post1Img1.png",

    // Idea 3 Post 1 Images (Indices 6-8)
    "/posts/Idea3Post1Img2.png",
    "/posts/Idea3Post1Img3.png",
    "/posts/Idea3Post1Img1.png",

    // Idea 3 Post 2 Images (Indices 9-10)
    "/posts/Idea3Post2Img1.png",
    "/posts/Idea3Post2Img2.png",

    // Idea 3 Post 3 Images (Indices 11-12)
    "/posts/Idea3Post3Img1.png",
    "/posts/Idea3Post3Img2.png",
  ];

  // Define your captions
  const dummyCaptions = [
    "Rocket science? More like Rocket delivery! 🚀🍕 When SpaceX catches boosters, Zomato catches your cravings on time! #PrecisionDelivery #RocketPoweredMeals",
    "Houston, we have Zomato! 🚀🍕 Our delivery heroes are on a mission to make your taste buds soar. Here's how we keep everything running smoothly in Mission Control Zomato! #BehindTheOrder #ZomatoMissionControl",
    "When your pizza delivery is more epic than a SpaceX launch! 🍕🚀 Introducing our latest feature: Rocket Delivery Partners! Now your orders literally fly to you. Just kidding... but wouldn't that be cool? 😂 #EpicDelivery #ZomatoSpaceship",
    "Beam us some pizza! 🛰🍕 We've teamed up with SpaceX to bring you intergalactic flavors. Now available for delivery on Mars... just kidding, but we're aiming high! 🚀😉 #BeamMeAPizza #ZomatoMoonMission",
    "Alien-approved cuisine! 👽🍔 Just landed: Martian Menus exclusively on Zomato. Fresh from another planet to your plate. Are you ready to try something out of this world? 🌌✨ #AlienEats #ZomatoGalaxy",
  ];

  useEffect(() => {
    const ideasParam = searchParams.get("ideas");
    if (ideasParam) {
      setSelectedIdeas(ideasParam.split(",").map(Number));
    }
    setPostsPerIdea(Number(searchParams.get("postsPerIdea")) || 3);
    setCustomIdea(searchParams.get("customIdea") || "");
    setIncludeAI(searchParams.get("includeAI") === "true");
  }, [searchParams]);

  // Safely map selectedIdeas to actual ideas, filtering out any undefined
  const mappedSelectedIdeas = selectedIdeas
    .map((id) => ideas.find((idea) => idea.id === id))
    .filter((idea): idea is Idea => idea !== undefined);

  const allIdeas: Idea[] = [
    ...mappedSelectedIdeas,
    ...(customIdea
      ? [
          {
            id: "custom",
            title: "Custom Idea",
            content: customIdea,
            type: "custom",
          },
        ]
      : []),
    ...(includeAI
      ? [
          {
            id: "ai",
            title: "AI Generated Idea",
            content: "An idea generated by AI",
            type: "ai",
          },
        ]
      : []),
  ];

  const generatePosts = (ideaIndex: number, count: number) => {
    const posts: { images: string[]; caption: string }[] = [];
    for (let i = 0; i < count; i++) {
      let images: string[];
      let caption: string;
      if (ideaIndex === 0 || ideaIndex === 1) {
        // For Idea 1 and 2, use the first 3 images repeatedly
        const startIndex = ideaIndex * 3;
        images = [
          dummyImages[startIndex],
          dummyImages[startIndex + 1],
          dummyImages[startIndex + 2],
        ];
        caption = dummyCaptions[ideaIndex];
      } else if (ideaIndex === 2 || ideaIndex === 3) {
        // For Idea 3 and 4, conditionally assign images
        let imagesIndices: number[] = [];
        if (i === 0) {
          // Post 1: 3 images
          imagesIndices = [6, 7, 8];
        } else if (i === 1) {
          // Post 2: 2 images
          imagesIndices = [9, 10];
        } else if (i === 2) {
          // Post 3: 2 images
          imagesIndices = [11, 12];
        }
        images = imagesIndices.map((index) => dummyImages[index]);
        caption = dummyCaptions[2 + i] || "Custom caption for Idea 3";
      } else {
        // For any other ideas, use random images and captions
        images = Array.from(
          { length: 3 },
          () => dummyImages[Math.floor(Math.random() * dummyImages.length)]
        );
        caption =
          dummyCaptions[Math.floor(Math.random() * dummyCaptions.length)];
      }
      // Push only the object with images and caption
      posts.push({ images, caption });
    }
    return posts;
  };

  // Initialize posts data
  const [postsData, setPostsData] = useState<
    { images: string[]; caption: string }[]
  >(generatePosts(currentIdeaIndex, postsPerIdea));

  // Update postsData when currentIdeaIndex or postsPerIdea changes
  useEffect(() => {
    setPostsData(generatePosts(currentIdeaIndex, postsPerIdea));
    setCurrentPostIndex(0); // Reset to first post when idea changes
  }, [currentIdeaIndex, postsPerIdea, generatePosts]);

  const handleCopyCaption = () => {
    const caption = postsData[currentPostIndex]?.caption || "";
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleNextPost = () => {
    if (currentPostIndex < postsPerIdea - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
    } else if (currentIdeaIndex < allIdeas.length - 1) {
      setCurrentIdeaIndex(currentIdeaIndex + 1);
      setCurrentPostIndex(0);
    }
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePrevPost = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1);
    } else if (currentIdeaIndex > 0) {
      setCurrentIdeaIndex(currentIdeaIndex - 1);
      setCurrentPostIndex(postsPerIdea - 1);
    }
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageClick = (imageObj: string, imageIndex: number) => {
    const imageKey = `${currentIdeaIndex}-${currentPostIndex}-${imageIndex}`;
    const existingHistory = imageHistories[imageKey];
    const initialHistory = existingHistory || [imageObj];
    setSelectedImage(initialHistory[initialHistory.length - 1]);
    setIsModalOpen(true);
    setImageUpdateIndex(imageIndex);
    setCurrentImageKey(imageKey);
    setModalImageHistory(initialHistory);
  };

  const handleImageUpdate = (newImage: string, newHistory: string[]) => {
    if (imageUpdateIndex !== null) {
      setPostsData((prevPosts) => {
        const updatedPosts = [...prevPosts];
        const updatedImages = [...updatedPosts[currentPostIndex].images];
        updatedImages[imageUpdateIndex] = newImage;
        updatedPosts[currentPostIndex] = {
          ...updatedPosts[currentPostIndex],
          images: updatedImages,
        };
        return updatedPosts;
      });

      // Update imageHistories
      setImageHistories((prevHistories) => ({
        ...prevHistories,
        [currentImageKey]: newHistory,
      }));
    }
  };

  // Define currentIdea after ensuring allIdeas has at least one idea
  const currentIdea = allIdeas[currentIdeaIndex];

  // Render component
  if (allIdeas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
        <Link
          href="/generate-ideas"
          className="inline-flex items-center mb-8 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Idea Generator
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          No Ideas Found
        </h1>
        <p className="text-gray-600">
          Please select at least one idea or add a custom/AI-generated idea.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <Link
        href="/generated-ideas"
        className="inline-flex items-center mb-8 text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Idea Generator
      </Link>

      <h1 className="text-4xl font-bold text-gray-800 mb-8">Generated Posts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selected Ideas Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Selected Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(90vh-200px)]">
              {allIdeas.map((idea, index) => (
                <Button
                  key={idea.id}
                  variant={currentIdeaIndex === index ? "default" : "outline"}
                  className="w-full mb-2 justify-start text-left"
                  onClick={() => {
                    setCurrentIdeaIndex(index);
                    setCurrentPostIndex(0);
                  }}
                >
                  {idea.title}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Current Post Display */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{currentIdea.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-gray-600">{currentIdea.content}</p>
            </div>
            <div className="relative" ref={scrollRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentIdeaIndex}-${currentPostIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Dynamic Grid Layout Based on Number of Images */}
                  <div
                    className={`grid grid-cols-1 ${
                      postsData[currentPostIndex].images.length === 2
                        ? "md:grid-cols-2"
                        : postsData[currentPostIndex].images.length === 3
                        ? "lg:grid-cols-3"
                        : "md:grid-cols-1"
                    } gap-4`}
                  >
                    {postsData[currentPostIndex].images.map(
                      (imageObj, index) => (
                        <div
                          key={index}
                          className="relative cursor-pointer"
                          onClick={() => handleImageClick(imageObj, index)}
                        >
                          <Image
                            src={imageObj}
                            alt={`Image ${index + 1} for Post ${
                              currentPostIndex + 1
                            } of ${currentIdea.title}`}
                            width={400}
                            height={800}
                            className="w-full object-cover rounded-md"
                          />
                        </div>
                      )
                    )}
                  </div>
                  {/* Caption */}
                  <div className="bg-white p-4 rounded-md shadow">
                    <p className="text-gray-800">
                      {postsData[currentPostIndex].caption}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100"
                onClick={handlePrevPost}
                disabled={currentIdeaIndex === 0 && currentPostIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100"
                onClick={handleNextPost}
                disabled={
                  currentIdeaIndex === allIdeas.length - 1 &&
                  currentPostIndex === postsPerIdea - 1
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {/* Post Information and Caption Copy */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Post {currentPostIndex + 1} of {postsPerIdea} for Idea{" "}
                {currentIdeaIndex + 1} of {allIdeas.length}
              </span>
              <Button variant="outline" size="sm" onClick={handleCopyCaption}>
                {copiedCaption ? (
                  <>
                    <Check className="h-4 w-4 mr-2" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" /> Copy Caption
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export All Posts Button */}
      <div className="mt-8 flex justify-end">
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <Download className="mr-2 h-4 w-4" /> Export All Posts
        </Button>
      </div>

      {/* Image Modal */}
      {selectedImage && imageUpdateIndex !== null && (
        <ImageModal
          key={currentImageKey} // **Added Key for Unique Modal Instances**
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageSrc={selectedImage}
          onImageUpdate={handleImageUpdate}
          originalImageSrc={
            postsData[currentPostIndex].images[imageUpdateIndex]
          }
          imageHistory={modalImageHistory}
        />
      )}
    </div>
  );
}
