'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, PenTool, ArrowRight, Sparkles, Clock } from 'lucide-react';

export default function Dashboard() {
  const [selectedOption, setSelectedOption] = useState<'trending' | 'custom' | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const characterLimit = 500;

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/trending');
        if (!response.ok) throw new Error('Failed to fetch trending topics');
        const data = await response.json();
        setTrendingTopics(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Unable to load trending topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  const handleOptionSelect = (option: 'trending' | 'custom') => {
    setSelectedOption(option);
  };

  const handleCustomContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.length <= characterLimit) {
      setCustomContent(content);
      setCharacterCount(content.length);
    }
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        setSelectedOption(null);
        setCustomTopic('');
        setCustomContent('');
        setCharacterCount(0);
      }, 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading trending topics...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-gray-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <Card className="max-w-5xl mx-auto border border-gray-200 shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
            <span className="flex items-center justify-center">
              <Sparkles className="h-6 w-6 mr-2 text-gray-600" />
              Content Dashboard
            </span>
          </CardTitle>
          <CardDescription className="text-gray-500">
            Create your next post
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Trending Topics Card */}
            <div 
              onClick={() => handleOptionSelect('trending')}
              className={`group cursor-pointer ${
                selectedOption === 'trending' ? 'ring-2 ring-gray-900' : ''
              }`}
            >
              <Card className="h-full border border-gray-200 transition-all duration-200 hover:border-gray-400">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-gray-900">
                    <TrendingUp className="mr-2 h-5 w-5 text-gray-600" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 p-4">
                    {trendingTopics.map((topic, index) => (
                      <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md group-hover:bg-gray-100 transition-colors">
                        <h3 className="text-sm font-medium text-gray-900">{topic}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          Recent
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Custom Topic Card */}
            <div 
              onClick={() => handleOptionSelect('custom')}
              className={`group cursor-pointer ${
                selectedOption === 'custom' ? 'ring-2 ring-gray-900' : ''
              }`}
            >
              <Card className="h-full border border-gray-200 transition-all duration-200 hover:border-gray-400">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-gray-900">
                    <PenTool className="mr-2 h-5 w-5 text-gray-600" />
                    Custom Topic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                        Topic
                      </label>
                      <Input
                        id="topic"
                        placeholder="Enter your topic"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        disabled={selectedOption !== 'custom'}
                        className="border border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <div className="relative">
                        <Textarea
                          id="content"
                          placeholder="Write your post..."
                          className="min-h-[200px] border border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                          value={customContent}
                          onChange={handleCustomContentChange}
                          disabled={selectedOption !== 'custom'}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                          {characterCount}/{characterLimit}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {showSuccessAlert && (
            <Alert className="border border-gray-200 bg-gray-50">
              <AlertDescription className="text-gray-700">
                Post created successfully
              </AlertDescription>
            </Alert>
          )}

          {selectedOption && (
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleSubmit}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md transition-colors"
              >
                Create Post
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}