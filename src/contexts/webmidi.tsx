import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalstorage } from "../utils/useLocalstorage";
import { useLoadDumpData } from "./hooks/useLoadDumpData";
import displayNumberAsHex from "../utils/displayNumberAsHex";

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
  ) => Promise<number[] | Error>;
  dumpData: number[] | null;
}

const WebMidiContext = createContext<WebMidiContextValue>({
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

export const WebMidiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // configure the WebMidi API
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[] | null>(
    null
  );
  const [midiOutputs, setMidiOutputs] = useState<WebMidi.MIDIOutput[] | null>(
    null
  );
  const [currentInput, setCurrentInput] = useState<WebMidi.MIDIInput | null>(
    null
  );
  const [currentOutput, setCurrentOutput] = useState<WebMidi.MIDIOutput | null>(
    null
  );

  // Add useLocalStorage hook to persist current input and output
  const [storedInputId, setStoredInputId] = useLocalstorage(
    "",
    "webMidiCurrentInputId"
  );
  const [storedOutputId, setStoredOutputId] = useLocalstorage(
    "",
    "webMidiCurrentOutputId"
  );

  // handle midi messages
  const [receivedMessage, setReceivedMessage] = useState<number[]>([]);
  const [sysexHeaderInfo, setSysexHeaderInfo] = useState<number[]>([]);

  // add a "midiInitialised" state
  const [midiInitialised, setMidiInitialised] = useState(false);

  // hook for getting the dump data
  const [dumpData, getDataFromSysexMessage] = useLoadDumpData();

  // Initialize the Web MIDI API
  useEffect(() => {
    const initializeMidi = async () => {
      try {
        const access = await navigator.requestMIDIAccess({
          sysex: true,
          software: false,
        });
        setMidiAccess(access as WebMidi.MIDIAccess);

        const updateInputsAndOutputs = () => {
          const inputs = Array.from(access.inputs.values()).filter(
            (input) => input.state === "connected"
          );
          const outputs = Array.from(access.outputs.values()).filter(
            (output) => output.state === "connected"
          );
          setMidiInputs(inputs);
          setMidiOutputs(outputs);
        };

        updateInputsAndOutputs();

        access.onstatechange = updateInputsAndOutputs;
      } catch (error) {
        console.error("Failed to initialize Web MIDI:", error);
      }
    };

    initializeMidi()
      .then(() => {
        setMidiInitialised(true);
      })
      .catch((error) => {
        console.error("Failed to initialize Web MIDI:", error);
        setMidiInitialised(false);
      });
  }, []);

  // Restore stored input and output from localstorage on component mount
  useEffect(() => {
    if (storedInputId) {
      const input = midiAccess?.inputs.get(storedInputId);
      setCurrentInput(input || null);
    }
    if (storedOutputId) {
      const output = midiAccess?.outputs.get(storedOutputId);
      setCurrentOutput(output || null);
    }
  }, [storedInputId, storedOutputId, midiAccess]);

  // handle input and output changes
  const handleInputChange = (id: string) => {
    const input = midiAccess?.inputs.get(id);
    setCurrentInput(input || null);
    setStoredInputId(id || ""); // Store the selected input ID
  };

  const handleOutputChange = (id: string) => {
    const output = midiAccess?.outputs.get(id);
    setCurrentOutput(output || null);
    setStoredOutputId(id || ""); // Store the selected output ID
  };

  // send a MIDI message
  const sendMidiMessage = useCallback(
    (message: number[]) => {
      const output = currentOutput;
      if (output) {
        output.send(message, 0);
      }
    },
    [currentOutput]
  );

  // send a C major chord
  const sendCMajorChord = () => {
    const output = currentOutput;
    if (output) {
      // Send MIDI messages for C major chord on channel 1
      sendMidiMessage([0x90, 60, 100]); // Note On: C4
      sendMidiMessage([0x90, 64, 100]); // Note On: E4
      sendMidiMessage([0x90, 67, 100]); // Note On: G4

      // Turn off the notes after 800ms
      setTimeout(() => {
        sendMidiMessage([0x80, 60, 0]); // Note Off: C4
        sendMidiMessage([0x80, 64, 0]); // Note Off: E4
        sendMidiMessage([0x80, 67, 0]); // Note Off: G4
      }, 800);
    }
  };

  // a hook to receive MIDI messages and ignore Active Sensing messages
  useEffect(() => {
    const input = currentInput;
    if (input) {
      input.onmidimessage = (event) => {
        // Ignore Active Sensing messages and non sysex messages
        if (event.data[0] === 0xfe || event.data[0] !== 0xf0) {
          return;
        }
        setReceivedMessage(Array.from(event.data));
      };
    }
    // cleanup the event listener when the input changes
    return () => {
      if (input) {
        input.onmidimessage = null;
      }
    };
  }, [currentInput]);

  // send a SysEx message to get the device's identity
  useEffect(() => {
    sendMidiMessage([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]);
  }, [currentOutput, currentInput, sendMidiMessage]);

  // parse the identity reply message
  useEffect(() => {
    if (receivedMessage.length > 0) {
      const [
        sysEx,
        ,
        channel,
        generalInformation,
        identityReply,
        manufacturerId,
        familyCode,
        familyCode2,
      ] = receivedMessage;
      if (
        sysEx !== 0xf0 ||
        generalInformation !== 0x06 ||
        identityReply !== 0x02
      ) {
        return;
      }
      const sysExHeader = [
        manufacturerId,
        (0x03 << 4) + channel,
        familyCode + familyCode2,
      ];
      setSysexHeaderInfo(sysExHeader);
    }
  }, [receivedMessage]);

  // send a SysEx message using the promise API to listen for a response via input.onmidimessage, if the received message has a status of 0x23 (Data Load Completed), resolve the promise
  const sendSysexMessage = useCallback(
    (functionCode: number, data: number[]) =>
      new Promise<number[] | Error>((resolve, reject) => {
        if (midiInitialised && currentInput) {
          let timeout: ReturnType<typeof setTimeout> | null = null;
          currentInput.onmidimessage = (event: WebMidi.MIDIMessageEvent) => {
            if (timeout) clearTimeout(timeout); // Clear the timeout if a message is received
            const [, , , , functionId] = event.data;
            if (functionId === 0x23) {
              currentInput.onmidimessage = null; // Remove the event listener
              resolve(Array.from(event.data));
            } else if (functionId === 0x24) {
              currentInput.onmidimessage = null; // Remove the event listener
              reject(
                new Error(
                  "Received Data Load Error: " + displayNumberAsHex(functionId)
                )
              );
            } else {
              reject(
                new Error(
                  "Received unexpected message: " +
                    displayNumberAsHex(functionId)
                )
              );
            }
            currentInput.onmidimessage = null; // Remove the event listener
          };
          timeout = setTimeout(() => {
            currentInput.onmidimessage = null; // Remove the event listener
            reject(new Error("Timeout: No response received after 1 second"));
          }, 1000); // Set a timeout of 1 second
        } else {
          reject(new Error("No input device selected"));
        }

        if (midiInitialised && currentOutput !== null) {
          if (sysexHeaderInfo.length !== 3) {
            reject(new Error("Sysex header info is not set correctly"));
            return;
          }
          const message = [
            0xf0,
            ...sysexHeaderInfo,
            functionCode,
            ...data,
            0xf7,
          ];
          // console.log("Sending message", message);
          sendMidiMessage(message);
        } else {
          reject(new Error("No output device selected"));
        }
      }),
    [
      currentInput,
      currentOutput,
      midiInitialised,
      sendMidiMessage,
      sysexHeaderInfo,
    ]
  );

  // send a SysEx message using the promise API to listen for a response via input.onmidimessage, if the received message has a status of 0x23 (Data Load Completed), resolve the promise
  const sendSysexDumpRequest = useCallback(
    (requestCode: number, receiveCode: number, data: number[] = []) =>
      new Promise<number[] | Error>((resolve, reject) => {
        if (midiInitialised && currentInput) {
          let timeout: ReturnType<typeof setTimeout> | null = null;
          currentInput.onmidimessage = (event: WebMidi.MIDIMessageEvent) => {
            if (timeout) clearTimeout(timeout); // Clear the timeout if a message is received
            const [, , , , functionId] = event.data;
            if (functionId === receiveCode) {
              currentInput.onmidimessage = null; // Remove the event listener
              resolve(getDataFromSysexMessage(Array.from(event.data)));
            } else {
              const errorCode = event.data[4];
              reject(
                new Error(
                  "Received unexpected message: " +
                    displayNumberAsHex(errorCode)
                )
              );
            }
            currentInput.onmidimessage = null; // Remove the event listener
          };
          timeout = setTimeout(() => {
            currentInput.onmidimessage = null; // Remove the event listener
            reject(new Error("Timeout: No response received after 20 seconds"));
          }, 20000); // Set a timeout of 1 second
        } else {
          reject(new Error("Midi not initialised"));
        }

        if (midiInitialised && currentOutput) {
          if (sysexHeaderInfo.length !== 3) {
            reject(new Error("Sysex header info is not set correctly"));
            return;
          }
          const message = [
            0xf0,
            ...sysexHeaderInfo,
            requestCode,
            ...data,
            0xf7,
          ];
          // console.log("Sending message", message);
          sendMidiMessage(message);
        } else {
          reject(new Error("Midi not initialised"));
        }
      }),
    [
      currentInput,
      currentOutput,
      midiInitialised,
      sendMidiMessage,
      sysexHeaderInfo,
      getDataFromSysexMessage,
    ]
  );

  return (
    <WebMidiContext.Provider
      value={{
        midiAccess,
        midiInputs,
        midiOutputs,
        currentInput,
        currentOutput,
        midiInitialised,
        handleInputChange,
        handleOutputChange,
        sendCMajorChord,
        sendMidiMessage,
        receivedMessage,
        sysexHeaderInfo,
        sendSysexMessage,
        sendSysexDumpRequest,
        dumpData,
      }}
    >
      {children}
    </WebMidiContext.Provider>
  );
};
