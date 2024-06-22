import { useEffect, useState } from "react";
import "./App.css";
import CallerList from "./components/CallerList";
import CallerCard from "./components/CallerCard";
import { Caller, getCallers } from "./api/api"; // Adjust the import path as needed

function App() {
  const [selectedCallers, setSelectedCallers] = useState<(Caller | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [callers, setCallers] = useState<Caller[]>([]);
  const [clickOrder, setClickOrder] = useState<number[]>([]);

  const handleCallerClick = (caller: Caller) => {
    setSelectedCallers((prevSelectedCallers) => {
      const newSelectedCallers = [...prevSelectedCallers];
      const existingIndex = newSelectedCallers.findIndex(selected => selected?.id === caller.id);

      if (existingIndex !== -1) {
        // If the caller is already selected, deselect it
        newSelectedCallers[existingIndex] = null;
        setClickOrder((prevOrder) => prevOrder.filter((index) => index !== existingIndex));
      } else {
        // Find the first empty div or replace the oldest clicked div
        const emptyIndex = newSelectedCallers.findIndex(selected => selected === null);
        const indexToReplace = emptyIndex !== -1 ? emptyIndex : clickOrder[0];

        newSelectedCallers[indexToReplace] = caller;

        // Update the click order
        setClickOrder((prevOrder) => {
          const newOrder = [...prevOrder.filter((index) => index !== indexToReplace), indexToReplace];
          if (newOrder.length > 4) newOrder.shift();
          return newOrder;
        });
      }

      return newSelectedCallers;
    });
  };

  const handleNameChange = (id: number, newName: string) => {
    setCallers((prevCallers) => {
      const newCallers = prevCallers.map((caller) => 
        caller.id === id ? { ...caller, name: newName } : caller
      );
      return newCallers;
    });

    setSelectedCallers((prevSelectedCallers) => {
      const newSelectedCallers = prevSelectedCallers.map((caller) =>
        caller?.id === id ? { ...caller, name: newName } : caller
      );
      return newSelectedCallers;
    });
  };

  const handleConditionChange = (id: number, newCondition: string) => {
    setCallers((prevCallers) => {
      const newCallers = prevCallers.map((caller) => 
        caller.id === id ? { ...caller, condition: newCondition } : caller
      );
      return newCallers;
    });

    setSelectedCallers((prevSelectedCallers) => {
      const newSelectedCallers = prevSelectedCallers.map((caller) =>
        caller?.id === id ? { ...caller, condition: newCondition } : caller
      );
      return newSelectedCallers;
    });
  };

  const handleAddressChange = (id: number, newAddress: string) => {
    setCallers((prevCallers) => {
      const newCallers = prevCallers.map((caller) => 
        caller.id === id ? { ...caller, address: newAddress } : caller
      );
      return newCallers;
    });

    setSelectedCallers((prevSelectedCallers) => {
      const newSelectedCallers = prevSelectedCallers.map((caller) =>
        caller?.id === id ? { ...caller, address: newAddress } : caller
      );
      return newSelectedCallers;
    });
  };

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

  return (
    <div className="grid h-screen w-screen grid-flow-row grid-cols-5 grid-rows-2">
      <div className="h-screen col-span-1 row-span-3">
        <CallerList onCallerClick={handleCallerClick} selectedCallers={selectedCallers} callers={callers} />
      </div>
      {selectedCallers.map((caller, index) => (
        <div key={index} className="col-span-2 overflow-hidden">
          {caller && (
            <CallerCard
              name={caller.name}
              condition={caller.condition}
              address={caller.address}
              callTime={caller.callTime}
              messages={caller.messages}
              extractedMessages={caller.extractedMessages}
              isLiveCall={caller.isLiveCall}
              onNameChange={(newName) => handleNameChange(caller.id, newName)}
              onConditionChange={(newCondition) => handleConditionChange(caller.id, newCondition)}
              onAddressChange={(newAddress) => handleAddressChange(caller.id, newAddress)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
