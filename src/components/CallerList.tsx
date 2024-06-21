import { useState, useEffect } from "react";
import Header from "@/components/Header"; // Adjust the import path as needed
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust the import path as needed
import { Separator } from "@/components/ui/separator"; // Adjust the import path as needed
import CallerListCard from "@/components/CallerListCard"; // Adjust the import path as needed
import { Caller } from "@/api/api"; // Import the API function

interface CallerListProps {
    onCallerClick: (caller: Caller) => void;
    selectedCallers: (Caller | null)[];
  }

const dummyCallers = Array.from({ length: 50 }).map((_, i) => ({
  name: `Caller ${i + 1}`,
  condition: "test condition", // Change this to "Cardiac Arrest" or "Stroke" for testing
  address: `Address ${i + 1}`,
  callTime: `00:${String(i).padStart(2, "0")}`,
  opsCentre: i % 2 === 0 ? "Ops Centre 1" : "Ops Centre 2",
  isLiveCall: i % 2 === 0,
  messages: Array.from({ length: 3 }).map((_, j) => ({
    sender: j % 2 === 0 ? "You" : "Caller",
    text: `Message ${j + 1}`,
  })),
  extractedMessages: `Extracted messages for caller ${i + 1}`,
}));

export default function CallerList({ onCallerClick, selectedCallers }: CallerListProps) {
    const [callers, setCallers] = useState<Caller[]>([]);

  useEffect(() => {
    // Fetch callers from API
    // async function fetchCallers() {
    //   try {
    //     const data = await getCallers();
    //     setCallers(data);
    //   } catch (error) {
    //     console.error('Failed to fetch callers', error);
    //   }
    // }

    // fetchCallers();
    setCallers(dummyCallers);
    console.log(selectedCallers)
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <ScrollArea className="h-full w-full rounded-md border">
        <div className="p-4">
          {callers.map((caller) => (
            <div key={caller.name} onClick={() => onCallerClick(caller)}>
              <CallerListCard
                name={caller.name}
                condition={caller.condition}
                address={caller.address}
                callTime={caller.callTime}
                opsCentre={caller.opsCentre}
                isLiveCall={caller.isLiveCall}
                isSelected={selectedCallers.some(selected => selected?.name === caller.name)}
              />
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
