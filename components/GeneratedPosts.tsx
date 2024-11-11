// components/GeneratedPosts.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
import { useSession } from "next-auth/react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

// Utility function to combine class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Define the Post and Idea Types
interface Post {
  caption: string;
  images: string[];
}

interface Idea {
  id: string;
  title: string;
  type: string;
  posts: Post[];
}

// ImageModal Component
interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string; // Currently displayed image (could be original or modified)
  onImageUpdate: (newImage: string, imageHistory: string[]) => void;
  originalImageSrc: string; // The original image
  imageHistory: string[]; // History of images for this slot
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onImageUpdate,
  originalImageSrc,
  imageHistory: initialImageHistory,
}) => {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [blendedImages, setBlendedImages] = useState<string[]>([]);
  const [dilatedMasks, setDilatedMasks] = useState<string[]>([]);
  const [masks, setMasks] = useState<string[]>([]);
  const [selectedDilatedMask, setSelectedDilatedMask] = useState<string>("");
  const [displayedImage, setDisplayedImage] = useState<string>(imageSrc);
  const [imageHistory, setImageHistory] = useState<string[]>(initialImageHistory);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(
    initialImageHistory.length - 1
  );
  const [isMaskSelectionReady, setIsMaskSelectionReady] = useState(false);
  const [isSelectMaskActive, setIsSelectMaskActive] = useState(false);
  const [loadingMasks, setLoadingMasks] = useState<boolean>(false);
  const [errorMasks, setErrorMasks] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [blendedWithDilated, setBlendedWithDilated] = useState<
    { blendedImage: string; dilatedMask: string }[]
  >([]);

  const [isLoadingMask, setIsLoadingMask] = useState<boolean>(false);

  const [remove, setRemove] = useState<boolean>(false);

  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  // Utility function to convert image URL to base64
  const convertImageToBase64 = async (url: string): Promise<string> => {
    if (url.startsWith("data:image")) return url;
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) resolve(reader.result as string);
        else reject("Failed to convert image to base64.");
      };
      reader.onerror = () => reject("Failed to convert image to base64.");
      reader.readAsDataURL(blob);
    });
  };

  // Fetch masks from initial segmentation API and then blend them
  const handleImageClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isSelectMaskActive) return;

    if (!originalDimensions) {
      console.error("Original dimensions not available.");
      return;
    }

    const img = imageRef.current;
    if (!img) {
      console.error("Image reference is not available.");
      return;
    }

    const rect = img.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Check if click is inside the image
    if (
      clickX < 0 ||
      clickY < 0 ||
      clickX > rect.width ||
      clickY > rect.height
    ) {
      // Click is outside the image
      return;
    }

    // Calculate proportional coordinates
    const x_proportion = clickX / rect.width;
    const y_proportion = clickY / rect.height;

    // Prepare the original image in base64 format for segmentation
    let base64Image = "";
    try {
      base64Image = await convertImageToBase64(originalImageSrc); // Always use originalImageSrc
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return;
    }

    // Prepare the payload for segmentation with proportional coordinates
    const segmentPayload = {
      x: parseFloat(x_proportion.toFixed(4)),
      y: parseFloat(y_proportion.toFixed(4)),
      user_id: session?.user?.id || "unknown_user",
      image: base64Image,
    };

    // Make initial segmentation API call
    setLoadingMasks(true);
    setErrorMasks(null);
    setIsLoadingMask(true); // Start loading cursor
    try {
      const segmentResponse = await fetch(
        "https://click-segment-new-617792710458.asia-southeast1.run.app/segment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(segmentPayload),
        }
      );

      if (!segmentResponse.ok) {
        throw new Error(`Error segmenting image: ${segmentResponse.statusText}`);
      }

      const segmentData = await segmentResponse.json();
      if (segmentData.masks && Array.isArray(segmentData.masks)) {
        // Now send masks along with original image to blend_masks API
        const blendPayload = {
          masks: segmentData.masks,
          img: base64Image,
        };

        const blendResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blend/blend_masks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(blendPayload),
          }
        );

        if (!blendResponse.ok) {
          throw new Error(`Error blending masks: ${blendResponse.statusText}`);
        }

        const blendData = await blendResponse.json();
        if (
          blendData.blended_images &&
          Array.isArray(blendData.blended_images) &&
          blendData.dilated_masks &&
          Array.isArray(blendData.dilated_masks)
        ) {
          // Ensure both arrays are of the same length
          if (blendData.blended_images.length !== blendData.dilated_masks.length) {
            throw new Error("Mismatch between blended images and dilated masks count.");
          }

          // Map blended images with their corresponding dilated masks
          const combinedData = blendData.blended_images.map(
            (blendedImg: string, index: number) => ({
              blendedImage: blendedImg,
              dilatedMask: blendData.dilated_masks[index],
            })
          );
          setBlendedWithDilated(combinedData);

          // Update masks state to display blended images
          setMasks(blendData.blended_images);

          // Deactivate selection mode after successfully setting masks
          setIsSelectMaskActive(false);
        } else {
          throw new Error("Invalid data format from blend_masks API.");
        }
      } else {
        throw new Error("Invalid masks data received from segmentation API.");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMasks(error.message || "Failed to process masks.");
    } finally {
      setLoadingMasks(false);
      setIsLoadingMask(false); // End loading cursor
      // Ensure selection mode is turned off even if there's an error
      setIsSelectMaskActive(false);
    }
  };

  // Handle mask selection
  const handleMaskSelection = (index: number) => {
    const selectedData = blendedWithDilated[index];
    if (!selectedData) {
      console.error("Selected mask data not found.");
      return;
    }

    setSelectedDilatedMask(selectedData.dilatedMask);
    setDisplayedImage(selectedData.blendedImage); // Display the selected blended image

    // Update image history
    const newImageHistory = [
      ...imageHistory.slice(0, currentHistoryIndex + 1),
      selectedData.blendedImage,
    ];
    setImageHistory(newImageHistory);
    setCurrentHistoryIndex(newImageHistory.length - 1);
    setMasks([]); // Hide masks after selection
    setIsSelectMaskActive(false); // Deactivate selection mode
    setIsMaskSelectionReady(false);
    setIsGenerated(false); // Reset generation state when a new mask is selected
  };

  // Functions for Activating and Canceling Mask Selection
  const activateSelectMask = () => {
    if (isSelectMaskActive || isGenerating) return;
    setIsSelectMaskActive(true);
    setMasks([]);
    setSelectedDilatedMask("");
  };

  const cancelSelectMask = () => {
    if (!isSelectMaskActive) return;
    setIsSelectMaskActive(false);
    setMasks([]);
    setSelectedDilatedMask("");
  };

  // Revert to previous image in history
  const handleRevert = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousImage = imageHistory[newIndex];
      setCurrentHistoryIndex(newIndex);
      setDisplayedImage(previousImage);
      onImageUpdate(previousImage, imageHistory.slice(0, newIndex + 1));
      setIsGenerated(false); // Re-enable controls when reverting
    }
  };

  // Navigate to previous image in history
  const handlePrevImage = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setDisplayedImage(imageHistory[newIndex]);
      onImageUpdate(imageHistory[newIndex], imageHistory.slice(0, newIndex + 1));
      setIsGenerated(false); // Re-enable controls when navigating
    }
  };

  // Navigate to next image in history
  const handleNextImage = () => {
    if (currentHistoryIndex < imageHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setDisplayedImage(imageHistory[newIndex]);
      onImageUpdate(imageHistory[newIndex], imageHistory.slice(0, newIndex + 1));
      setIsGenerated(false); // Re-enable controls when navigating
    }
  };

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

  // Capture original image dimensions
  const handleImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = event.currentTarget;
    setOriginalDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  // Cleanup on modal close
  useEffect(() => {
    if (isOpen) {
      setPrompt("");
      setIsGenerating(false);
      setBlendedImages([]);
      setDilatedMasks([]);
      setMasks([]);
      setSelectedDilatedMask("");
      setDisplayedImage(imageHistory[currentHistoryIndex]);
      setIsMaskSelectionReady(false);
      setIsSelectMaskActive(false);
      setErrorMasks(null);
      setBlendedWithDilated([]);
      setRemove(false); // Reset remove state
      setIsGenerated(false); // Reset generation state
    }
  }, [isOpen]);

  // Fetch generated image based on mask and prompt
  const handleGenerate = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      // Prepare the payload
      const base64Image = await convertImageToBase64(originalImageSrc); // Always use originalImageSrc
      let dilatedMask = "";
      if (selectedDilatedMask) {
        dilatedMask = selectedDilatedMask;
      }

      const payload = {
        prompt: remove ? "" : prompt,
        neg_prompt: "",
        remove: remove.toString(),
        mask: dilatedMask,
        image: base64Image,
      };
      const accessToken = session?.accessToken;
      if (!accessToken) {
        console.error("No access token found.");
        setError("No access token found.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/inpaint/inpaint_image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Error generating image: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedImage = data.result;

      // Update image history
      const newImageHistory = [
        ...imageHistory.slice(0, currentHistoryIndex + 1),
        generatedImage,
      ];
      setImageHistory(newImageHistory);
      setCurrentHistoryIndex(newImageHistory.length - 1);
      setDisplayedImage(generatedImage);
      setSelectedDilatedMask("");
      setIsGenerated(true); // Disable controls after generation

      // Update image in parent component
      onImageUpdate(
        newImageHistory[newImageHistory.length - 1],
        newImageHistory
      );
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Determine if a blended image is selected
  const isBlendedImageSelected = selectedDilatedMask !== "";

  // Determine if the currently displayed image is the original image
  const isOriginalImage = currentHistoryIndex === 0;

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
            className="bg-white rounded-2xl p-6 relative w-full max-w-3xl h-[90vh] flex flex-col"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              cursor: isLoadingMask || isGenerating ? "wait" : "default",
            }}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              className="absolute top-4 right-4 z-10"
              onClick={onClose}
              aria-label="Close Modal"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Loader Overlay for Mask Processing */}
            {isLoadingMask && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl z-20">
                <div className="loader"></div>
              </div>
            )}

            {/* Content Container */}
            <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-4">
              {/* Image Display */}
              <div className="flex justify-center relative flex-shrink-0">
                {/* Display the image */}
                <div
                  className="relative w-full max-h-1/2 flex justify-center items-center cursor-pointer"
                  onClick={handleImageClick}
                >
                  <img
                    src={displayedImage}
                    alt="Expanded Image"
                    className="object-contain rounded-md"
                    loading="lazy"
                    ref={imageRef}
                    onLoad={handleImageLoad}
                    style={{
                      maxHeight: "50vh",
                      maxWidth: "100%",
                      width: "auto",
                      height: "auto",
                    }}
                  />
                  {/* Loader Overlay for Image Generation */}
                  {isGenerating && (
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                {imageHistory.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100"
                      onClick={handlePrevImage}
                      disabled={currentHistoryIndex === 0}
                      aria-label="Previous Image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100"
                      onClick={handleNextImage}
                      disabled={
                        currentHistoryIndex === imageHistory.length - 1
                      }
                      aria-label="Next Image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              {/* Revert Button */}
              {currentHistoryIndex > 0 && (
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={handleRevert}
                    aria-label="Revert Image"
                  >
                    Revert to Previous Image
                  </Button>
                </div>
              )}

              {/* Select Point for Masking or Cancel Mask Selection Button */}
              {isSelectMaskActive ? (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={cancelSelectMask}
                    disabled={isGenerating}
                    className="bg-red-600 text-white hover:bg-red-500"
                    style={{
                      transition:
                        "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                      cursor: isGenerating ? "not-allowed" : "pointer",
                    }}
                    aria-label="Cancel Mask Selection"
                  >
                    Cancel Mask Selection
                  </Button>
                </div>
              ) : (
                isOriginalImage && !selectedDilatedMask && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={activateSelectMask}
                      disabled={
                        isSelectMaskActive || isGenerating || !originalDimensions
                      }
                      className="hover:bg-gray-200"
                      style={{
                        transition:
                          "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                        cursor:
                          isSelectMaskActive ||
                          isGenerating ||
                          !originalDimensions
                            ? "not-allowed"
                            : "pointer",
                      }}
                      aria-label="Select Point for Masking"
                    >
                      Select Point for Masking
                    </Button>
                  </div>
                )
              )}

              {/* Segmentation Masks Section */}
              {masks.length > 0 && (
                <div className="mt-6">
                  <Label className="block mb-3 text-lg font-semibold">
                    Select a Mask
                  </Label>
                  {loadingMasks ? (
                    <div className="flex justify-center">
                      <div className="loader"></div>
                    </div>
                  ) : errorMasks ? (
                    <div className="text-red-500">{errorMasks}</div>
                  ) : (
                    <div className="flex space-x-4 overflow-x-auto items-start h-60 sm:h-72 flex-shrink-0 pr-4 mr-4">
                      {masks.map((mask, index) => (
                        <div
                          key={index}
                          className="relative group flex-shrink-0"
                        >
                          <Button
                            variant={
                              selectedDilatedMask ===
                              blendedWithDilated[index].dilatedMask
                                ? "default"
                                : "outline"
                            }
                            className="rounded-lg overflow-hidden w-60 sm:w-72 h-60 sm:h-72 flex items-center justify-center"
                            onClick={() => handleMaskSelection(index)}
                            aria-label={`Select Mask ${index + 1}`}
                          >
                            <img
                              src={mask}
                              alt={`Mask ${index + 1}`}
                              className={cn(
                                "object-contain w-full h-full rounded-md transition-transform duration-200 transform group-hover:scale-105",
                                selectedDilatedMask ===
                                  blendedWithDilated[index].dilatedMask
                                  ? "border-2 border-indigo-600"
                                  : "border-2 border-transparent"
                              )}
                            />
                          </Button>
                          {selectedDilatedMask ===
                            blendedWithDilated[index].dilatedMask && (
                            <span className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Remove Slider and Prompt Input */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-lg font-semibold">Remove:</Label>
                  <Switch
                    checked={remove}
                    onCheckedChange={(checked) => setRemove(checked)}
                    aria-label="Remove Toggle"
                    disabled={!isBlendedImageSelected || isGenerated}
                  />
                </div>
                <div className="mb-3">
                  <Label className="text-gray-600-base font-extralight">
                    Toggle to remove selection region (blend with background or
                    remove object). Prompt is ignored if turned on.
                  </Label>
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write what to generate in the region. ex: 'boy' and not 'replace the girl with a boy'"
                  className={cn(
                    "w-full p-3 border rounded-md",
                    isBlendedImageSelected
                      ? "border-gray-300 bg-white text-gray-900"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                  disabled={!isBlendedImageSelected || remove || isGenerated}
                  aria-label="Prompt Input"
                />
                <Button
                  className={cn(
                    "mt-3 w-full flex items-center justify-center",
                    isBlendedImageSelected
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                  onClick={handleGenerate}
                  disabled={
                    !isBlendedImageSelected ||
                    isGenerated ||
                    isGenerating ||
                    (!remove && !prompt.trim())
                  }
                  style={{
                    transition: "background-color 0.2s ease-in-out",
                  }}
                  aria-label="Generate Image"
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>

            {/* Inline Styles for Loader and Scrollbar */}
            <style jsx>{`
              .loader {
                border: 8px solid #f3f3f3; /* Light grey */
                border-top: 8px solid #3498db; /* Blue */
                border-radius: 50%;
                width: 64px;
                height: 64px;
                animation: spin 2s linear infinite;
              }

              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
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

  // Session Management
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // State for API Posts
  const [apiPosts, setApiPosts] = useState<{ [idea: string]: Post[] }>({});

  useEffect(() => {
    const fetchStoredPost = async () => {
      const accessToken = session?.accessToken;
      if (!accessToken) {
        console.error("No access token found.");
        setError("No access token found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fetch_last_post/get_stored_post`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Process the API response
        const processedPosts: { [ideaName: string]: Post[] } = {};
        for (const [ideaName, posts] of Object.entries(data.posts)) {
          processedPosts[ideaName] = posts.map((postObj: any) => {
            const [caption, images] = Object.entries(postObj)[0];
            return { caption, images };
          });
        }
        setApiPosts(processedPosts);
      } catch (err) {
        console.error("Error fetching stored post:", err);
        setError("Error fetching stored post.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStoredPost();
    } else if (status === "unauthenticated") {
      console.error("User is not authenticated.");
      setError("User is not authenticated.");
    }
  }, [session, status]);

  // Define your ideas from API
  const fetchedIdeas: Idea[] = Object.keys(apiPosts).map((ideaName, index) => ({
    id: `fetched-${index}`,
    title: ideaName,
    type: "fetched",
    posts: apiPosts[ideaName],
  }));

  // Handle Search Params to set selected ideas and other configurations
  useEffect(() => {
    const ideasParam = searchParams.get("ideas");
    if (ideasParam) {
      setSelectedIdeas(ideasParam.split(",").map(Number));
    }
    setCustomIdea(searchParams.get("customIdea") || "");
    setIncludeAI(searchParams.get("includeAI") === "true");
  }, [searchParams]);

  // Define existing predefined ideas (if any)
  const predefinedIdeas: Idea[] = [];

  // Combine fetched ideas with predefined, custom, and AI-generated ideas
  const allIdeas: Idea[] = [
    ...fetchedIdeas,
    ...predefinedIdeas.filter((idea) =>
      selectedIdeas.includes(Number(idea.id.split("-")[1]))
    ),
    ...(customIdea
      ? [{ id: "custom", title: "Custom Idea", type: "custom", posts: [] }]
      : []),
    ...(includeAI
      ? [{ id: "ai", title: "AI Generated Idea", type: "ai", posts: [] }]
      : []),
  ];

  // Initialize postsData based on currentIdeaIndex and allIdeas
  const [postsData, setPostsData] = useState<Post[]>([]);

  // State to track current post index for each idea
  const [postIndices, setPostIndices] = useState<{
    [ideaIndex: number]: number;
  }>({});

  // Effect to set postsData when allIdeas or currentIdeaIndex changes
  useEffect(() => {
    if (allIdeas.length > 0) {
      const currentIdea = allIdeas[currentIdeaIndex];
      if (currentIdea.type === "fetched" && currentIdea.posts) {
        setPostsData(currentIdea.posts);
      } else {
        // Handle other idea types (custom, AI-generated) if necessary
        setPostsData([]);
      }
    }
  }, [allIdeas, currentIdeaIndex]);

  // Effect to initialize or set currentPostIndex based on postIndices
  useEffect(() => {
    if (allIdeas.length > 0) {
      const currentIdea = allIdeas[currentIdeaIndex];
      if (currentIdea.type === "fetched" && currentIdea.posts) {
        setPostIndices((prev) => {
          if (prev[currentIdeaIndex] === undefined) {
            return { ...prev, [currentIdeaIndex]: 0 };
          }
          return prev;
        });

        if (postIndices[currentIdeaIndex] !== undefined) {
          setCurrentPostIndex(postIndices[currentIdeaIndex]);
        } else {
          setCurrentPostIndex(0);
        }
      } else {
        setCurrentPostIndex(0);
      }
    }
  }, [allIdeas, currentIdeaIndex, postIndices]);

  const handleCopyCaption = () => {
    const caption = postsData[currentPostIndex]?.caption || "";
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleNextPost = () => {
    const currentIdea = allIdeas[currentIdeaIndex];
    const totalPosts = postsData.length;

    if (currentPostIndex < totalPosts - 1) {
      const newPostIndex = currentPostIndex + 1;
      setCurrentPostIndex(newPostIndex);
      setPostIndices((prev) => ({
        ...prev,
        [currentIdeaIndex]: newPostIndex,
      }));
    } else if (currentIdeaIndex < allIdeas.length - 1) {
      const newIdeaIndex = currentIdeaIndex + 1;
      setCurrentIdeaIndex(newIdeaIndex);
    }
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePrevPost = () => {
    const currentIdea = allIdeas[currentIdeaIndex];

    if (currentPostIndex > 0) {
      const newPostIndex = currentPostIndex - 1;
      setCurrentPostIndex(newPostIndex);
      setPostIndices((prev) => ({
        ...prev,
        [currentIdeaIndex]: newPostIndex,
      }));
    } else if (currentIdeaIndex > 0) {
      const newIdeaIndex = currentIdeaIndex - 1;
      const previousIdea = allIdeas[newIdeaIndex];
      const previousIdeaPostCount = previousIdea.posts.length;
      const newPostIndex =
        postIndices[newIdeaIndex] ??
        (previousIdeaPostCount > 0 ? previousIdeaPostCount - 1 : 0);
      setCurrentIdeaIndex(newIdeaIndex);
      setCurrentPostIndex(newPostIndex);
      setPostIndices((prev) => ({
        ...prev,
        [newIdeaIndex]: newPostIndex,
      }));
    }
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageClickModal = (imageObj: string, imageIndex: number) => {
    const imageKey = `${currentIdeaIndex}-${currentPostIndex}-${imageIndex}`;
    const existingHistory = imageHistories[imageKey];
    const initialHistory = existingHistory || [imageObj];
    setSelectedImage(initialHistory[initialHistory.length - 1]);
    setIsModalOpen(true);
    setImageUpdateIndex(imageIndex);
    setCurrentImageKey(imageKey);
    setModalImageHistory(initialHistory);
  };

  /**
   * Updated handleImageUpdate function to also update the parent state (`apiPosts`)
   * This ensures that changes made within the modal are reflected outside of it.
   */
  const handleImageUpdate = (newImage: string, newHistory: string[]) => {
    if (imageUpdateIndex !== null) {
      const ideaName = allIdeas[currentIdeaIndex].title;

      setApiPosts((prevApiPosts) => {
        const updatedPosts = [...(prevApiPosts[ideaName] || [])];
        if (updatedPosts[currentPostIndex]) {
          const updatedImages = [...updatedPosts[currentPostIndex].images];
          updatedImages[imageUpdateIndex] = newImage;
          updatedPosts[currentPostIndex] = {
            ...updatedPosts[currentPostIndex],
            images: updatedImages,
          };
        }
        return { ...prevApiPosts, [ideaName]: updatedPosts };
      });

      setImageHistories((prevHistories) => ({
        ...prevHistories,
        [currentImageKey]: newHistory,
      }));
    }
  };

  // Define currentIdea after ensuring allIdeas has at least one idea
  const currentIdea = allIdeas[currentIdeaIndex];

  // Function to handle exporting the current post
  const handleExportPost = async () => {
    const currentPost = postsData[currentPostIndex];
    if (!currentPost) {
      alert("No post available to export.");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder(`Post_${currentPostIndex + 1}`) || zip;

    // Add caption as a text file
    folder.file("caption.txt", currentPost.caption);

    // Function to convert base64 to blob
    const base64ToBlob = (base64: string, mime: string) => {
      const byteCharacters = atob(base64.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mime });
    };

    // Iterate through images and add them to the zip
    for (let i = 0; i < currentPost.images.length; i++) {
      const image = currentPost.images[i];
      let blob: Blob | null = null;
      let filename = `image_${i + 1}.png`; // Default extension

      if (image.startsWith("data:image")) {
        // Handle base64 encoded images
        const mime = image.substring("data:".length, image.indexOf(";"));
        blob = base64ToBlob(image, mime);
        const extension = mime.split("/")[1];
        filename = `image_${i + 1}.${extension}`;
      } else {
        // Handle image URLs
        try {
          const response = await fetch(image);
          if (response.ok) {
            blob = await response.blob();
            const contentDisposition = response.headers.get(
              "Content-Disposition"
            );
            if (
              contentDisposition &&
              contentDisposition.includes("filename=")
            ) {
              const matches = /filename="?(.+)"?/.exec(contentDisposition);
              if (matches && matches[1]) {
                filename = matches[1];
              }
            } else {
              // Try to extract filename from URL
              const urlParts = image.split("/");
              const lastPart = urlParts[urlParts.length - 1];
              filename = lastPart || `image_${i + 1}.png`;
            }
          } else {
            console.error(
              `Failed to fetch image at ${image}: ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`Error fetching image at ${image}:`, error);
        }
      }

      if (blob) {
        folder.file(filename, blob);
      }
    }

    // Generate the zip file and trigger download with updated filename
    zip
      .generateAsync({ type: "blob" })
      .then((content) => {
        const ideaNumber = currentIdeaIndex + 1;
        const postNumber = currentPostIndex + 1;
        const zipFilename = `Idea_${ideaNumber}_Post_${postNumber}.zip`;
        saveAs(content, zipFilename);
      })
      .catch((error) => {
        console.error("Error generating zip:", error);
        alert("Failed to export the post.");
      });
  };

  // Render component
  if (allIdeas.length === 0 && !loading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
        {/* User Warning */}
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
          <strong>Warning:</strong> Please download your posts' data as it may not remain saved for long.
        </div>

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
      {/* User Warning */}
      <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
        <strong>Warning:</strong> Please download your posts' data as it may not remain saved for long.
      </div>

      <Link
        href="/generated-ideas"
        className="inline-flex items-center mb-8 text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Idea Generator
      </Link>

      <h1 className="text-4xl font-bold text-gray-800 mb-8">Generated Posts</h1>

      {/* Display Loading and Error Messages */}
      {loading && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
          Loading data from API...
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      {!loading && !error && Object.keys(apiPosts).length === 0 && (
        <div className="mb-4 p-4 bg-gray-100 text-gray-800 rounded-md">
          No posts available.
        </div>
      )}

      {allIdeas.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Selected Ideas Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Selected Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[90vh]">
                {allIdeas.map((idea, index) => (
                  <Button
                    key={idea.id}
                    variant={currentIdeaIndex === index ? "default" : "outline"}
                    className="w-full mb-2 justify-start text-left"
                    onClick={() => {
                      setCurrentIdeaIndex(index);
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
              <CardTitle>{currentIdea?.title}</CardTitle>
            </CardHeader>
            <CardContent>
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
                      className={`grid gap-4`}
                      style={{
                        gridTemplateColumns:
                          postsData[currentPostIndex]?.images.length > 0
                            ? `repeat(${postsData[currentPostIndex].images.length}, 1fr)`
                            : "1fr",
                      }}
                    >
                      {postsData[currentPostIndex]?.images.map(
                        (imageObj, index) => (
                          <div
                            key={index}
                            className="relative cursor-pointer"
                            onClick={() => handleImageClickModal(imageObj, index)}
                          >
                            <img
                              src={imageObj}
                              alt={`Image ${index + 1} for Post ${
                                currentPostIndex + 1
                              } of ${currentIdea?.title}`}
                              className="object-contain rounded-md w-full h-auto max-h-[800px]"
                              loading="lazy"
                            />
                          </div>
                        )
                      )}
                    </div>
                    {/* Caption */}
                    <div className="bg-white p-4 rounded-md shadow">
                      <p className="text-gray-800">
                        {postsData[currentPostIndex]?.caption}
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
                  aria-label="Previous Post"
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
                    currentPostIndex === (currentIdea?.posts?.length || 0) - 1
                  }
                  aria-label="Next Post"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              {/* Post Information and Caption Copy */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Post {currentPostIndex + 1} of {postsData.length} for Idea{" "}
                  {currentIdeaIndex + 1} of {allIdeas.length}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCaption}
                    aria-label="Copy Caption"
                  >
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPost}
                    className="flex items-center"
                    aria-label="Export Post"
                  >
                    <Download className="h-4 w-4 mr-2" /> Export Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && imageUpdateIndex !== null && (
        <ImageModal
          key={currentImageKey}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageSrc={selectedImage}
          onImageUpdate={handleImageUpdate}
          originalImageSrc={
            postsData[currentPostIndex]?.images[imageUpdateIndex] || ""
          }
          imageHistory={modalImageHistory}
        />
      )}

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed top-4 right-4 z-50 border border-red-500 bg-red-100 rounded p-4"
          >
            <Alert variant="destructive" className="border-0 bg-red-100">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline Styles for Loader and Scrollbar */}
      <style jsx>{`
        .loader {
          border: 8px solid #f3f3f3; /* Light grey */
          border-top: 8px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 64px;
          height: 64px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
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
    </div>
  );
}
