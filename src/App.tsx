import "./App.css";
import { WebMidiProvider } from "./contexts/webmidi";
import { MidiSetup } from "./components/MidiSetup/MidiSetup";
import SysyexValue from "./components/SysexValue/SysexValue";
import { FUNCTION_CODE_SEND } from "./constants/x5dr";
import DumpRequest from "./components/SysexValue/DumpRequest";
import { DumpedProgram } from "./components/DumpedProgram/DumpedProgram";
import { Provider } from "react-redux";
import store from "./store/store";
import { ParamDisplay } from "./components/ParamDisplay/ParamDisplay";

function App() {
  return (
    <Provider store={store}>
      <WebMidiProvider>
        <MidiSetup />
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
        <DumpedProgram />
        <ParamDisplay />

        {/* <DumpRequest
        requestCode={FUNCTION_CODE_SEND.ALL_DATA_DUMP_REQUEST}
        receiveCode={FUNCTION_CODE_SEND.ALL_DATA_DUMP}
        data={[0x00]}
        label="All Data Dump Request"
      />
      <SysyexValue
        functionCode={FUNCTION_CODE_SEND.PARAMETER_CHANGE}
        parameter={PROGRAM_EDIT_PARAMETER.OSC_MODE}
        label="Parameter Change OSC Mode"
        type="dropdown"
        selectData={["Single", "Double", "Drums"]}
      />
      <SysyexValue
        functionCode={FUNCTION_CODE_SEND.PARAMETER_CHANGE}
        parameter={PROGRAM_EDIT_PARAMETER.VOICE_1.OSC.MULTISOUND}
        label="OSC 1 multisound"
        type="dropdown"
        selectData={MULTISOUND_NAMES}
      />
      <SysyexValue
        functionCode={FUNCTION_CODE_SEND.PARAMETER_CHANGE}
        parameter={PROGRAM_EDIT_PARAMETER.VOICE_2.OSC.MULTISOUND}
        label="OSC 2 multisound"
        type="dropdown"
        selectData={MULTISOUND_NAMES}
      />
      <SysyexValue
        functionCode={FUNCTION_CODE_SEND.PARAMETER_CHANGE}
        parameter={PROGRAM_EDIT_PARAMETER.VOICE_1.VDF.CUTOFF_VALUE}
        label="filter 1 cutoff"
        type="slider"
      />
     */}
      </WebMidiProvider>
    </Provider>
  );
}

export default App;
