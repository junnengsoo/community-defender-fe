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

const transcript = ["911, what's your emergency?","Hi, I need help! There's been a car accident on 324 Maple Street.",
  "Okay, I understand. Are you or anyone else injured?", 
  "Yes, there's a woman who looks seriously hurt. She's not responding.",
  "I'm dispatching emergency services to your location. Can you tell me if she's breathing?",
  "I'm not sure. I don't think she is.",
  "Alright, can you check her pulse or see if her chest is moving?",
  "Hold on... No, I don't see any movement. What should I do?",
  "Stay calm. Help is on the way. Do you know CPR?",
  "Yes, but it's been a while since I learned.",
  "That's okay. I can guide you through it. First, tilt her head back slightly to open her airway."]

const dummyCallers = Array.from({ length: 5 }).map((_, i) => ({
  name: `Caller ${i + 1}`,
  condition: 'Unknown', // Change this to "Cardiac Arrest" or "Stroke" for testing
  address: `Address ${i + 1}`,
  callTime: `00:${String(i).padStart(2, '0')}`,
  opsCentre: 'Ops Centre 1',
  isLiveCall: i % 2 === 0,
  messages: Array.from({ length: 10 }).map((_, j) => ({
    sender: j % 2 === 0 ? 'Operator' : 'Caller',
    text: transcript[j],
  })),
  extractedMessages: `Extracted messages for caller ${i + 1}`,
}));

const addSecondToCallTime = (callTime: string) => {
  const [minutes, seconds] = callTime.split(':').map(Number);
  const totalSeconds = minutes * 60 + seconds + 1;
  const newMinutes = Math.floor(totalSeconds / 60) % 60;
  const newSeconds = totalSeconds % 60;
  const newTime = `${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
  return newTime;
};

const updateCallTimes = (callers: Caller[]) => {
  return callers.map((caller) => ({
    ...caller,
    callTime: addSecondToCallTime(caller.callTime),
  }));
};

const updateNameAndAddress = async (caller: Caller): Promise<Caller> => {
  const currentTranscript = caller.messages.map(m => m.sender + ": " + m.text).join(' ');
  console.log(currentTranscript)
  let fetchedName = caller.name;
  let fetchedAddress = caller.address;

  if (caller.name === "Caller 1" || caller.address === "Unknown") { // to change
    try {
      const response = await fetch("http://127.0.0.1:5003/identify-details", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "text": currentTranscript }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const details = await response.json();
      console.log(details);
      fetchedName = details?.name ?? "Unknown";
      fetchedAddress = details?.address ?? "Unknown";

      return {
        ...caller,
        name: fetchedName,
        address: fetchedAddress,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      caller.name = "haha"; // to remove
      console.log(caller)
      console.log(caller.callTime)
      return caller;
    }
  }
  return caller;
};

const updateCondition = async (caller: Caller): Promise<Caller> => {
  const currentTranscript = caller.messages.map(m => m.sender + ": " + m.text).join(' ');
  let fetchedCondition = caller.condition;
  if (caller.condition === "Unknown") { // consider removing
    try {
      const response = await fetch("http://127.0.0.1:5003/identify-condition", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "text": currentTranscript }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const details = await response.json();
      console.log(details);
      fetchedCondition = details?.condition ?? "Unknown";

      return {
        ...caller,
        condition: fetchedCondition,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return caller;
    }
  }
  return caller;
};

const extractSummary = async (caller: Caller): Promise<Caller> => {
  const currentTranscript = caller.messages.map(m => m.sender + ": " + m.text).join(' ');
  let extractedMessages = caller.extractedMessages;
  try {
    const response = await fetch("http://127.0.0.1:5002/summarize", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "text": currentTranscript, "is_first": true}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const details = await response.json();
    console.log(details);
    extractedMessages = details?.summary ?? extractedMessages;

    return {
      ...caller,
      extractedMessages: extractedMessages,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return caller;
  }
};

const extractSummary = async (caller: Caller): Promise<Caller> => {
  const currentTranscript = caller.messages.map(m => m.sender + ": " + m.text).join(' ');
  let extractedMessages = caller.extractedMessages;
  try {
    const response = await fetch("http://127.0.0.1:5002/summarize", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "text": currentTranscript, "is_first": true}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const details = await response.json();
    console.log(details);
    extractedMessages = details?.summary ?? extractedMessages;

    return {
      ...caller,
      extractedMessages: extractedMessages,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return caller;
  }
};

export default function CallerList({ onCallerClick, selectedCallers, callers: initialCallers }: CallerListProps) {
  const [callers, setCallers] = useState<Caller[]>([]);
  
  useEffect(() => {
    setCallers((prevCallers) =>
    prevCallers.map((caller) => ({
      ...caller,
      isSelected: selectedCallers.some((selected) => selected?.id === caller.id),
    }))
  );
}, [selectedCallers]);

useEffect(() => {
  setCallers(initialCallers);
}, [initialCallers]);

  useEffect(() => {
    // Update call times every 1 second
    const callTimeInterval = setInterval(() => {
      setCallers(prevCallers => updateCallTimes(prevCallers));
    }, 1000);

    // Update name and address every 20 seconds
    const nameAddressInterval = setInterval(() => {
      setCallers(prevCallers => {
        const fetchAndUpdateCallers = async () => {
          try {
            console.log("Fetching and updating callers");
            const updatedCallers = await Promise.all(prevCallers.map(updateNameAndAddress));
            console.log("Updated callers:", updatedCallers);
            return updatedCallers;
          } catch (error) {
            console.error("Error updating callers:", error);
            return prevCallers; // Return previous state in case of error
          }
        };

        fetchAndUpdateCallers().then(updatedCallers => {
          if (updatedCallers) setCallers(updatedCallers);
        });
        return prevCallers; // Return the previous state immediately
      });
    }, 20000);

    const conditionInterval = setInterval(() => {
      setCallers(prevCallers => {
        const fetchAndUpdateCallers = async () => {
          try {
            console.log("Identifying condition");
            const updatedCallers = await Promise.all(prevCallers.map(updateCondition));
            console.log("Identified condition:", updatedCallers);
            return updatedCallers;
          } catch (error) {
            console.error("Error updating callers:", error);
            return prevCallers; // Return previous state in case of error
          }
        };

        fetchAndUpdateCallers().then(updatedCallers => {
          if (updatedCallers) setCallers(updatedCallers);
        });
        return prevCallers; // Return the previous state immediately
      });
    }, 20000);

    const summaryInterval = setInterval(() => {
      setCallers(prevCallers => {
        const fetchAndUpdateCallers = async () => {
          try {
            console.log("Extracting keywords");
            const updatedCallers = await Promise.all(prevCallers.map(extractSummary));
            return updatedCallers;
          } catch (error) {
            console.error("Error updating callers:", error);
            return prevCallers; // Return previous state in case of error
          }
        };

        fetchAndUpdateCallers().then(updatedCallers => {
          if (updatedCallers) setCallers(updatedCallers);
        });
        return prevCallers; // Return the previous state immediately
      });
    }, 20000);

    // Clear interval on component unmount
    return () => {
      clearInterval(callTimeInterval);
      clearInterval(nameAddressInterval);
      clearInterval(conditionInterval);
      clearInterval(summaryInterval);
    };

  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <div className="h-screen flex flex-col">
      <Header />
      <ScrollArea className="h-full w-full rounded-md border">
        <div className="p-4">
          {callers.map((caller) => (
            <div key={caller.id} onClick={() => onCallerClick(caller)}>
              <CallerListCard
                name={caller.name}
                condition={caller.condition}
                address={caller.address}
                callTime={caller.callTime}
                isLiveCall={caller.isLiveCall}
                isSelected={selectedCallers.some(selected => selected?.id === caller.id)}
              />
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
