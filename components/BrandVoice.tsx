"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import {
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  PlusCircle,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { DevTool } from "@hookform/devtools"; // Import DevTools

// Zod Schemas
const socialMediaSchema = z
  .object({
    platform: z.string(),
    username: z.string().optional().or(z.literal("")),
    url: z.string().url().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.username && !data.url) {
        // Both fields are empty; no validation needed
        return true;
      }
      if (data.platform === "instagram" || data.platform === "facebook") {
        return data.username.trim() !== "" && data.url === "";
      }
      if (data.platform === "linkedin") {
        return data.url.trim() !== "" && data.username === "";
      }
      return false;
    },
    {
      message: "Invalid social media configuration",
    }
  );

// Main Form Schema
const formSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  brandVoiceName: z.string().min(1, "Brand voice name is required"),
  industries: z.array(z.string()).min(1, "At least one industry is required"),
  otherIndustries: z.array(z.string()).optional(),
  files: z.array(z.any()).optional(),
  website: z.string().url("Invalid URL format").or(z.literal("")).optional(),
  socialMedia: z.array(socialMediaSchema).optional(),
  otherUrls: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        url: z.string().url("Invalid URL format"),
      })
    )
    .optional(),
  contentTypes: z.array(z.string()).min(1, "At least one content type is required"),
  otherContentTypes: z.array(z.string()).optional(),
  targetAudience: z.array(z.string()).min(1, "At least one target audience is required"),
  otherTargetAudiences: z.array(z.string()).optional(),
  brandPersonalities: z.array(z.string()).min(1, "At least one personality trait is required"),
  brandTone: z.string().min(1, "Brand tone is required"),
  brandType: z.number().int().min(1, "Brand type is required"),
  manualInputText: z.string().optional(),
  designText: z.string().optional(),
});

// Options Arrays
const brandTypeOptions = [
  { label: "Product-Based", value: 1 },
  { label: "Service-Based", value: 2 },
  { label: "Influencer", value: 3 },
  { label: "Non-Profit", value: 4 },
];

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Entertainment",
  "Manufacturing",
  "Real Estate",
  "Travel",
  "Food & Beverage",
];

const contentTypeOptions = [
  "Blog Posts",
  "Social Media",
  "Website Copy",
  "Email Marketing",
  "Ad Copy",
  "Product Descriptions",
  "Video Scripts",
  "Podcast Scripts",
  "Press Releases",
  "Technical Documentation",
];

const targetAudienceOptions = [
  "Gen Z",
  "Millennials",
  "Gen X",
  "Baby Boomers",
  "Business Professionals",
  "Students",
  "Parents",
  "Tech Enthusiasts",
  "Luxury Consumers",
  "Budget Shoppers",
];

const personalityTraits = [
  "Professional",
  "Friendly",
  "Innovative",
  "Traditional",
  "Luxurious",
  "Playful",
  "Bold",
  "Conservative",
  "Casual",
  "Authoritative",
];

const brandToneOptions = [
  "Completely casual",
  "Mostly casual",
  "Slightly casual",
  "Neutral",
  "Slightly formal",
  "Mostly formal",
  "Completely formal",
];

export default function BrandVoiceCreator() {
  const params = useParams();
  const router = useRouter();
  const { brandType: brandTypeParam } = params;

  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    const checkBrandVoice = async () => {
      if (!session) {
        router.push("/login");
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/brand_voice_info/profile`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.brandVoice) {
            router.push("/idea-generator"); // Redirect if brand voice exists
          }
        }
      } catch (error) {
        console.error("Error checking brand voice:", error);
      }
    };

    checkBrandVoice();
  }, [session, status, router]);

  const selectedBrandType = React.useMemo(() => {
    const type = Number(brandTypeParam);
    const found = brandTypeOptions.find((option) => option.value === type);
    return found ? found.value : 1; // Default to 1 (Product-Based) if not found
  }, [brandTypeParam]);

  const [step, setStep] = React.useState(1);
  const [validatedSteps, setValidatedSteps] = React.useState<number[]>([]); // Track validated steps
  const [files, setFiles] = React.useState<File[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [submissionError, setSubmissionError] = React.useState<string | null>(null); // For error messages

  // Initialize the form with the standard Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      location: "",
      brandVoiceName: "",
      industries: [],
      otherIndustries: [],
      files: [],
      website: "",
      socialMedia: [
        { platform: "instagram", username: "", url: "" },
        { platform: "facebook", username: "", url: "" },
        { platform: "linkedin", username: "", url: "" },
      ],
      otherUrls: [],
      contentTypes: [],
      otherContentTypes: [],
      targetAudience: [],
      otherTargetAudiences: [],
      brandPersonalities: [],
      brandTone: "", // Ensure brandTone has a default value
      brandType: selectedBrandType,
      manualInputText: "",
      designText: "",
    },
    mode: "onSubmit", // Validate only on form submission
    reValidateMode: "onSubmit",
    shouldUnregister: false, // Retain all fields in form state
  });

  React.useEffect(() => {
    form.setValue("brandType", selectedBrandType);
  }, [selectedBrandType, form]);

  const {
    fields: urlFields,
    append: appendUrl,
    remove: removeUrl,
  } = useFieldArray({
    control: form.control,
    name: "otherUrls",
  });

  const {
    fields: otherIndustryFields,
    append: appendIndustry,
    remove: removeIndustry,
  } = useFieldArray({
    control: form.control,
    name: "otherIndustries",
  });

  const {
    fields: otherContentTypeFields,
    append: appendContentType,
    remove: removeContentType,
  } = useFieldArray({
    control: form.control,
    name: "otherContentTypes",
  });

  const {
    fields: otherTargetAudienceFields,
    append: appendTargetAudience,
    remove: removeTargetAudience,
  } = useFieldArray({
    control: form.control,
    name: "otherTargetAudiences",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => {
        const updatedFiles = [...prev, ...newFiles];
        form.setValue("files", updatedFiles);
        return updatedFiles;
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      form.setValue("files", updatedFiles);
      return updatedFiles;
    });
  };

  // Watch fields for debugging
  const industriesValue = form.watch("industries");
  const contentTypesValue = form.watch("contentTypes");

  React.useEffect(() => {
    console.log("Selected Industries:", industriesValue);
  }, [industriesValue]);

  React.useEffect(() => {
    console.log("Selected Content Types:", contentTypesValue);
  }, [contentTypesValue]);

  // Helper function to get fields based on the current step for validation
  const getFieldsByStep = (step: number) => {
    switch (step) {
      case 1:
        return [
          "company",
          "location",
          "brandVoiceName",
          "industries",
          "socialMedia",
          "otherUrls",
        ];
      case 2:
        return ["contentTypes"];
      case 3:
        return ["targetAudience"];
      case 4:
        return ["brandPersonalities", "brandTone"];
      default:
        return [];
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    console.log("Form submitted with data:", data); // Debugging log
    setIsGenerating(true);
    setSubmissionError(null); // Reset any previous errors

    // Safeguard: Ensure 'industries' is an array
    const allIndustries = [
      ...(Array.isArray(data.industries) ? data.industries : []),
      ...(Array.isArray(data.otherIndustries) ? data.otherIndustries : []).filter(
        (industry) => industry.trim() !== ""
      ),
    ];

    // Similarly, safeguard other array fields
    const allContentTypes = [
      ...(Array.isArray(data.contentTypes) ? data.contentTypes : []),
      ...(Array.isArray(data.otherContentTypes) ? data.otherContentTypes : []).filter(
        (type) => type.trim() !== ""
      ),
    ];

    const allTargetAudiences = [
      ...(Array.isArray(data.targetAudience) ? data.targetAudience : []),
      ...(Array.isArray(data.otherTargetAudiences) ? data.otherTargetAudiences : []).filter(
        (audience) => audience.trim() !== ""
      ),
    ];

    const payload = {
      company: data.company,
      location: data.location,
      brandVoiceName: data.brandVoiceName,
      industries: allIndustries,
      files: data.files,
      website: data.website,
      socialMedia: {
        instagram:
          Array.isArray(data.socialMedia)
            ? data.socialMedia.find((sm) => sm.platform === "instagram")?.username || ""
            : "",
        facebook:
          Array.isArray(data.socialMedia)
            ? data.socialMedia.find((sm) => sm.platform === "facebook")?.username || ""
            : "",
        linkedin:
          Array.isArray(data.socialMedia)
            ? data.socialMedia.find((sm) => sm.platform === "linkedin")?.url || ""
            : "",
      },
      otherUrls: data.otherUrls,
      contentTypes: allContentTypes,
      targetAudience: allTargetAudiences,
      brandPersonalities: data.brandPersonalities,
      brandTone: data.brandTone,
      brandType: data.brandType,
      manualInputText: data.manualInputText,
      designText: data.designText,
    };

    try {
      const formData = new FormData();
      for (const key in payload) {
        if (key === "files") {
          payload.files.forEach((file: File) => {
            formData.append("files", file);
          });
        } else if (key === "socialMedia") {
          formData.append("socialMedia", JSON.stringify(payload.socialMedia));
        } else if (Array.isArray(payload[key])) {
          formData.append(key, JSON.stringify(payload[key]));
        } else if (payload[key] !== undefined && payload[key] !== null) {
          formData.append(key, payload[key]);
        }
      }

      const accessToken = session?.accessToken;
      if (!accessToken) {
        console.error("No access token found.");
        setSubmissionError("Authentication error. Please log in again.");
        setIsGenerating(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/brand_voice_info/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      console.log("API response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create brand voice.");
      }

      const result = await response.json();
      // Redirect to the desired page after successful submission
      router.push("/idea-generator");
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmissionError(error.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Card className="w-full max-w-md text-center p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Creating Your Brand Voice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              Please wait, this may take a while...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Brand Voice Creator</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define your unique brand personality
          </p>
          <div className="mt-4">
            <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                {/* Step 1 Fields */}
                <div>
                  <Label htmlFor="company">Company/Brand Name</Label>
                  <Input
                    id="company"
                    {...form.register("company")}
                    className="mt-1"
                  />
                  {form.formState.errors.company && validatedSteps.includes(1) && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {form.formState.errors.company.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...form.register("location")}
                    className="mt-1"
                  />
                  {form.formState.errors.location && validatedSteps.includes(1) && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {form.formState.errors.location.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="brandVoiceName">Brand Voice Name</Label>
                  <Input
                    id="brandVoiceName"
                    {...form.register("brandVoiceName")}
                    className="mt-1"
                  />
                  {form.formState.errors.brandVoiceName && validatedSteps.includes(1) && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {form.formState.errors.brandVoiceName.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label>Industries</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {industryOptions.map((industry) => (
                      <Controller
                        key={industry}
                        control={form.control}
                        name="industries"
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={industry}
                              checked={field.value.includes(industry)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, industry]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (val: string) => val !== industry
                                    )
                                  );
                                }
                              }}
                              value={industry}
                            />
                            <Label htmlFor={industry}>{industry}</Label>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                  {form.formState.errors.industries && validatedSteps.includes(1) && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {form.formState.errors.industries.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  {otherIndustryFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <Input
                        {...form.register(`otherIndustries.${index}`)}
                        placeholder="Other industry"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
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
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Other Industry
                  </Button>
                </div>

                <div>
                  <Label>Upload Files</Label>
                  <div className="mt-2 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Files
                    </Button>
                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-md border p-2"
                          >
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    {...form.register("website")}
                    placeholder="https://example.com"
                    className="mt-1"
                  />
                  {form.formState.errors.website && validatedSteps.includes(1) && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {form.formState.errors.website.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Social Media</Label>
                  <div className="space-y-4">
                    {/* Instagram */}
                    <Controller
                      control={form.control}
                      name="socialMedia.0.username"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Instagram className="h-5 w-5 text-pink-500" />
                          <Input
                            placeholder="Instagram username"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              // Clear the URL field for Instagram/Facebook
                              form.setValue("socialMedia.0.url", "");
                            }}
                          />
                        </div>
                      )}
                    />
                    {/* Facebook */}
                    <Controller
                      control={form.control}
                      name="socialMedia.1.username"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Facebook className="h-5 w-5 text-blue-600" />
                          <Input
                            placeholder="Facebook username"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              // Clear the URL field for Instagram/Facebook
                              form.setValue("socialMedia.1.url", "");
                            }}
                          />
                        </div>
                      )}
                    />
                    {/* LinkedIn */}
                    <Controller
                      control={form.control}
                      name="socialMedia.2.url"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Linkedin className="h-5 w-5 text-blue-700" />
                          <Input
                            placeholder="LinkedIn URL"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              // Clear the Username field for LinkedIn
                              form.setValue("socialMedia.2.username", "");
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                  {form.formState.errors.socialMedia && validatedSteps.includes(1) && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {form.formState.errors.socialMedia.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label>Other URLs</Label>
                  <div className="space-y-2 mt-2">
                    {urlFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder="Label"
                          {...form.register(`otherUrls.${index}.label`)}
                        />
                        <Input
                          placeholder="URL"
                          {...form.register(`otherUrls.${index}.url`)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
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
                      onClick={() => appendUrl({ label: "", url: "" })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add URL
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {/* Step 2 Fields */}
                <h2 className="text-xl font-semibold">Content Type</h2>
                <div className="grid grid-cols-2 gap-4">
                  {contentTypeOptions.map((type) => (
                    <Controller
                      key={type}
                      control={form.control}
                      name="contentTypes"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={field.value.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, type]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (val: string) => val !== type
                                  )
                                );
                              }
                            }}
                            value={type}
                          />
                          <Label htmlFor={type}>{type}</Label>
                        </div>
                      )}
                    />
                  ))}
                </div>
                {form.formState.errors.contentTypes && validatedSteps.includes(2) && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {form.formState.errors.contentTypes.message}
                    </AlertDescription>
                  </Alert>
                )}
                {otherContentTypeFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center space-x-2 mt-2"
                  >
                    <Input
                      {...form.register(`otherContentTypes.${index}`)}
                      placeholder="Other content type"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
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
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Other Content Type
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {/* Step 3 Fields */}
                <h2 className="text-xl font-semibold">Target Audience</h2>
                <div className="grid grid-cols-2 gap-4">
                  {targetAudienceOptions.map((audience) => (
                    <Controller
                      key={audience}
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={audience}
                            checked={field.value.includes(audience)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, audience]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (val: string) => val !== audience
                                  )
                                );
                              }
                            }}
                            value={audience}
                          />
                          <Label htmlFor={audience}>{audience}</Label>
                        </div>
                      )}
                    />
                  ))}
                </div>
                {form.formState.errors.targetAudience && validatedSteps.includes(3) && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {form.formState.errors.targetAudience.message}
                    </AlertDescription>
                  </Alert>
                )}
                {otherTargetAudienceFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center space-x-2 mt-2"
                  >
                    <Input
                      {...form.register(`otherTargetAudiences.${index}`)}
                      placeholder="Other target audience"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTargetAudience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTargetAudience("")}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Other Target Audience
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                {/* Step 4 Fields */}
                <h2 className="text-xl font-semibold">Brand Personality</h2>
                <div className="grid grid-cols-2 gap-4">
                  {personalityTraits.map((trait) => (
                    <Controller
                      key={trait}
                      control={form.control}
                      name="brandPersonalities"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={trait}
                            checked={field.value.includes(trait)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, trait]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (val: string) => val !== trait
                                  )
                                );
                              }
                            }}
                            value={trait}
                          />
                          <Label htmlFor={trait}>{trait}</Label>
                        </div>
                      )}
                    />
                  ))}
                </div>
                {form.formState.errors.brandPersonalities && validatedSteps.includes(4) && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {form.formState.errors.brandPersonalities.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <Label>Brand Tone</Label>
                  <Controller
                    control={form.control}
                    name="brandTone"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) => {
                          console.log("Selected Brand Tone:", value); // Debugging
                          field.onChange(value);
                        }}
                        className="flex flex-col space-y-1"
                      >
                        {brandToneOptions.map((tone) => (
                          <div
                            key={tone}
                            className="flex items-center space-x-3"
                          >
                            <RadioGroupItem value={tone} id={tone} />
                            <Label htmlFor={tone}>{tone}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {form.formState.errors.brandTone && validatedSteps.includes(4) && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {form.formState.errors.brandTone.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manualInputText">Manual Input Text</Label>
                  <Textarea
                    id="manualInputText"
                    {...form.register("manualInputText")}
                    placeholder="Enter any additional information about your brand voice"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designText">Design Text</Label>
                  <Textarea
                    id="designText"
                    {...form.register("designText")}
                    placeholder="Describe the visual design elements of your brand"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {/* Display Submission Error if any */}
            {submissionError && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  {submissionError}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step > 1 ? step - 1 : step)}
                disabled={step === 1}
              >
                Previous
              </Button>
              {step === totalSteps ? (
                <Button type="submit" disabled={isGenerating || !session}>
                  Generate Brand Voice
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={async () => {
                    const currentStepFields = getFieldsByStep(step);
                    const isValid = await form.trigger(currentStepFields);
                    if (isValid) {
                      setValidatedSteps((prev) => [...prev, step]);
                      setStep(step + 1);
                    }
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Integrate DevTools for debugging */}
      <DevTool control={form.control} /> {/* Remove or conditionally render in production */}
    </div>
  );
}
