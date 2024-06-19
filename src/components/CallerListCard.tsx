import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card"; // Adjust the import path as needed
  
  interface CallerListCardProps {
    name: string;
    condition: string;
    address: string;
    callTime: string;
    opsCentre: string;
    isLiveCall: boolean;
  }
  
  export default function CallerListCard({
    name,
    condition,
    address,
    callTime,
    opsCentre,
    isLiveCall,
  }: CallerListCardProps) {
    return (
      <Card className="h-full flex flex-row">
        <CardHeader className="bg-white p-2 flex flex-col w-full">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-left text-xl">{name}</CardTitle>
            <p className="text-red-600">{condition}</p>
          </div>
          <CardDescription className="flex justify-between items-center text-lg w-full mt-2">
            <div className="flex items-center space-x-2">
              {isLiveCall && <span className="red-dot"></span>}
              <span className="text-sm text-gray-500">{callTime}</span>
              <span className="text-sm text-gray-500 ml-2">{opsCentre}</span>
            </div>
            <div className="flex items-center">
              <span>{address}</span>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }