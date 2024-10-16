import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type ChatThread = {
  id: number;
  name: string;
  lastMessage: string;
}

type ChatSidebarProps = {
  chatThreads: ChatThread[];
}

export function ChatSidebar({ chatThreads }: ChatSidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Chat History</h2>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          {chatThreads.map((thread) => (
            <div key={thread.id} className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Avatar className="w-10 h-10">
                <AvatarFallback>{thread.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{thread.name}</p>
                <p className="text-sm text-gray-500 truncate">{thread.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}