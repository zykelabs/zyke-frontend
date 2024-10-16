import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

const brandVoices = [
  {
    name: "Professor X",
    tags: ["Conversational", "Inspiring", "Logical", "Positive"],
    created: "Dec 23, 2023",
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Sally's Sweets",
    tags: ["Engaging", "Appreciative", "Expert"],
    created: "Dec 23, 2023",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Shopify Shop: Care",
    tags: ["Professional", "Casual", "Insightful"],
    created: "Dec 23, 2023",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Willy Wonka",
    tags: ["Enthusiastic", "Humorous", "Caring", "Witty"],
    created: "Dec 23, 2023",
    color: "bg-red-100 text-red-600",
  },
  {
    name: "Tech Product Reviews",
    tags: ["Persuasive", "Matter-of-fact", "Reassuring", "Analytical"],
    created: "Dec 23, 2023",
    color: "bg-green-100 text-green-600",
  },
];

export default function BrandVoices() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Your Brand Voices</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {brandVoices.map((voice, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <CardTitle className="text-xl">{voice.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {voice.tags.map((tag, idx) => (
                  <Badge key={idx} className={`${voice.color} px-2 py-1 rounded-full`}>
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span>Created {voice.created} • Default Voice</span>
              </div>
            </CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="absolute top-4 right-4 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit Voice</DropdownMenuItem>
                <DropdownMenuItem>Duplicate Voice</DropdownMenuItem>
                <DropdownMenuItem>Delete Voice</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>
        ))}
      </div>
    </div>
  );
}
