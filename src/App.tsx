import "./App.css";
import { WebMidiProvider } from "./contexts/WebMidiProvider";
import { MidiSetup } from "./components/MidiSetup/MidiSetup";
import SysyexValue from "./components/SysexValue/SysexValue";
import { FUNCTION_CODE_SEND } from "./constants/x5dr";
import DumpRequest from "./components/SysexValue/DumpRequest";
import Zustand from "./components/zustand/Zustand";

function App() {
  return (
    <WebMidiProvider>
      <MidiSetup />
      {/* <KnobTester /> */}
      <SysyexValue
        functionCode={FUNCTION_CODE_SEND.MODE_REQUEST}
        data={[]}
        label="Mode Request"
      />
      <SysyexValue
        functionCode={FUNCTION_CODE_SEND.MODE_CHANGE}
        data={[0x03, 0]}
        label="Set to Prog Edit Mode"
      />
      <DumpRequest
        requestCode={FUNCTION_CODE_SEND.PROGRAM_PARAMETER_DUMP_REQUEST}
        receiveCode={FUNCTION_CODE_SEND.PROGRAM_PARAMETER_DUMP}
        label="Parameter Dump Request"
      />
      <Zustand />
    </WebMidiProvider>
  );
}

export default App;
