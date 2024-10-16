import { FilterSheet } from './FilterSheet'

type ChatFilter = {
  tone: string;
  targetAudience: string;
  trends: string;
  platforms: string;
  numberOfPosts: number;
  lengthOfPost: string;
}

type FilterSidebarProps = {
  filter: ChatFilter;
  setFilter: React.Dispatch<React.SetStateAction<ChatFilter>>;
}

export function FilterSidebar({ filter, setFilter }: FilterSidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">Filters</h2>
        <FilterSheet filter={filter} setFilter={setFilter} />
      </div>
      <div className="p-4 space-y-4 overflow-auto">
        <div className="space-y-2">
          <span className="font-medium">Tone:</span>
          <span className="block">{filter.tone}</span>
        </div>
        <div className="space-y-2">
          <span className="font-medium">Target Audience:</span>
          <span className="block">{filter.targetAudience || 'Not set'}</span>
        </div>
        <div className="space-y-2">
          <span className="font-medium">Trends:</span>
          <span className="block">{filter.trends || 'Not set'}</span>
        </div>
        <div className="space-y-2">
          <span className="font-medium">Platforms:</span>
          <span className="block">{filter.platforms || 'Not set'}</span>
        </div>
        <div className="space-y-2">
          <span className="font-medium">Number of Posts:</span>
          <span className="block">{filter.numberOfPosts}</span>
        </div>
        <div className="space-y-2">
          <span className="font-medium">Length of Post:</span>
          <span className="block">{filter.lengthOfPost}</span>
        </div>
      </div>
    </div>
  )
}