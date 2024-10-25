"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Building2,
  PersonStanding,
  Zap,
  Shield,
  Globe,
  PenTool,
  Users,
  ShoppingBag,
  Briefcase,
  Lock,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";

interface AccountType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface Feature {
  icon: LucideIcon;
  text: string;
}

export default function AccountSelectionJourney() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const features: Record<string, Feature[]> = {
    big_brands: [
      // Big Brands
      { icon: Building2, text: "Efficient team collaboration tools" },
      { icon: Shield, text: "Enterprise-grade security and privacy" },
      { icon: Zap, text: "Full API access and integration support" },
      { icon: Lock, text: "Customizable permissions and roles" },
      { icon: Globe, text: "Comprehensive data and analytics" },
    ],
    startup_smb: [
      // Startup or SMB
      { icon: Briefcase, text: "Tailored industry-specific solutions" },
      { icon: Zap, text: "Scalable infrastructure for growth" },
      { icon: Globe, text: "Localized market insights" },
      { icon: Shield, text: "Regulatory compliance assistance" },
      { icon: Users, text: "Innovative team collaboration" },
    ],
    individual_creators: [
      // Individual Creators
      { icon: PenTool, text: "Create and monetize unique digital assets" },
      { icon: Globe, text: "Expand your personal brand globally" },
      { icon: Zap, text: "Seamless onboarding and setup" },
      { icon: ShoppingBag, text: "Diverse and flexible payment solutions" },
      { icon: Users, text: "Dedicated round-the-clock support" },
    ],
    ecommerce_sellers: [
      // E-commerce Sellers
      { icon: ShoppingBag, text: "Access to product sourcing platforms" },
      { icon: Globe, text: "Global supplier networks at your fingertips" },
      { icon: Zap, text: "Automated order processing" },
      { icon: Lock, text: "Sales and performance tracking" },
      { icon: Briefcase, text: "Omni-channel payment support" },
    ],
  };

  const accountTypes: AccountType[] = [
    {
      id: "big_brands",
      title: "Big Brands",
      description: "Optimized for established large brands",
      icon: Building2,
    },
    {
      id: "startup_smb",
      title: "Startup or SMB",
      description:
        "Perfect for scaling startups and small to medium businesses",
      icon: Briefcase,
    },
    {
      id: "individual_creators",
      title: "Individual Creators",
      description:
        "Ideal for independent creators, freelancers, and influencers",
      icon: PersonStanding,
    },
    {
      id: "ecommerce_sellers",
      title: "E-commerce Sellers",
      description: "Optimized for online sellers and dropshipping businesses",
      icon: ShoppingBag,
    },
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;
    setIsModalOpen(false);
    // Pass the selected account type via URL parameter
    router.push(
      `/brandvoice?accountType=${encodeURIComponent(selectedOption)}`
    );
  };

  const FeatureCard = ({ type }: { type: string }) => {
    const isSelected = selectedOption === type;
    const accountType = accountTypes.find((at) => at.id === type);
    if (!accountType) return null;

    const Icon = accountType.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card
          className={`relative overflow-hidden transition-all duration-500 h-full ${
            isSelected
              ? "border-primary shadow-2xl scale-105"
              : "border-muted hover:border-primary/50 hover:scale-102"
          } cursor-pointer group`}
          onClick={() => handleOptionSelect(type)}
        >
          <div
            className={`absolute inset-0 bg-primary/5 transition-opacity duration-500 ${
              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }`}
          />
          <CardContent className="p-6 space-y-4 flex flex-col h-full">
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-full ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                } transition-colors duration-300`}
              >
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{accountType.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {accountType.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 flex-grow">
              {features[type].map((feature, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 transition-all duration-300">
                        <feature.icon
                          className={`h-5 w-5 text-muted-foreground`}
                        />
                        <span className="text-muted-foreground">
                          {feature.text}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Learn more about {feature.text}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isSelected ? 1 : 0,
                scale: isSelected ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
            >
              {isSelected && <CheckCircle className="h-6 w-6 text-primary" />}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Start Your Journey with Us
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose the account type that aligns with your goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accountTypes.map((type) => (
            <FeatureCard key={type.id} type={type.id} />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedOption}
            className="w-full max-w-md h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
          >
            Continue with{" "}
            {selectedOption
              ? accountTypes.find((at) => at.id === selectedOption)?.title
              : ""}{" "}
            Account
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-background sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              Confirm Your Selection
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 py-4">
            {selectedOption && (
              <div className={`p-3 rounded-full bg-primary/10 inline-block`}>
                {(() => {
                  const IconComponent = accountTypes.find(
                    (at) => at.id === selectedOption
                  )?.icon;
                  return IconComponent ? (
                    <IconComponent className="h-8 w-8 text-primary" />
                  ) : null;
                })()}
              </div>
            )}
            <p className="text-lg">
              You&apos;re about to create a
              <span className="font-semibold text-primary">
                {" "}
                {selectedOption
                  ? accountTypes.find((at) => at.id === selectedOption)?.title
                  : ""}{" "}
              </span>
              account
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
