import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust the import path as needed
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust the import path as needed
import { PhoneOutgoing, User, Home } from 'lucide-react';

const messages = [
  { sender: "EMS", text: "Emergency Medical Services, what is your emergency?" },
  { sender: "Caller", text: "Hi, I need help immediately! My dad just collapsed, and he's not responding!" },
  { sender: "EMS", text: "Okay, stay calm. Can you tell me your location?" },
  { sender: "Caller", text: "We're at 530495 Sengkang Avenue 10. Faster come!" },
  { sender: "EMS", text: "Thank you. Help is on the way. Is your dad breathing?" },
  { sender: "Caller", text: "No, he's not breathing, and I can't feel a pulse!" },
  { sender: "Caller", text: "No, he's not breathing, and I can't feel a pulse!" },
  { sender: "Caller", text: "No, he's not breathing, and I can't feel a pulse!" },
];

export default function CallerCard() {
  return (
    <Card className="h-full grid grid-row-4 justify-between">
      <CardHeader className="bg-white row-span-1 p-4 flex-row">
          <div>
            <CardTitle className="text-left text-2xl">Soo Jun Neng</CardTitle>
            <CardDescription className="flex items-center text-lg">
              <span className="text-red-600">Cardiac Arrest</span>
              <Home className="h-5 w-5 text-blue-500 ml-2" />
              <span>530495 Sengkang Avenue 10</span>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">00:15</div>
            <div className="flex items-center mt-2">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <PhoneOutgoing className="h-5 w-5 text-yellow-500" />
              <span className="ml-1">1777</span>
            </div>
          </div>
      </CardHeader>
      <CardContent className="p-4 row-span-2">
        <ScrollArea className="w-full overflow-y-auto rounded-md border">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="flex">
                <div className="bg-gray-200 p-2 mx-2 rounded-lg w-full">
                  <strong>{message.sender}:</strong> {message.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="bg-white p-4">
        <p className="text-gray-500">
          "dad just collapse", "530495 Sengkang Avenue 10", "he’s not breathing", "can’t feel a pulse"
        </p>
      </CardFooter>
    </Card>
  );
}
