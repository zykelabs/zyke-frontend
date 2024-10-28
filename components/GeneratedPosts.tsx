// components/GeneratedPosts.tsx

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

// Utility function to combine class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-200',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  }

  const sizeStyles = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1.5 text-sm',
    icon: 'p-2',
  }

  return (
    <button
      className={cn(
        'rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-100',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('bg-white rounded-lg shadow-md p-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h2 className={cn('text-xl font-semibold', className)} {...props}>
      {children}
    </h2>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

// ScrollArea Component
interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollArea: React.FC<ScrollAreaProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('overflow-y-auto', className)} {...props}>
      {children}
    </div>
  )
}

// Define the Post and Idea Types
interface Post {
  caption: string
  images: string[]
}

interface Idea {
  id: string
  title: string
  type: string
  posts: Post[]
}

// ImageModal Component
interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onImageUpdate: (newImage: string, imageHistory: string[]) => void // Function to update image in parent component
  originalImageSrc: string // Original image to allow reverting back
  imageHistory: string[]
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onImageUpdate,
  originalImageSrc,
  imageHistory: initialImageHistory,
}) => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [masks, setMasks] = useState<string[]>([])
  const [selectedMask, setSelectedMask] = useState<string | null>(null)
  const [displayedImage, setDisplayedImage] = useState<string>(imageSrc)
  const [imageHistory, setImageHistory] = useState<string[]>(initialImageHistory)
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(
    initialImageHistory.length - 1
  )
  const [isMaskSelectionReady, setIsMaskSelectionReady] = useState(false)
  const [isSelectMaskActive, setIsSelectMaskActive] = useState(false)

  const hardcodedMasks = [
    '/masks/L_Model_blended_img_1.png',
    '/masks/L_Model_blended_img_2.png',
    '/masks/L_Model_blended_img_3.png',
    '/masks/L_Model_blended_img_4.png',
    '/masks/L_Model_blended_img_5.png',
    '/masks/L_Model_blended_img_6.png',
  ]

  const fixedGeneratedImage = '/generated/fixed.png' // Placeholder image for no mask generation

  useEffect(() => {
    if (isOpen) {
      setPrompt('')
      setIsGenerating(false)
      setMasks([])
      setSelectedMask(null)
      setDisplayedImage(imageHistory[currentHistoryIndex])
      setIsMaskSelectionReady(false)
      setIsSelectMaskActive(false)
    }
  }, [isOpen, imageHistory, currentHistoryIndex])

  const handleGenerate = () => {
    if (isGenerating) return

    setIsGenerating(true)

    // Simulate API call with a 1-second delay for demo purposes
    setTimeout(() => {
      let newImage = fixedGeneratedImage // Default image if no mask is selected

      if (selectedMask) {
        // If a mask is selected, use a corresponding generated image
        const maskIndex = hardcodedMasks.indexOf(selectedMask)
        // For demonstration, assuming predecided generated images
        const predecidedImages = [
          '/generated/generated1.png',
          '/generated/generated2.png',
          '/generated/generated3.png',
          '/generated/generated4.png',
          '/generated/generated5.png',
          '/generated/generated6.png',
        ]
        newImage =
          maskIndex !== -1
            ? predecidedImages[maskIndex % predecidedImages.length]
            : fixedGeneratedImage
      }

      // Update image history
      const newImageHistory = [
        ...imageHistory.slice(0, currentHistoryIndex + 1),
        newImage,
      ]
      setImageHistory(newImageHistory)
      setCurrentHistoryIndex(newImageHistory.length - 1)
      setDisplayedImage(newImage)
      setIsGenerating(false)

      // Update image in parent component
      onImageUpdate(newImage, newImageHistory)
    }, 1000) // Faster generation for demo purposes
  }

  const handleSelectMask = () => {
    // Toggle mask selection mode
    const canActivate = !isCurrentImageMask && !isGenerating

    if (!canActivate) return

    setIsMaskSelectionReady(!isMaskSelectionReady)
    setIsSelectMaskActive(!isSelectMaskActive)

    if (!isMaskSelectionReady) {
      // Activating mask selection
      setMasks([])
      setSelectedMask(null)
    } else {
      // Deactivating mask selection
      setMasks([])
      setSelectedMask(null)
    }
  }

  const handleImageClick = () => {
    if (isSelectMaskActive && masks.length === 0) {
      // Load masks when user clicks on the image after selecting mask
      setMasks(hardcodedMasks)
      setSelectedMask(null) // Reset any previously selected mask
      // Deactivate the select mask button
      setIsSelectMaskActive(false)
      setIsMaskSelectionReady(false)
    }
  }

  const handleMaskSelection = (mask: string) => {
    setSelectedMask(mask)
    setDisplayedImage(mask)
    setImageHistory((prev) => [...prev.slice(0, currentHistoryIndex + 1), mask])
    setCurrentHistoryIndex((prev) => prev + 1)
    setMasks([]) // Hide masks after selection
    // Make button non-clickable when viewing a mask
    setIsSelectMaskActive(false)
    setIsMaskSelectionReady(false)
  }

  const handleRevert = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1
      const previousImage = imageHistory[newIndex]
      setCurrentHistoryIndex(newIndex)
      setDisplayedImage(previousImage)
      setSelectedMask(null)

      // Update parent component
      onImageUpdate(previousImage, imageHistory.slice(0, newIndex + 1))
    }
  }

  // Navigate to previous image in history
  const handlePrevImage = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1
      setCurrentHistoryIndex(newIndex)
      setDisplayedImage(imageHistory[newIndex])
      onImageUpdate(imageHistory[newIndex], imageHistory.slice(0, newIndex + 1))
    }
  }

  // Navigate to next image in history
  const handleNextImage = () => {
    if (currentHistoryIndex < imageHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1
      setCurrentHistoryIndex(newIndex)
      setDisplayedImage(imageHistory[newIndex])
      onImageUpdate(imageHistory[newIndex], imageHistory.slice(0, newIndex + 1))
    }
  }

  // Determine if the current image is a mask
  const isCurrentImageMask = hardcodedMasks.includes(displayedImage)

  // Handle backdrop click
  const handleBackdropClick = () => {
    onClose()
  }

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowLeft') {
        handlePrevImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      } else if (e.key === 'Escape') {
        onClose()
      }
    },
    [isOpen, handlePrevImage, handleNextImage, onClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

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
            <div className="flex justify-center relative" onClick={handleImageClick}>
              {imageSrc.startsWith('data:image') ? (
                <img
                  src={displayedImage}
                  alt="Expanded Image"
                  className="object-contain rounded-md cursor-pointer"
                  loading="lazy"
                  style={
                    initialImageHistory.length === 1
                      ? { maxHeight: '400px', width: 'auto' }
                      : {}
                  }
                />
              ) : (
                <Image
                  src={displayedImage}
                  alt="Expanded Image"
                  width={350}
                  height={500}
                  className="object-contain rounded-md cursor-pointer"
                  style={
                    initialImageHistory.length === 1
                      ? { maxHeight: '400px', width: 'auto' }
                      : {}
                  }
                />
              )}
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
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'hover:bg-gray-200'
                }
                style={{
                  transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                  cursor:
                    isCurrentImageMask || isGenerating
                      ? 'not-allowed'
                      : 'pointer',
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
                      variant={selectedMask === mask ? 'default' : 'outline'}
                      className="p-0.5"
                      onClick={() => handleMaskSelection(mask)}
                    >
                      <Image
                        src={mask}
                        alt={`Mask ${index + 1}`}
                        width={60}
                        height={60}
                        className={cn(
                          'object-contain rounded-md cursor-pointer',
                          selectedMask === mask
                            ? 'border-2 border-indigo-600'
                            : 'border-2 border-transparent'
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
                  backgroundColor: isGenerating ? '#a5b4fc' : undefined,
                  transition: 'background-color 0.2s ease-in-out',
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
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
  )
}

// Main GeneratedPosts Component
export default function GeneratedPosts() {
  const searchParams = useSearchParams()
  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([])
  const [customIdea, setCustomIdea] = useState('')
  const [includeAI, setIncludeAI] = useState(false)
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0)
  const [currentPostIndex, setCurrentPostIndex] = useState(0)
  const [copiedCaption, setCopiedCaption] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageUpdateIndex, setImageUpdateIndex] = useState<number | null>(null)
  const [currentImageKey, setCurrentImageKey] = useState<string>('')
  const [modalImageHistory, setModalImageHistory] = useState<string[]>([])
  const [imageHistories, setImageHistories] = useState<{ [key: string]: string[] }>({})

  // Session Management
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // State for API Posts
  const [apiPosts, setApiPosts] = useState<{ [idea: string]: Post[] }>({})

  useEffect(() => {
    const fetchStoredPost = async () => {
      const accessToken = session?.accessToken // Adjust this line based on where your accessToken is stored
      if (!accessToken) {
        console.error("No access token found.")
        setError("No access token found.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch("http://127.0.0.1:5000/fetch_last_post/get_stored_post", {
          method: 'POST', // Ensure this matches your API's method
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({}) // Include if your API expects a body
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("API Response:", data)

        // Process the API response
        const processedPosts: { [idea: string]: Post[] } = {}
        for (const [ideaName, posts] of Object.entries(data.posts)) {
          processedPosts[ideaName] = posts.map((postObj: any) => {
            const [caption, images] = Object.entries(postObj)[0]
            return { caption, images }
          })
        }
        setApiPosts(processedPosts)
      } catch (err) {
        console.error("Error fetching stored post:", err)
        setError("Error fetching stored post.")
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchStoredPost()
    } else if (status === 'unauthenticated') {
      console.error("User is not authenticated.")
      setError("User is not authenticated.")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]) // Dependencies

  // Define your ideas from API
  const fetchedIdeas: Idea[] = Object.keys(apiPosts).map((ideaName, index) => ({
    id: `fetched-${index}`,
    title: ideaName,
    type: 'fetched',
    posts: apiPosts[ideaName],
  }))

  // Handle Search Params to set selected ideas and other configurations
  useEffect(() => {
    const ideasParam = searchParams.get('ideas')
    if (ideasParam) {
      setSelectedIdeas(ideasParam.split(',').map(Number))
    }
    setCustomIdea(searchParams.get('customIdea') || '')
    setIncludeAI(searchParams.get('includeAI') === 'true')
  }, [searchParams])

  // Define existing predefined ideas (if any)
  const predefinedIdeas: Idea[] = [
    // Add your predefined ideas here if needed
    // Example:
    // {
    //   id: '1',
    //   title: "SpaceX vs Zomato Infographics",
    //   type: "infographic",
    //   posts: [], // Populate if you have predefined posts
    // },
  ]

  // Combine fetched ideas with predefined, custom, and AI-generated ideas
  const allIdeas: Idea[] = [
    ...fetchedIdeas,
    ...predefinedIdeas.filter((idea) => selectedIdeas.includes(Number(idea.id))),
    ...(customIdea
      ? [{ id: 'custom', title: 'Custom Idea', type: 'custom', posts: [] }]
      : []),
    ...(includeAI
      ? [{ id: 'ai', title: 'AI Generated Idea', type: 'ai', posts: [] }]
      : []),
  ]

  // Initialize postsData based on currentIdeaIndex and allIdeas
  const [postsData, setPostsData] = useState<Post[]>([])

  // State to track current post index for each idea
  const [postIndices, setPostIndices] = useState<{ [ideaIndex: number]: number }>({})

  useEffect(() => {
    if (allIdeas.length > 0) {
      const currentIdea = allIdeas[currentIdeaIndex]
      if (currentIdea.type === 'fetched' && currentIdea.posts) {
        setPostsData(currentIdea.posts)
        // Initialize post index for the current idea if not already set
        setPostIndices((prev) => ({
          ...prev,
          [currentIdeaIndex]: prev[currentIdeaIndex] ?? 0,
        }))
        // Set currentPostIndex based on postIndices
        setCurrentPostIndex(postIndices[currentIdeaIndex] ?? 0)
      } else {
        // Handle other idea types (custom, AI-generated) if necessary
        // For simplicity, setting postsData as empty or you can implement similar fetching
        setPostsData([])
        setCurrentPostIndex(0)
      }
    }
  }, [allIdeas, currentIdeaIndex, postIndices])

  const handleCopyCaption = () => {
    const caption = postsData[currentPostIndex]?.caption || ''
    navigator.clipboard.writeText(caption)
    setCopiedCaption(true)
    setTimeout(() => setCopiedCaption(false), 2000)
  }

  const handleNextPost = () => {
    const currentIdea = allIdeas[currentIdeaIndex]
    const totalPosts = postsData.length

    if (currentPostIndex < totalPosts - 1) {
      const newPostIndex = currentPostIndex + 1
      setCurrentPostIndex(newPostIndex)
      setPostIndices((prev) => ({
        ...prev,
        [currentIdeaIndex]: newPostIndex,
      }))
    } else if (currentIdeaIndex < allIdeas.length - 1) {
      const newIdeaIndex = currentIdeaIndex + 1
      setCurrentIdeaIndex(newIdeaIndex)
      // The useEffect will handle setting the correct post index
    }
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePrevPost = () => {
    const currentIdea = allIdeas[currentIdeaIndex]

    if (currentPostIndex > 0) {
      const newPostIndex = currentPostIndex - 1
      setCurrentPostIndex(newPostIndex)
      setPostIndices((prev) => ({
        ...prev,
        [currentIdeaIndex]: newPostIndex,
      }))
    } else if (currentIdeaIndex > 0) {
      const newIdeaIndex = currentIdeaIndex - 1
      const previousIdea = allIdeas[newIdeaIndex]
      const previousIdeaPostCount = previousIdea.posts.length
      const newPostIndex = postIndices[newIdeaIndex] ?? (previousIdeaPostCount > 0 ? previousIdeaPostCount - 1 : 0)
      setCurrentIdeaIndex(newIdeaIndex)
      setCurrentPostIndex(newPostIndex)
      setPostIndices((prev) => ({
        ...prev,
        [newIdeaIndex]: newPostIndex,
      }))
    }
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleImageClick = (imageObj: string, imageIndex: number) => {
    const imageKey = `${currentIdeaIndex}-${currentPostIndex}-${imageIndex}`
    const existingHistory = imageHistories[imageKey]
    const initialHistory = existingHistory || [imageObj]
    setSelectedImage(initialHistory[initialHistory.length - 1])
    setIsModalOpen(true)
    setImageUpdateIndex(imageIndex)
    setCurrentImageKey(imageKey)
    setModalImageHistory(initialHistory)
  }

  const handleImageUpdate = (newImage: string, newHistory: string[]) => {
    if (imageUpdateIndex !== null) {
      setPostsData((prevPosts) => {
        const updatedPosts = [...prevPosts]
        const updatedImages = [...updatedPosts[currentPostIndex].images]
        updatedImages[imageUpdateIndex] = newImage
        updatedPosts[currentPostIndex] = {
          ...updatedPosts[currentPostIndex],
          images: updatedImages,
        }
        return updatedPosts
      })

      // Update imageHistories
      setImageHistories((prevHistories) => ({
        ...prevHistories,
        [currentImageKey]: newHistory,
      }))
    }
  }

  // Define currentIdea after ensuring allIdeas has at least one idea
  const currentIdea = allIdeas[currentIdeaIndex]

  // Function to handle exporting the current post
  const handleExportPost = async () => {
    const currentPost = postsData[currentPostIndex]
    if (!currentPost) {
      alert("No post available to export.")
      return
    }

    const zip = new JSZip()
    const folder = zip.folder(`Post_${currentPostIndex + 1}`) || zip

    // Add caption as a text file
    folder.file("caption.txt", currentPost.caption)

    // Function to convert base64 to blob
    const base64ToBlob = (base64: string, mime: string) => {
      const byteCharacters = atob(base64.split(',')[1])
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      return new Blob([byteArray], { type: mime })
    }

    // Iterate through images and add them to the zip
    for (let i = 0; i < currentPost.images.length; i++) {
      const image = currentPost.images[i]
      let blob: Blob | null = null
      let filename = `image_${i + 1}.png` // Default extension

      if (image.startsWith('data:image')) {
        // Handle base64 encoded images
        const mime = image.substring("data:".length, image.indexOf(';'))
        blob = base64ToBlob(image, mime)
        const extension = mime.split('/')[1]
        filename = `image_${i + 1}.${extension}`
      } else {
        // Handle image URLs
        try {
          const response = await fetch(image)
          if (response.ok) {
            blob = await response.blob()
            const contentDisposition = response.headers.get('Content-Disposition')
            if (contentDisposition && contentDisposition.includes('filename=')) {
              const matches = /filename="?(.+)"?/.exec(contentDisposition)
              if (matches && matches[1]) {
                filename = matches[1]
              }
            } else {
              // Try to extract filename from URL
              const urlParts = image.split('/')
              const lastPart = urlParts[urlParts.length - 1]
              filename = lastPart || `image_${i + 1}.png`
            }
          } else {
            console.error(`Failed to fetch image at ${image}: ${response.statusText}`)
          }
        } catch (error) {
          console.error(`Error fetching image at ${image}:`, error)
        }
      }

      if (blob) {
        folder.file(filename, blob)
      }
    }

    // Generate the zip file and trigger download with updated filename
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        // Construct the new filename with Idea number and Post number
        const ideaNumber = currentIdeaIndex + 1
        const postNumber = currentPostIndex + 1
        const zipFilename = `Idea_${ideaNumber}_Post_${postNumber}.zip`
        saveAs(content, zipFilename)
      })
      .catch((error) => {
        console.error("Error generating zip:", error)
        alert("Failed to export the post.")
      })
  }

  // Render component
  if (allIdeas.length === 0 && !loading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
        <Link
          href="/generate-ideas"
          className="inline-flex items-center mb-8 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Idea Generator
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-8">No Ideas Found</h1>
        <p className="text-gray-600">
          Please select at least one idea or add a custom/AI-generated idea.
        </p>
      </div>
    )
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
              <ScrollArea className="h-[calc(90vh-200px)]">
                {allIdeas.map((idea, index) => (
                  <Button
                    key={idea.id}
                    variant={currentIdeaIndex === index ? 'default' : 'outline'}
                    className="w-full mb-2 justify-start text-left"
                    onClick={() => {
                      setCurrentIdeaIndex(index)
                      // The useEffect will handle setting currentPostIndex based on postIndices
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
                            : '1fr',
                      }}
                    >
                      {postsData[currentPostIndex]?.images.map((imageObj, index) => (
                        <div
                          key={index}
                          className="relative cursor-pointer"
                          onClick={() => handleImageClick(imageObj, index)}
                          style={
                            postsData[currentPostIndex].images.length === 1
                              ? { display: 'flex', justifyContent: 'center' }
                              : {}
                          }
                        >
                          {imageObj.startsWith('data:image') ? (
                            <img
                              src={imageObj}
                              alt={`Image ${index + 1} for Post ${currentPostIndex + 1} of ${currentIdea?.title}`}
                              className="object-cover rounded-md cursor-pointer"
                              loading="lazy"
                              style={
                                postsData[currentPostIndex].images.length === 1
                                  ? { maxHeight: '400px', width: 'auto' }
                                  : {}
                              }
                            />
                          ) : (
                            <Image
                              src={imageObj}
                              alt={`Image ${index + 1} for Post ${currentPostIndex + 1} of ${currentIdea?.title}`}
                              width={400}
                              height={800}
                              className="object-cover rounded-md cursor-pointer"
                              style={
                                postsData[currentPostIndex].images.length === 1
                                  ? { maxHeight: '400px', width: 'auto' }
                                  : {}
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Caption */}
                    <div className="bg-white p-4 rounded-md shadow">
                      <p className="text-gray-800">{postsData[currentPostIndex]?.caption}</p>
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
                    currentPostIndex === (currentIdea?.posts?.length || 0) - 1
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              {/* Post Information and Caption Copy */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Post {currentPostIndex + 1} of {postsData.length} for Idea {currentIdeaIndex + 1} of {allIdeas.length}
                </span>
                <div className="flex space-x-2">
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPost}
                    className="flex items-center"
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
          key={currentImageKey} // **Added Key for Unique Modal Instances**
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageSrc={selectedImage}
          onImageUpdate={handleImageUpdate}
          originalImageSrc={postsData[currentPostIndex]?.images[imageUpdateIndex] || ''}
          imageHistory={modalImageHistory}
        />
      )}
    </div>
  )
}
