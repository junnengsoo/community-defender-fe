// Define the Caller type
export interface Caller {
    name: string;
    condition: string;
    address: string;
    callTime: string;
    opsCentre: string;
    isLiveCall: boolean;
    messages: { sender: string; text: string }[];
    extractedMessages: string;
  }