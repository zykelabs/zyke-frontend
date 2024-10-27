"use client";

import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";

// Define the Zod schema for form validation
const formSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  brandVoiceName: z.string().optional(),
  industries: z.array(z.string()).min(1, "At least one industry is required"),
  contentTypes: z
    .array(z.string())
    .min(1, "At least one content type is required"),
  brandPersonalities: z
    .array(z.string())
    .min(1, "At least one brand personality is required"),
  targetAudience: z
    .array(z.string())
    .min(1, "At least one target audience is required"),
  brandTone: z.number().min(0).max(100, "Brand tone must be between 0 and 100"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().min(1, "Location is required"),
  brandType: z.number().min(1, "Brand type is required"),
  socialMedia: z.object({
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  }),
  otherUrls: z.array(z.string()).optional(),
  manualInputText: z.string().optional(),
  designText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const contentTypeOptions = [
  "Blog Posts",
  "Social Media",
  "Product Descriptions",
  "Email Marketing",
  "Ad Copy",
];

const targetAudienceOptions = [
  "Millennials",
  "Gen Z",
  "Baby Boomers",
  "Entrepreneurs",
  "Parents",
  "Students",
  "Professionals",
];

const brandPersonalityOptions = [
  "Friendly",
  "Professional",
  "Bold",
  "Playful",
  "Innovative",
  "Traditional",
  "Luxurious",
  "Casual",
];

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

const brandTypeOptions = [
  { label: "Product-Based", value: 1 },
  { label: "Service-Based", value: 2 },
  { label: "Influencer", value: 3 },
  { label: "Non-Profit", value: 4 },
  // Add more as needed
];

export default function BrandVoiceCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      brandVoiceName: "",
      industries: [],
      contentTypes: [],
      brandPersonalities: [],
      targetAudience: [],
      brandTone: 50,
      website: "",
      location: "",
      brandType: undefined,
      socialMedia: {
        instagram: "",
        twitter: "",
        linkedin: "",
      },
      otherUrls: [""],
      manualInputText: "",
      designText: "",
    },
  });

  const {
    fields: otherUrlsFields,
    append: appendOtherUrl,
    remove: removeOtherUrl,
  } = useFieldArray({
    control,
    name: "otherUrls",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    setApiError(null);

    // Prepare the payload as per backend requirements
    const payload = {
      company: data.company,
      brandVoiceName: data.brandVoiceName,
      industries: data.industries,
      location: data.location,
      contentTypes: data.contentTypes,
      brandPersonalities: data.brandPersonalities,
      targetAudience: data.targetAudience,
      brandTone: data.brandTone,
      brandType: data.brandType,
      socialMedia: {
        instagram: data.socialMedia.instagram,
        twitter: data.socialMedia.twitter,
        linkedin: data.socialMedia.linkedin,
      },
      otherUrls: data.otherUrls.filter((url) => url.trim() !== ""),
      manualInputText: data.manualInputText,
      designText: data.designText,
    };

    try {
      const response = await fetch("/api/brand_voice/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include JWT token if required
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const result = await response.json();
      console.log(result);

      // Redirect or show success message
      router.push("/idea-generator");
    } catch (error: any) {
      console.error(error);
      setApiError(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: "Brand Personality", fields: ["brandPersonalities", "brandTone"] },
    { title: "Content Type", fields: ["contentTypes"] },
    { title: "Target Audience", fields: ["targetAudience"] },
    {
      title: "Brand Information",
      fields: ["company", "website", "location", "brandType"],
    },
    {
      title: "Industry & Social Media",
      fields: [
        "industries",
        "socialMedia",
        "otherUrls",
        "manualInputText",
        "designText",
      ],
    },
  ];

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Brand Voice Creator
        </CardTitle>
        <CardDescription>Define your unique brand personality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Brand Personality</h2>
              <div>
                <Label className="text-base">
                  Select personality traits that describe your brand:
                </Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {brandPersonalityOptions.map((trait) => (
                    <div key={trait} className="flex items-center space-x-2">
                      <Checkbox
                        id={trait}
                        {...register("brandPersonalities")}
                        value={trait}
                      />
                      <Label htmlFor={trait}>{trait}</Label>
                    </div>
                  ))}
                </div>
                {errors.brandPersonalities && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.brandPersonalities.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label htmlFor="brandTone" className="text-base">
                  Brand Tone
                </Label>
                <div className="flex items-center space-x-4 mt-2">
                  <span>Casual</span>
                  <Slider
                    id="brandTone"
                    {...register("brandTone", { valueAsNumber: true })}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-grow"
                  />
                  <span>Formal</span>
                </div>
                {errors.brandTone && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.brandTone.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Content Type</h2>
              <Label className="text-base">
                What type of content do you need help with? (Optional)
              </Label>
              <div className="grid grid-cols-1 gap-4 mt-2">
                {contentTypeOptions.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      {...register("contentTypes")}
                      value={type}
                    />
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </div>
              {errors.contentTypes && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>
                    {errors.contentTypes.message}
                  </AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="otherInfo">Other (Please specify)</Label>
                <Input
                  id="otherInfo"
                  {...register("manualInputText")}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Target Audience</h2>
              <Label className="text-base">
                Who is your target audience? (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {targetAudienceOptions.map((audience) => (
                  <div key={audience} className="flex items-center space-x-2">
                    <Checkbox
                      id={audience}
                      {...register("targetAudience")}
                      value={audience}
                    />
                    <Label htmlFor={audience}>{audience}</Label>
                  </div>
                ))}
              </div>
              {errors.targetAudience && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>
                    {errors.targetAudience.message}
                  </AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="otherAudience">Other (Please specify)</Label>
                <Input
                  id="otherAudience"
                  {...register("designText")}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Brand Information</h2>
              <div>
                <Label htmlFor="company">Brand/Business/Influencer Name</Label>
                <Input id="company" {...register("company")} className="mt-1" />
                {errors.company && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.company.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input id="website" {...register("website")} className="mt-1" />
                {errors.website && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.website.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  className="mt-1"
                />
                {errors.location && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.location.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label htmlFor="brandType">Brand Type</Label>
                <Select {...register("brandType", { valueAsNumber: true })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select brand type" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brandType && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.brandType.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">
                Industry & Social Media
              </h2>
              <div>
                <Label htmlFor="industry">Select your industry</Label>
                <Select {...register("industries")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industries && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {errors.industries.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label className="block mb-2">Social Media Handles</Label>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="instagram">Instagram Username</Label>
                    <Input
                      id="instagram"
                      placeholder="e.g., zomato"
                      {...register("socialMedia.instagram")}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter Username</Label>
                    <Input
                      id="twitter"
                      placeholder="e.g., EcoTechInnov"
                      {...register("socialMedia.twitter")}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://www.linkedin.com/company/your-company"
                      {...register("socialMedia.linkedin")}
                      className="mt-1"
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
              <div>
                <Label className="block mb-2">Other URLs</Label>
                {otherUrlsFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Input
                      {...register(`otherUrls.${index}` as const)}
                      placeholder="https://example.com"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeOtherUrl(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendOtherUrl("")}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add URL
                </Button>
              </div>
              <div>
                <Label htmlFor="manualInputText">Manual Input Text</Label>
                <Textarea
                  id="manualInputText"
                  {...register("manualInputText")}
                  className="mt-1"
                  placeholder="Leading the way in sustainable technology solutions."
                />
              </div>
              <div>
                <Label htmlFor="designText">Design Text</Label>
                <Textarea
                  id="designText"
                  {...register("designText")}
                  className="mt-1"
                  placeholder="Modern and clean design with a focus on green aesthetics."
                />
              </div>
              <div>
                <Label htmlFor="brandVoicePreview">Brand Voice Preview</Label>
                <Textarea
                  id="brandVoicePreview"
                  className="mt-1"
                  placeholder="Based on your inputs, your brand voice is... You're targeting in the industry. Your content will have a formal tone."
                  readOnly
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStep} disabled={currentStep === 1}>
          Previous
        </Button>
        <Button
          onClick={
            currentStep === steps.length ? handleSubmit(onSubmit) : nextStep
          }
          disabled={isSubmitting}
        >
          {currentStep === steps.length ? (
            isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Brand Voice...
              </>
            ) : (
              "Generate Brand Voice"
            )
          ) : (
            "Next"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
