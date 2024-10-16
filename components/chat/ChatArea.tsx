import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'
import { ChatMessage } from './ChatMessage'

type Message = {
  id: number;
  sender: string;
  content: string;
}

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Zyke', content: 'Hello! I\'m Zyke. How can I assist you today?' }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'User', content: inputMessage }])
      setInputMessage('')
      // Here you would typically send the message to your backend and get a response
      // For this example, we'll just simulate a response from Zyke
      setTimeout(() => {
        setMessages(prev => [...prev, { id: prev.length + 1, sender: 'Zyke', content: 'I received your message. How else can I help?' }])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2 max-w-3xl mx-auto">
          <Input 
            value={inputMessage} 
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}