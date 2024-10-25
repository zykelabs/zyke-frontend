// BrandVoice.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  PlusCircle,
  Trash2,
  Instagram,
  Twitter,
  Linkedin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the form schema using Zod
const formSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  brandVoiceName: z.string().min(1, "Brand Voice Name is required"),
  industries: z.array(z.string()).min(1, "At least one industry is required"),
  location: z.string().min(1, "Location is required"),
  contentTypes: z
    .array(z.string())
    .min(1, "At least one content type is required"),
  brandPersonalities: z
    .array(z.string())
    .min(1, "At least one brand personality is required"),
  targetAudience: z
    .array(z.string())
    .min(1, "At least one target audience is required"),
  brandTone: z.enum([
    "completely casual",
    "mostly casual",
    "slightly casual",
    "neutral",
    "slightly formal",
    "mostly formal",
    "completely formal",
  ]),
  brandType: z.enum(["1", "2", "3", "4"]),
  socialMedia: z.object({
    instagram: z
      .string()
      .regex(/^[a-zA-Z0-9._]{1,30}$/, "Invalid Instagram username"),
    twitter: z
      .string()
      .regex(/^[a-zA-Z0-9_]{1,15}$/, "Invalid Twitter username"),
    linkedin: z
      .string()
      .regex(/^[a-zA-Z0-9-]{1,100}$/, "Invalid LinkedIn username"),
  }),
  otherUrls: z.array(z.string().url("Invalid URL")).optional(),
  manualInputText: z.string().optional(),
  designText: z.string().optional(),
});

// Infer the form values type from the schema
type FormValues = z.infer<typeof formSchema>;

// Define options for select fields
const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Entertainment",
  "Retail",
  "Manufacturing",
  "Other",
];
const contentTypeOptions = [
  "Blog Posts",
  "Social Media",
  "Videos",
  "Podcasts",
  "Infographics",
  "Whitepapers",
  "Case Studies",
  "Other",
];
const brandPersonalityOptions = [
  "Sincere",
  "Exciting",
  "Competent",
  "Sophisticated",
  "Rugged",
  "Innovative",
  "Trustworthy",
  "Other",
];

export default function BrandVoiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const accountType = searchParams.get("accountType");

  // Mapping accountType to brandType
  const accountTypeToBrandTypeMap: Record<string, "1" | "2" | "3" | "4"> = {
    big_brands: "1",
    startup_smb: "2",
    individual_creators: "3",
    ecommerce_sellers: "4",
  };

  const mappedBrandType = accountType
    ? accountTypeToBrandTypeMap[accountType]
    : undefined;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industries: [""],
      contentTypes: [""],
      brandPersonalities: [""],
      targetAudience: [""],
      otherUrls: [""],
      brandType: mappedBrandType || "1", // Default to '1' if not mapped
    },
  });

  // Initialize field arrays for dynamic inputs
  const {
    fields: industryFields,
    append: appendIndustry,
    remove: removeIndustry,
  } = useFieldArray({
    control,
    name: "industries",
  });

  const {
    fields: contentTypeFields,
    append: appendContentType,
    remove: removeContentType,
  } = useFieldArray({
    control,
    name: "contentTypes",
  });

  const {
    fields: personalityFields,
    append: appendPersonality,
    remove: removePersonality,
  } = useFieldArray({
    control,
    name: "brandPersonalities",
  });

  const {
    fields: audienceFields,
    append: appendAudience,
    remove: removeAudience,
  } = useFieldArray({
    control,
    name: "targetAudience",
  });

  const {
    fields: urlFields,
    append: appendUrl,
    remove: removeUrl,
  } = useFieldArray({
    control,
    name: "otherUrls",
  });

  // Set the brandType based on accountType from URL parameters
  useEffect(() => {
    if (mappedBrandType) {
      setValue("brandType", mappedBrandType);
    }
  }, [mappedBrandType, setValue]);

  // Handle form submission
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsLoaderOpen(true);

    try {
      // Ensure the user is authenticated
      if (status !== "authenticated") {
        throw new Error("You must be logged in to perform this action.");
      }

      const token = session?.accessToken;

      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      // Transform social media usernames into URLs
      const transformedSocialMedia = {
        instagram: data.socialMedia.instagram
          ? `https://instagram.com/${data.socialMedia.instagram}`
          : "",
        twitter: data.socialMedia.twitter
          ? `https://twitter.com/${data.socialMedia.twitter}`
          : "",
        linkedin: data.socialMedia.linkedin
          ? `https://linkedin.com/in/${data.socialMedia.linkedin}`
          : "",
      };

      // Prepare the payload with transformed social media URLs
      const payload = {
        ...data,
        socialMedia: transformedSocialMedia,
      };

      // Submit the form data to the backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Something went wrong while submitting the form."
        );
      }

      setSubmitSuccess(true);
      reset(); // Reset the form after successful submission
      console.log("Brand Voice Summary:", result.summary);
      console.log("Generation Cost:", result.cost);

      // Navigate to /isea-generator after a short delay to allow users to see the success message
      setTimeout(() => {
        router.push("/isea-generator");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoaderOpen(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Brand Voice Generator
        </CardTitle>
        <CardDescription>
          Fill in the details to create your brand profile and generate its
          voice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Name and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" {...register("company")} className="mt-2" />
              {errors.company && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.company.message}</AlertDescription>
                </Alert>
              )}
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} className="mt-2" />
              {errors.location && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.location.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Brand Voice Name */}
          <div>
            <Label htmlFor="brandVoiceName">Brand Voice Name</Label>
            <Input
              id="brandVoiceName"
              {...register("brandVoiceName")}
              className="mt-2"
              placeholder="e.g., EcoFriendly Voice"
            />
            {errors.brandVoiceName && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  {errors.brandVoiceName.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Industries */}
          <div>
            <Label>Industries</Label>
            {industryFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <Select {...register(`industries.${index}` as const)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIndustry(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendIndustry("")}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Industry
            </Button>
            {errors.industries && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.industries.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Content Types */}
          <div>
            <Label>Content Types</Label>
            {contentTypeFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <Select {...register(`contentTypes.${index}` as const)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContentType(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendContentType("")}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Content Type
            </Button>
            {errors.contentTypes && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  {errors.contentTypes.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Brand Personalities */}
          <div>
            <Label>Brand Personalities</Label>
            {personalityFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <Select {...register(`brandPersonalities.${index}` as const)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand personality" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandPersonalityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePersonality(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPersonality("")}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Brand Personality
            </Button>
            {errors.brandPersonalities && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  {errors.brandPersonalities.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Target Audience */}
          <div>
            <Label>Target Audience</Label>
            {audienceFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <Input
                  {...register(`targetAudience.${index}` as const)}
                  placeholder="e.g., Young professionals"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAudience(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendAudience("")}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Target Audience
            </Button>
            {errors.targetAudience && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  {errors.targetAudience.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Brand Tone */}
          <div>
            <Label htmlFor="brandTone">Brand Tone</Label>
            <Select {...register("brandTone")}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select brand tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completely casual">
                  Completely Casual
                </SelectItem>
                <SelectItem value="mostly casual">Mostly Casual</SelectItem>
                <SelectItem value="slightly casual">Slightly Casual</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="slightly formal">Slightly Formal</SelectItem>
                <SelectItem value="mostly formal">Mostly Formal</SelectItem>
                <SelectItem value="completely formal">
                  Completely Formal
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.brandTone && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.brandTone.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Hidden Brand Type */}
          <input type="hidden" {...register("brandType")} />

          {/* Social Media Handles */}
          <div>
            <Label>Social Media Handles</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <Label
                  htmlFor="instagram"
                  className="flex items-center space-x-2"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </Label>
                <Input
                  id="instagram"
                  {...register("socialMedia.instagram")}
                  placeholder="username"
                  className="mt-2"
                />
                {errors.socialMedia?.instagram && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.socialMedia.instagram.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label
                  htmlFor="twitter"
                  className="flex items-center space-x-2"
                >
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </Label>
                <Input
                  id="twitter"
                  {...register("socialMedia.twitter")}
                  placeholder="username"
                  className="mt-2"
                />
                {errors.socialMedia?.twitter && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.socialMedia.twitter.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label
                  htmlFor="linkedin"
                  className="flex items-center space-x-2"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </Label>
                <Input
                  id="linkedin"
                  {...register("socialMedia.linkedin")}
                  placeholder="username"
                  className="mt-2"
                />
                {errors.socialMedia?.linkedin && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.socialMedia.linkedin.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {/* Other URLs */}
          <div>
            <Label>Other URLs</Label>
            {urlFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <Input
                  {...register(`otherUrls.${index}` as const)}
                  placeholder="https://example.com"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUrl(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendUrl("")}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add URL
            </Button>
            {errors.otherUrls && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.otherUrls.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Manual Input Text */}
          <div>
            <Label htmlFor="manualInputText">Manual Input Text</Label>
            <Textarea
              id="manualInputText"
              {...register("manualInputText")}
              rows={4}
              className="mt-2"
              placeholder="Enter additional information about your brand..."
            />
          </div>

          {/* Design Text */}
          <div>
            <Label htmlFor="designText">Design Text</Label>
            <Textarea
              id="designText"
              {...register("designText")}
              rows={4}
              className="mt-2"
              placeholder="Enter your design style information..."
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Brand Voice...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </CardFooter>

      {/* Success Alert */}
      {submitSuccess && (
        <Alert className="mt-4">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your brand information has been successfully submitted.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {submitError && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Loader Modal */}
      <Dialog open={isLoaderOpen} onOpenChange={setIsLoaderOpen}>
        <DialogContent className="bg-background flex flex-col items-center justify-center p-8">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <DialogTitle>Creating Your Brand Voice</DialogTitle>
          <p className="text-muted-foreground mt-2">
            Please wait while we generate your brand voice. This may take a few
            moments.
          </p>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
