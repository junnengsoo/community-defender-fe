import { useEffect, useState, useRef } from "react";
import "./App.css";
import io from 'socket.io-client';
import CallerList from "./components/CallerList";
import CallerCard from "./components/CallerCard";
import { getCallers } from "./api/api"; 
import { Caller } from '@/components/CallerTypes';

const socket = io('http://localhost:5001'); // Adjust the URL if needed

function App() {
  const [callers, setCallers] = useState<Caller[]>([]);
  const [selectedCallerIds, setselectedCallerIds] = useState<number[]>([]);
  const transcriptionStarted = useRef(false);

    const handleCallerClick = (callerToEdit: Caller) => {
    if (!selectedCallerIds.some(callerId => callerId === callerToEdit.id)) { // add caller to selected caller list
      setselectedCallerIds(prevSelectedCallers => [...prevSelectedCallers, callerToEdit.id]);
    } else {
      setselectedCallerIds(prevSelectedCallers =>
        prevSelectedCallers.filter(callerId => callerId !== callerToEdit.id)
      );
    }
  };

  const handleNameChange = (id: number, newName: string) => { 
    setCallers((prevCallers) => {
      const newCallers = prevCallers.map((caller) => 
        caller.id === id ? { ...caller, name: newName } : caller
      );
      return newCallers;
    });
  };

  const handleConditionChange = (id: number, newCondition: string) => { // to fix
    setCallers((prevCallers) => {
      const newCallers = prevCallers.map((caller) => 
        caller.id === id ? { ...caller, condition: newCondition } : caller
      );
      return newCallers;
    });

  };

  const handleAddressChange = (id: number, newAddress: string) => {
    setCallers((prevCallers) => {
      const newCallers = prevCallers.map((caller) => 
        caller.id === id ? { ...caller, address: newAddress } : caller
      );
      return newCallers;
    });

  };

  const startTranscription = (caller: Caller) => {
    console.log("Starting transcription for " + caller.id.toString());
    fetch('http://127.0.0.1:5001/transcribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: caller.url, caller_id: caller.id })
        });

  }

  useEffect(() => {
    socket.on('transcription_update', ({ caller_id, line }) => {
      setCallers(prevCallers =>
        prevCallers.map(caller =>
          caller.id === caller_id
            ? { ...caller, messages: [...caller.messages, line] }
            : caller
        )
      );
    });

    return () => {
      socket.off('transcription_update');
    };
  }, []);

  // Initialisation with dummy data
  useEffect(() => {
    async function fetchCallers() {
      try {
        const data = await getCallers(); // Assuming getCallers is a function that fetches the caller data
        setCallers(data);
      } catch (error) {
        console.error('Failed to fetch callers', error);
      }
    }
    fetchCallers();
  }, []);

  useEffect(() => {
    if (callers.length > 0 && !transcriptionStarted.current) {
      console.log("calling start transcription");
      console.log(callers);
      callers.forEach(caller => startTranscription(caller));
      transcriptionStarted.current = true; // Set the flag to true after starting transcription
    }
  }, [callers]); // This useEffect runs when callers state changes

  useEffect(() => {
    setCallers((prevCallers) =>
    prevCallers.map((caller) => ({
      ...caller,
      isSelected: selectedCallerIds.some((selected) => selected === caller.id),
    }))
  );
  }, [selectedCallerIds]);

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
    if (caller.name === "Unknown" && caller.condition === "Initial") { // consider removing
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

  useEffect(() => {
    // Update call times every 1 second
    const callTimeInterval = setInterval(() => {
      setCallers(prevCallers => updateCallTimes(prevCallers));
    }, 1000);

    // Note: If the following updates are run concurrently, the properties of the callers might override
    // one another, the temporary fix is to have the updates run sequentially. 

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
    }, 25000);

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
    }, 30000);

    // Clear interval on component unmount
    return () => {
      clearInterval(callTimeInterval);
      clearInterval(nameAddressInterval);
      clearInterval(conditionInterval);
      clearInterval(summaryInterval);
    };

  }, []); // Empty dependency array means this effect runs once on mount


  return (
      <div className="grid h-screen w-screen grid-flow-row grid-cols-5 grid-rows-2">
        <div className="h-screen col-span-1 row-span-3">
          <CallerList
            onCallerClick={handleCallerClick}
            selectedCallers={callers.filter(caller => selectedCallerIds.includes(caller.id))}
            callers={callers}
          />
        </div>
        {callers.filter(caller => selectedCallerIds.includes(caller.id)).map((caller, index) => (
          <div key={index} className="col-span-2 overflow-hidden">
            {caller && (
              <CallerCard
                caller={caller}
                onNameChange={(newName) => handleNameChange(caller.id, newName)}
                onAddressChange={(newAddress) => handleAddressChange(caller.id, newAddress)}
              />
            )}
          </div>
        ))}
      </div>
  );
}

export default App;
