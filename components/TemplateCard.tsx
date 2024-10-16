import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'

interface TemplateCardProps {
  template: {
    name: string;
    image: string;
  };
  isSelected?: boolean;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onClick }) => {
  return (
    <Card 
      className={`bg-gray-800 hover:bg-gray-700 transition cursor-pointer border-gray-700 ${isSelected ? 'ring-2 ring-blue-500' : ''}`} 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <Image src={template.image} alt={template.name} width={200} height={200} className="w-full h-40 object-cover rounded-md mb-2" />
        <p className="text-sm font-medium text-gray-300">{template.name}</p>
      </CardContent>
    </Card>
  )
}

export default TemplateCard;
