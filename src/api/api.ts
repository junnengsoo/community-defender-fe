// Define the Caller type
export interface Caller {
    name: string;
    condition: string;
    address: string;
    callTime: string;
    opsCentre: string;
    isLiveCall: boolean;
    messages: { sender: string; text: string }[];
    additionalInfo: string;
  }
  
  // Function to get the list of callers
  export const getCallers = async (): Promise<Caller[]> => {
    const response = await fetch('/api/callers'); // Replace with API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch callers');
    }
    const data = await response.json();
    return data;
  };
  