import { Caller } from '@/components/CallerTypes';

// Function to fetch initial caller data
export async function getCallers(): Promise<Caller[]> {
  try {
    // const response = await fetch('/api/callers'); // Adjust the endpoint as needed
    // if (!response.ok) {
    //   throw new Error('Failed to fetch callers');
    // }
    // const data: Caller[] = await response.json();
    // return data;
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
      id: i + 1,
      name: `Caller ${i + 1}`,
      condition: 'Initial', // Change this to "Cardiac Arrest" or "Stroke" for testing
      address: `Address ${i + 1}`,
      callTime: `00:${String(i).padStart(2, '0')}`,
      isLiveCall: i % 2 === 0,
      messages: Array.from({ length: 10 }).map((_, j) => ({
        sender: j % 2 === 0 ? 'Operator' : 'Caller',
        text: transcript[j],
      })),
      extractedMessages: `Extracted messages for caller ${i + 1}`,
    }));

    return dummyCallers;
  } catch (error) {
    console.error('Failed to fetch callers', error);
    throw error;
  }
}

// to do: Migrate other update functions from App.tsx over

// Function to update caller name and address
export async function updateNameAndAddress(caller: Caller): Promise<Caller> {
  const currentTranscript = caller.messages.map(m => m.sender + ":" + m.text).join(' ');
  let fetchedName = caller.name;
  let fetchedAddress = caller.address;

  if (caller.name === "Caller 1" || caller.address === "Unknown") {
    try {
      console.log("Fetching name and address")
      const response = await fetch("http://localhost:5003/identify-details", {
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
      fetchedName = details?.name ?? "Unknown";
      fetchedAddress = details?.address ?? "Unknown";

      return {
        ...caller,
        name: fetchedName,
        address: fetchedAddress,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return caller;
    }
  }
  return caller;
}
