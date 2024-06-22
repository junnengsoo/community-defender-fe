import { useState, useEffect } from "react";
import Header from "@/components/Header"; // Adjust the import path as needed
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust the import path as needed
import { Separator } from "@/components/ui/separator"; // Adjust the import path as needed
import CallerListCard from "@/components/CallerListCard"; // Adjust the import path as needed
import { Caller } from "@/api/api"; // Import the API function

interface CallerListProps {
    onCallerClick: (caller: Caller) => void;
    selectedCallers: (Caller | null)[];
    callers: Caller[];
  }  

  export default function CallerList({ onCallerClick, selectedCallers, callers: initialCallers }: CallerListProps) {
    const [callers, setCallers] = useState<Caller[]>(initialCallers);

    useEffect(() => {
        setCallers((prevCallers) =>
            prevCallers.map((caller) => ({
                ...caller,
                isSelected: selectedCallers.some((selected) => selected?.name === caller.name),
            }))
        );
    }, [selectedCallers]);

    useEffect(() => {
        setCallers(initialCallers);
    }, [initialCallers]);

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