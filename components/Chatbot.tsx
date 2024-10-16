"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Send,
  Loader2,
  Plus,
  Settings,
  MessageSquare,
  Bot,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "image";
  imageUrls?: string[];
  timestamp: string;
};

type Thread = {
  id: string;
  name: string;
  messages: Message[];
};

export default function EnhancedAIChatbot() {
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "1",
      name: "New Chat",
      messages: [
        {
          role: "assistant",
          content: "Hi! I'm your Zyke AI assistant. How can I help you today?",
          type: "text",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ]);
  const [activeThreadId, setActiveThreadId] = useState("1");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    tone: "friendly",
    target: "all people",
    trends: "any relevant trends",
    platform: "instagram",
    numPosts: 1,
    postSize: "medium",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [threads, activeThreadId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  

  const getUseCase = () => {
    switch (currentStep) {
      case 0:
        return "question-gen";
      case 1:
        return "prompt-gen";
      case 2:
        return "post-gen";
      case 3:
        return "img-prompt-gen";
      default:
        return "img-gen";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const newMessage: Message = {
      role: "user",
      content: input,
      type: "text",
      timestamp: new Date().toISOString(),
    };

    updateActiveThread((prevThread) => ({
      ...prevThread,
      messages: [...prevThread.messages, newMessage],
    }));
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:5000/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
          conversation_id: conversationId,
          use: getUseCase(),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      let accumulatedContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        accumulatedContent += chunk;

        if (chunk.includes("CONVERSATION_ID:")) {
          const match = chunk.match(/CONVERSATION_ID: ([^\n]+)/);
          if (match) {
            setConversationId(match[1]);
          }
          accumulatedContent = accumulatedContent.replace(
            /CONVERSATION_ID: [^\n]+/,
            ""
          );
        }

        updateActiveThread((prevThread) => {
          const newMessages = [...prevThread.messages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            lastMessage.content = accumulatedContent;
          } else {
            newMessages.push({
              role: "assistant",
              content: accumulatedContent,
              type: "text",
              timestamp: new Date().toISOString(),
            });
          }
          return { ...prevThread, messages: newMessages };
        });
      }

      if (getUseCase() === "img-gen") {
        const imageResponse = await fetch("http://127.0.0.1:5000/gpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: JSON.parse(accumulatedContent),
            conversation_id: conversationId,
            use: "img-gen",
          }),
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to generate images");
        }

        const imageData = await imageResponse.json();
        updateActiveThread((prevThread) => ({
          ...prevThread,
          messages: [
            ...prevThread.messages,
            {
              role: "assistant",
              content: "Here are the generated images:",
              type: "image",
              imageUrls: imageData.images.map(
                (img: { image: string }) =>
                  `data:image/jpeg;base64,${img.image}`
              ),
              timestamp: new Date().toISOString(),
            },
          ],
        }));
      }

      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error:", error);
      updateActiveThread((prevThread) => ({
        ...prevThread,
        messages: [
          ...prevThread.messages,
          {
            role: "assistant",
            content: "An error occurred. Please try again.",
            type: "text",
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === "user";
    const messageTime = new Date(message.timestamp);
    const formattedTime = messageTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`flex ${
            isUser ? "flex-row-reverse" : "flex-row"
          } max-w-[80%] gap-3`}
        >
          <Avatar className={`${isUser ? "ml-2" : "mr-2"} mt-1`}>
            <AvatarFallback>
              {isUser ? (
                <User className="h-5 w-5" />
              ) : (
                <Bot className="h-5 w-5" />
              )}
            </AvatarFallback>
          </Avatar>
          <div
            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-4 rounded-lg ${
                isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.type === "text" ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {message.imageUrls?.map((url, imgIndex) => (
                    <Image
                      key={imgIndex}
                      src={url}
                      alt={`Generated image ${imgIndex + 1}`}
                      width={300}
                      height={300}
                      className="w-full rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 mt-1">{formattedTime}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const updateActiveThread = (updater: (prevThread: Thread) => Thread) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === activeThreadId ? updater(thread) : thread
      )
    );
  };

  const createNewThread = () => {
    const newThread: Thread = {
      id: Date.now().toString(),
      name: "New Chat",
      messages: [
        {
          role: "assistant",
          content: "Hi! I'm your Zyke AI assistant. How can I help you today?",
          type: "text",
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setThreads((prevThreads) => [...prevThreads, newThread]);
    setActiveThreadId(newThread.id);
    setCurrentStep(0);
    setConversationId(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-2xl font-bold text-white">
            Zyke
          </Link>
        </div>
        <Button onClick={createNewThread} className="mb-4">
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
        <ScrollArea className="flex-grow">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={`p-2 rounded cursor-pointer mb-2 ${
                thread.id === activeThreadId
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveThreadId(thread.id)}
            >
              <MessageSquare className="inline-block mr-2" />
              {thread.name}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Content Generator</h2>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Upgrade</Button>
            <Button variant="ghost">Help</Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Settings className="mr-2" /> Settings
                </Button>
              </SheetTrigger>
              <SheetContent>
                <h3 className="text-lg font-semibold mb-4">Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tone
                    </label>
                    <Input
                      value={settings.tone}
                      onChange={(e) =>
                        setSettings({ ...settings, tone: e.target.value })
                      }
                      placeholder="e.g., friendly, professional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Target Audience
                    </label>
                    <Input
                      value={settings.target}
                      onChange={(e) =>
                        setSettings({ ...settings, target: e.target.value })
                      }
                      placeholder="e.g., young adults, professionals"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Trends
                    </label>
                    <Input
                      value={settings.trends}
                      onChange={(e) =>
                        setSettings({ ...settings, trends: e.target.value })
                      }
                      placeholder="e.g., sustainability, tech innovations"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Platform
                    </label>
                    <Select
                      value={settings.platform}
                      onValueChange={(value) =>
                        setSettings({ ...settings, platform: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Number of Posts
                    </label>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[settings.numPosts]}
                      onValueChange={(value) =>
                        setSettings({ ...settings, numPosts: value[0] })
                      }
                    />
                    <span className="text-sm text-gray-500">
                      {settings.numPosts}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Post Size
                    </label>
                    <Select
                      value={settings.postSize}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          postSize: value as "short" | "medium" | "long",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select post size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>

        {/* Chat Area */}
        <ScrollArea className="flex-grow p-4">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence>
              {threads
                .find((thread) => thread.id === activeThreadId)
                ?.messages.map((message, index) =>
                  renderMessage(message, index)
                )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2"
            >
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
