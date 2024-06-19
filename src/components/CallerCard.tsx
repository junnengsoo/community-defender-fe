// src/components/CallerCard.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust the import path as needed
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust the import path as needed
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import { PhoneOutgoing, User, Home, PhoneMissed } from "lucide-react";

interface Message {
  sender: string;
  text: string;
}

interface CallerCardProps {
  name: string;
  condition: string;
  address: string;
  callTime: string;
  opsCentre: string;
  messages: Message[];
  additionalInfo: string;
}

export default function CallerCard({
  name,
  condition,
  address,
  callTime,
  opsCentre,
  messages,
  additionalInfo,
}: CallerCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-white p-2 flex flex-row">
        <div className="grow">
          <CardTitle className="text-left text-2xl">{name}</CardTitle>
          <CardDescription className="flex items-center text-lg">
            <span className="text-red-600">{condition}</span>
            <Home className="h-5 w-5 text-blue-500 ml-2" />
            <span>{address}</span>
          </CardDescription>
        </div>
        <div className="text-right flex-none">
          <div className="flex">
            <span className="text-sm text-gray-500">{callTime}</span>
            <PhoneMissed className="text-red-500" />
          </div>
          <div className="flex">
            <Button
              variant="outline"
              className="px-1 py-0 bg-yellow-500 text-white"
            >
              <PhoneOutgoing className="h-5 w-5" />
              <span className="ml-1">{opsCentre}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 h-1/2 flex flex-col">
        <ScrollArea className="w-full rounded-md border">
          <div className="my-2">
            {messages.map((message, index) => (
              <div key={index} className="flex py-1">
                <div className="bg-gray-200 text-sm p-2 mx-2 rounded-lg w-full">
                  <strong>{message.sender}:</strong> {message.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="bg-white h-1/4 grow flex flex-col p-2">
        <ScrollArea className="w-full rounded-md border">
          <p className="text-gray-500">{additionalInfo}</p>
        </ScrollArea>
      </CardFooter>
    </Card>
  );
}
