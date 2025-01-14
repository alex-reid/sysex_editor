import { createContext, useContext } from "react";

interface WebMidiContextValue {
  midiAccess: WebMidi.MIDIAccess | null;
  midiInputs: WebMidi.MIDIInput[] | null;
  midiOutputs: WebMidi.MIDIOutput[] | null;
  currentInput: WebMidi.MIDIInput | null;
  currentOutput: WebMidi.MIDIOutput | null;
  midiInitialised: boolean;
  handleInputChange: (id: string) => void | null;
  handleOutputChange: (id: string) => void | null;
  sendCMajorChord: () => void;
  sendMidiMessage: (message: number[]) => void;
  receivedMessage: number[];
  sysexHeaderInfo: number[];
  sendSysexMessage: (
    functionCode: number,
    data: number[]
  ) => Promise<number[] | Error>;
  sendSysexDumpRequest: (
    requestCode: number,
    receiveCode: number,
    data?: number[]
  ) => Promise<number[]>;
  dumpData: number[] | null;
}

export const WebMidiContext = createContext<WebMidiContextValue>({
  midiAccess: null,
  midiInputs: null,
  midiOutputs: null,
  currentInput: null,
  currentOutput: null,
  midiInitialised: false,
  handleInputChange: () => null,
  handleOutputChange: () => null,
  sendCMajorChord: () => {}, // Initialize with an empty function
  sendMidiMessage: () => {}, // Initialize with an empty function
  receivedMessage: [],
  sysexHeaderInfo: [],
  sendSysexMessage: () => Promise.resolve([]), // Initialize with a function that resolves an empty array
  sendSysexDumpRequest: () => Promise.resolve([]), // Initialize with a function that resolves an empty array
  dumpData: [],
});

export const useWebMidi = (): WebMidiContextValue => useContext(WebMidiContext);
