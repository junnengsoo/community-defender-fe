// Function to get the list of callers
export const getCallers = async (): Promise<Caller[]> => {
  // const response = await fetch("/api/callers"); // Replace with API endpoint
  // if (!response.ok) {
  //   throw new Error("Failed to fetch callers");
  // }
  // const data = await response.json();
  // return data;

  const dummyCallers = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `Caller ${i + 1}`,
    condition: "test condition", // Change this to "Cardiac Arrest" or "Stroke" for testing
    address: `Address ${i + 1}`,
    callTime: `00:${String(i).padStart(2, "0")}`,
    isLiveCall: i % 2 === 0,
    messages: Array.from({ length: 3 }).map((_, j) => ({
      sender: j % 2 === 0 ? "You" : "Caller",
      text: `Message ${j + 1}`,
    })),
    extractedMessages: `Extracted messages for caller ${i + 1}`,
  }));

  return dummyCallers;
};

// Mock data structure for Caller
export interface Caller {
  id: number;
  name: string;
  condition: string;
  address: string;
  callTime: string;
  messages: string[];
  extractedMessages: string[];
  isLiveCall: boolean;
}
