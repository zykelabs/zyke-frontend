"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Building,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Loader2,
  MapPin,
  Users,
  MessageSquare,
  Briefcase,
  Target,
  Volume2,
  FileText,
  Palette,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

export interface SocialMedia {
  instagram: string;
  twitter: string;
  linkedin: string;
}

export interface BrandVoice {
  voiceName: string;
  summary: string;
  instagramDescriptions: string;
  created_at: string;
  updated_at: string;
}

export interface BrandProfile {
  company: string;
  brandVoiceName: string;
  industries: string[];
  location: string;
  contentTypes: string[];
  brandPersonalities: string[];
  targetAudience: string[];
  brandTone: string;
  brandType: string;
  socialMedia: SocialMedia;
  otherUrls: string[];
  manualInputText: string;
  designText: string;
  brandVoice: BrandVoice;
}

export default function BrandProfile() {
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("voice");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchBrandProfile = async () => {
      if (status === "loading") return;
      if (status === "unauthenticated") {
        router.push("/signin");
        return;
      }

      const accessToken = session?.accessToken;
      if (!accessToken) {
        setError("No access token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<BrandProfile>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/brand_voice_info/profile`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setBrandProfile(response.data);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error ||
              "An error occurred while fetching the profile."
          );
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProfile();
  }, [status, session, router]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <Loader2 className="h-16 w-16 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-red-500 to-yellow-500">
        <Alert variant="destructive" className="w-96">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!brandProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-teal-500">
        <Alert className="w-96">
          <AlertTitle>No Profile Found</AlertTitle>
          <AlertDescription>
            No Brand Profile data is available.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const {
    company,
    industries,
    location,
    contentTypes,
    brandPersonalities,
    targetAudience,
    brandTone,
    brandType,
    socialMedia,
    otherUrls,
    manualInputText,
    designText,
    brandVoice,
  } = brandProfile;

  const getBrandTypeDescription = (type: string) => {
    switch (type) {
      case "1":
        return "Big Corporation";
      case "2":
        return "Startup or SMB";
      case "3":
        return "Independent Creator";
      case "4":
        return "Dropshipper";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 text-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <header className="text-center bg-white rounded-lg shadow-lg p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 z-0" />
          <div className="relative z-10">
            <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-white shadow-lg">
              <AvatarImage src="/placeholder.svg" alt={company} />
              <AvatarFallback>
                <Building className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-4xl font-bold mb-2 text-purple-800">
              {company}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {manualInputText || "No description available."}
            </p>
            <div className="flex justify-center space-x-4">
              {socialMedia.instagram && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={`https://www.instagram.com/${socialMedia.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-600 transition-colors"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Instagram</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {socialMedia.twitter && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={`https://www.twitter.com/${socialMedia.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-500 transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {socialMedia.linkedin && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-800 transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Connect on LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </header>

        {/* Brand Voice and Details */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="voice">Brand Voice</TabsTrigger>
            <TabsTrigger value="details">Brand Details</TabsTrigger>
            <TabsTrigger value="audience">Target Audience</TabsTrigger>
            <TabsTrigger value="content">Content & Design</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="voice">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-purple-700">
                      <Volume2 className="mr-2" />
                      Brand Voice: {brandVoice.voiceName || "N/A"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-1">Brand Tone:</h3>
                      <Badge
                        variant="secondary"
                        className="bg-pink-100 text-pink-800"
                      >
                        {brandTone}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-purple-700">
                      <Briefcase className="mr-2" />
                      Brand Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-1">Location:</h3>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="mr-2 text-red-500" /> {location}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Brand Type:</h3>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {getBrandTypeDescription(brandType)}
                      </Badge>
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1 flex items-center cursor-pointer"
                        onClick={() => toggleSection("industries")}
                      >
                        Industries
                        {expandedSections.includes("industries") ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </h3>
                      {expandedSections.includes("industries") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-wrap gap-2 mt-2"
                        >
                          {industries.map((industry, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-green-100 text-green-800"
                            >
                              {industry}
                            </Badge>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1 flex items-center cursor-pointer"
                        onClick={() => toggleSection("personalities")}
                      >
                        Brand Personalities
                        {expandedSections.includes("personalities") ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </h3>
                      {expandedSections.includes("personalities") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-wrap gap-2 mt-2"
                        >
                          {brandPersonalities.map((personality, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800"
                            >
                              {personality}
                            </Badge>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="audience">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-purple-700">
                      <Target className="mr-2" />
                      Target Audience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3
                        className="font-semibold mb-1 flex items-center cursor-pointer"
                        onClick={() => toggleSection("audience")}
                      >
                        Audience Segments
                        {expandedSections.includes("audience") ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </h3>
                      {expandedSections.includes("audience") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-wrap gap-2 mt-2"
                        >
                          {targetAudience.map((audience, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-purple-100 text-purple-800"
                            >
                              {audience}
                            </Badge>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Social Media Presence:
                      </h3>
                      <div className="space-y-2">
                        {socialMedia.instagram && (
                          <div className="flex items-center">
                            <Instagram className="h-5 w-5 mr-2 text-pink-500" />
                            <Link
                              href={`https://www.instagram.com/${socialMedia.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              @{socialMedia.instagram}
                            </Link>
                          </div>
                        )}
                        {socialMedia.twitter && (
                          <div className="flex items-center">
                            <Twitter className="h-5 w-5 mr-2 text-blue-400" />
                            <Link
                              href={`https://www.twitter.com/${socialMedia.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              @{socialMedia.twitter}
                            </Link>
                          </div>
                        )}
                        {socialMedia.linkedin && (
                          <div className="flex items-center">
                            <Linkedin className="h-5 w-5 mr-2 text-blue-700" />
                            <Link
                              href={socialMedia.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              LinkedIn Profile
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-purple-700">
                      <FileText className="mr-2" />
                      Content & Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3
                        className="font-semibold mb-1 flex items-center cursor-pointer"
                        onClick={() => toggleSection("contentTypes")}
                      >
                        Content Types
                        {expandedSections.includes("contentTypes") ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </h3>
                      {expandedSections.includes("contentTypes") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-wrap gap-2 mt-2"
                        >
                          {contentTypes.map((contentType, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-indigo-100 text-indigo-800"
                            >
                              {contentType}
                            </Badge>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1 flex items-center cursor-pointer"
                        onClick={() => toggleSection("designText")}
                      >
                        Design Text
                        {expandedSections.includes("designText") ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </h3>
                      {expandedSections.includes("designText") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-600 whitespace-pre-line mt-2">
                            {designText}
                          </p>
                        </motion.div>
                      )}
                    </div>
                    {otherUrls && otherUrls.length > 0 && (
                      <div>
                        <h3
                          className="font-semibold mb-1 flex items-center cursor-pointer"
                          onClick={() => toggleSection("otherUrls")}
                        >
                          Other URLs
                          {expandedSections.includes("otherUrls") ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-2 h-4 w-4" />
                          )}
                        </h3>
                        {expandedSections.includes("otherUrls") && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-wrap gap-2 mt-2"
                          >
                            {otherUrls.map((url, index) => (
                              <Link
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {url}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
}
