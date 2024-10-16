import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Settings } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type ChatFilter = {
  tone: string;
  targetAudience: string;
  trends: string;
  platforms: string;
  numberOfPosts: number;
  lengthOfPost: string;
}

type FilterSheetProps = {
  filter: ChatFilter;
  setFilter: React.Dispatch<React.SetStateAction<ChatFilter>>;
}

export function FilterSheet({ filter, setFilter }: FilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chat Filters</SheetTitle>
          <SheetDescription>
            Adjust your chat settings here. Changes are saved automatically.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="tone">Tone for your brand</Label>
            <Select value={filter.tone} onValueChange={(value) => setFilter({...filter, tone: value})}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input 
              id="targetAudience" 
              value={filter.targetAudience} 
              onChange={(e) => setFilter({...filter, targetAudience: e.target.value})}
              placeholder="Enter target audience"
            />
          </div>
          <div>
            <Label htmlFor="trends">Trends</Label>
            <Input 
              id="trends" 
              value={filter.trends} 
              onChange={(e) => setFilter({...filter, trends: e.target.value})}
              placeholder="Enter trends"
            />
          </div>
          <div>
            <Label htmlFor="platforms">Platforms</Label>
            <Input 
              id="platforms" 
              value={filter.platforms} 
              onChange={(e) => setFilter({...filter, platforms: e.target.value})}
              placeholder="Enter platforms"
            />
          </div>
          <div>
            <Label htmlFor="numberOfPosts">Number of Posts</Label>
            <Slider 
              id="numberOfPosts"
              min={1} 
              max={5} 
              step={1} 
              value={[filter.numberOfPosts]}
              onValueChange={(value) => setFilter({...filter, numberOfPosts: value[0]})}
            />
            <div className="text-center">{filter.numberOfPosts}</div>
          </div>
          <div>
            <Label htmlFor="lengthOfPost">Length of Post</Label>
            <Select value={filter.lengthOfPost} onValueChange={(value) => setFilter({...filter, lengthOfPost: value})}>
              <SelectTrigger id="lengthOfPost">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}