"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

// Define the BrandVoice interface with only voiceName and summary
interface BrandVoice {
  voiceName: string;
  summary: string;
}

// Extend SocialMediaHandles to include website, email, and phone if they exist
interface SocialMediaHandles {
  instagram: string;
  twitter: string;
  linkedin: string;
  website?: string;
  email?: string;
  phone?: string;
}

// Define the complete BrandProfile interface
interface BrandProfile {
  company: string;
  industries: string[];
  location: string;
  contentTypes: string[];
  brandPersonalities: string[];
  targetAudience: string[];
  brandTone: string;
  brandType: string;
  socialMedia: SocialMediaHandles;
  otherUrls: string[];
  manualInputText: string;
  designText: string;
  brandVoice: BrandVoice;
}

export default function BrandProfile() {
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        const profileResponse = await axios.get<BrandProfile>(
          `${process.env.NEXT_PUBLIC_FLASK_API_URL}/brand_voice_info/profile`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setBrandProfile(profileResponse.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProfile();
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!brandProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert>
          <AlertTitle>No Profile Found</AlertTitle>
          <AlertDescription>
            No Brand Profile data is available.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="text-center bg-white rounded-lg shadow-sm p-8">
          <Avatar className="h-32 w-32 mx-auto mb-4">
            <AvatarImage src="/placeholder.svg" alt={brandProfile.company} />
            <AvatarFallback>
              <Building className="h-16 w-16" />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold mb-2">{brandProfile.company}</h1>
          <p className="text-xl text-gray-600 mb-4">
            {brandProfile.manualInputText || "No description available."}
          </p>
          <div className="flex justify-center space-x-4">
            {brandProfile.socialMedia.website && (
              <Button variant="outline" asChild>
                <a
                  href={brandProfile.socialMedia.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Globe className="h-5 w-5 mr-2" /> Website
                </a>
              </Button>
            )}
            {brandProfile.socialMedia.instagram && (
              <Button variant="outline" asChild>
                <a
                  href={`https://www.instagram.com/${brandProfile.socialMedia.instagram.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Instagram className="h-5 w-5 mr-2" /> Instagram
                </a>
              </Button>
            )}
            {brandProfile.socialMedia.twitter && (
              <Button variant="outline" asChild>
                <a
                  href={`https://www.twitter.com/${brandProfile.socialMedia.twitter.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Twitter className="h-5 w-5 mr-2" /> Twitter
                </a>
              </Button>
            )}
            {brandProfile.socialMedia.linkedin && (
              <Button variant="outline" asChild>
                <a
                  href={`https://www.linkedin.com/in/${brandProfile.socialMedia.linkedin.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Linkedin className="h-5 w-5 mr-2" /> LinkedIn
                </a>
              </Button>
            )}
          </div>
        </header>

        {/* Contact Information & Brand Voice */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {brandProfile.socialMedia.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-600" />
                  <span>{brandProfile.socialMedia.email}</span>
                </div>
              )}
              {brandProfile.socialMedia.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-600" />
                  <span>{brandProfile.socialMedia.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Brand Voice */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                Brand Voice: {brandProfile.brandVoice.voiceName || "N/A"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              {brandProfile.brandVoice.summary && (
                <div>
                  <h3 className="font-semibold mb-1">Summary:</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {brandProfile.brandVoice.summary}
                  </p>
                </div>
              )}
              {/* Voice Name */}
              <div>
                <h3 className="font-semibold mb-1">Voice Name:</h3>
                <p className="text-gray-600">
                  {brandProfile.brandVoice.voiceName || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Additional Brand Details */}
        <section className="space-y-8">
          {/* Industries */}
          {brandProfile.industries && brandProfile.industries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Industries</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {brandProfile.industries.map((industry, index) => (
                  <Badge key={index} variant="outline">
                    {industry}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Content Types */}
          {brandProfile.contentTypes &&
            brandProfile.contentTypes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Content Types</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {brandProfile.contentTypes.map((contentType, index) => (
                    <Badge key={index} variant="outline">
                      {contentType}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

          {/* Brand Personalities */}
          {brandProfile.brandPersonalities &&
            brandProfile.brandPersonalities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Brand Personalities
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {brandProfile.brandPersonalities.map((personality, index) => (
                    <Badge key={index} variant="outline">
                      {personality}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

          {/* Target Audience */}
          {brandProfile.targetAudience &&
            brandProfile.targetAudience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Target Audience</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {brandProfile.targetAudience.map((audience, index) => (
                    <Badge key={index} variant="outline">
                      {audience}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

          {/* Brand Tone */}
          {brandProfile.brandTone && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Brand Tone</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{brandProfile.brandTone}</Badge>
              </CardContent>
            </Card>
          )}

          {/* Brand Type */}
          {brandProfile.brandType && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Brand Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">
                  {brandProfile.brandType === "1" && "Big Corporation"}
                  {brandProfile.brandType === "2" && "Startup or SMB"}
                  {brandProfile.brandType === "3" && "Independent Creator"}
                  {brandProfile.brandType === "4" && "Dropshipper"}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Social Media Handles */}
          {brandProfile.socialMedia && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Social Media Handles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {brandProfile.socialMedia.instagram && (
                  <div className="flex items-center">
                    <Instagram className="h-5 w-5 mr-2 text-gray-600" />
                    <Link
                      href={`https://www.instagram.com/${brandProfile.socialMedia.instagram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      @{brandProfile.socialMedia.instagram}
                    </Link>
                  </div>
                )}
                {brandProfile.socialMedia.twitter && (
                  <div className="flex items-center">
                    <Twitter className="h-5 w-5 mr-2 text-gray-600" />
                    <Link
                      href={`https://www.twitter.com/${brandProfile.socialMedia.twitter.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      @{brandProfile.socialMedia.twitter}
                    </Link>
                  </div>
                )}
                {brandProfile.socialMedia.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="h-5 w-5 mr-2 text-gray-600" />
                    <Link
                      href={`https://www.linkedin.com/in/${brandProfile.socialMedia.linkedin.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {brandProfile.socialMedia.linkedin}
                    </Link>
                  </div>
                )}
                {brandProfile.socialMedia.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-gray-600" />
                    <Link
                      href={brandProfile.socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {brandProfile.socialMedia.website}
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Other URLs */}
          {brandProfile.otherUrls && brandProfile.otherUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Other URLs</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {brandProfile.otherUrls.map((url, index) => (
                  <Link
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {url}
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Design Text */}
          {brandProfile.designText && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Design Text</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-line">
                  {brandProfile.designText}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
