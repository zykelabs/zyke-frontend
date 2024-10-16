"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building, Globe, Instagram, Twitter, Mail, Phone } from "lucide-react"

interface BrandVoice {
  name: string
  purpose: string
  audience: string
  tone: string[]
  emotion: string[]
  character: string[]
  syntax: string
}

interface BrandProfile {
  name: string
  description: string
  website: string
  instagramHandle: string
  twitterHandle: string
  email: string
  phone: string
  brandVoice: BrandVoice
}

const brandProfile: BrandProfile = {
  name: "Acme Corporation",
  description: "Leading provider of innovative solutions for businesses worldwide. We specialize in cutting-edge technology and unparalleled customer service.",
  website: "https://www.acmecorp.com",
  instagramHandle: "@acmecorp",
  twitterHandle: "@acmecorp",
  email: "contact@acmecorp.com",
  phone: "+1 (555) 123-4567",
  brandVoice: {
    name: "Professional Innovator",
    purpose: "To communicate our brand's commitment to innovation and quality solutions while establishing trust and expertise in the industry.",
    audience: "Business professionals, technology enthusiasts, and decision-makers in various industries seeking cutting-edge solutions.",
    tone: ["Professional", "Innovative", "Trustworthy", "Authoritative"],
    emotion: ["Confident", "Enthusiastic", "Empathetic"],
    character: ["Expert", "Visionary", "Problem-solver"],
    syntax: "Use clear, concise language with industry-specific terminology when appropriate. Balance technical expertise with accessibility to cater to a diverse audience."
  }
}

export default function BrandProfile() {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <Avatar className="h-32 w-32 mx-auto mb-4">
            <AvatarImage src="/placeholder.svg" alt={brandProfile.name} />
            <AvatarFallback><Building className="h-16 w-16" /></AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold mb-2">{brandProfile.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{brandProfile.description}</p>
          <div className="flex justify-center space-x-4">
            <a href={brandProfile.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
              <Globe className="inline h-5 w-5 mr-1" /> Website
            </a>
            <a href={`https://www.instagram.com/${brandProfile.instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
              <Instagram className="inline h-5 w-5 mr-1" /> Instagram
            </a>
            <a href={`https://www.twitter.com/${brandProfile.twitterHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
              <Twitter className="inline h-5 w-5 mr-1" /> Twitter
            </a>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-600" />
                <span>{brandProfile.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-600" />
                <span>{brandProfile.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl">Brand Voice: {brandProfile.brandVoice.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Purpose:</h3>
                <p className="text-gray-600">{brandProfile.brandVoice.purpose}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Target Audience:</h3>
                <p className="text-gray-600">{brandProfile.brandVoice.audience}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl">Brand Voice Characteristics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Tone:</h3>
              <div className="flex flex-wrap gap-2">
                {brandProfile.brandVoice.tone.map((tone, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">{tone}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Emotion:</h3>
              <div className="flex flex-wrap gap-2">
                {brandProfile.brandVoice.emotion.map((emotion, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">{emotion}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Character:</h3>
              <div className="flex flex-wrap gap-2">
                {brandProfile.brandVoice.character.map((character, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">{character}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Syntax:</h3>
              <p className="text-gray-600">{brandProfile.brandVoice.syntax}</p>
            </div>
          </CardContent>
        </Card>

        <section className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">About {brandProfile.name}</h2>
          <p className="text-gray-600 mb-4">
            At {brandProfile.name}, we are dedicated to pushing the boundaries of innovation and delivering exceptional solutions to businesses across the globe. Our commitment to excellence and customer satisfaction drives everything we do.
          </p>
          <p className="text-gray-600 mb-4">
            With a team of expert professionals and a forward-thinking approach, we tackle complex challenges and transform them into opportunities for growth and success. Our solutions are tailored to meet the unique needs of each client, ensuring maximum impact and value.
          </p>
          <p className="text-gray-600">
            Join us in shaping the future of business technology. Discover how {brandProfile.name} can elevate your operations and drive your success to new heights.
          </p>
        </section>
      </div>
    </div>
  )
}