import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust the import path as needed
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust the import path as needed
import { PhoneForwarded, Home, PhoneMissed } from "lucide-react";
import { Caller } from '@/components/CallerTypes';

interface CallerCardProps {
  caller: Caller
  onNameChange: (newName: string) => void;
  // onConditionChange: (newCondition: string) => void;
  onAddressChange: (newAddress: string) => void;
}

export default function CallerCard({
  caller,
  onNameChange,
  // onConditionChange,
  onAddressChange,
}: CallerCardProps) {
  
  // Define the onClick handlers
  const handleDropCallClick = () => {
    console.log('Call dropped');
    // Add your logic here
  };

  const handle1777Click = () => {
    console.log('Revert to 1777');
    // Add your logic here
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-white p-2 flex flex-row">
        <div className="grow">
          <CardTitle className="text-left text-2xl">
            <input
              className="border-none"
              type="text"
              value={caller.name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </CardTitle>
          <CardDescription className="flex items-center text-lg space-x-2">
            <span className="text-red-600">{caller.condition}</span>
            <Home className="h-5 w-5 text-blue-500 ml-2" />
            <input
              className="border-none px-2"
              type="text"
              value={caller.address}
              onChange={(e) => onAddressChange(e.target.value)}
            />
          </CardDescription>
        </div>
        <div className="text-right flex-none">
          <div className="flex items-center space-x-2">
            {caller.isLiveCall && <span className="red-dot"></span>}
            <span className="text-sm text-gray-500">{caller.callTime}</span>
            <PhoneMissed className="text-red-500 cursor-pointer" onClick={handleDropCallClick} />
            <PhoneForwarded className="text-orange-600 cursor-pointer" onClick={handle1777Click}/>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 h-1/2 flex flex-col">
        <ScrollArea className="w-full rounded-md border">
          <div className="my-2">
            {caller.messages.map((message, index) => (
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
          <p className="text-gray-500">{caller.extractedMessages}</p>
        </ScrollArea>
      </CardFooter>
    </Card>
  );
}
