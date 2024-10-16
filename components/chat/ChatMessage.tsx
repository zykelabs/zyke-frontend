import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Message = {
  id: number;
  sender: string;
  content: string;
}

type ChatMessageProps = {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start ${message.sender === 'User' ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="w-8 h-8">
          <AvatarFallback>{message.sender === 'User' ? 'U' : 'Z'}</AvatarFallback>
        </Avatar>
        <div className={`mx-2 p-2 rounded-lg ${message.sender === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          {message.content}
        </div>
      </div>
    </div>
  )
}