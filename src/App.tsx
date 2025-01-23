import "./App.css";
import { WebMidiProvider } from "./contexts/WebMidiProvider";
import { MidiSetup } from "./components/MidiSetup/MidiSetup";
import SysyexValue from "./components/SysexValue/SysexValue";
import { FUNCTION_CODE_SEND } from "./constants/x5dr";
import DumpRequest from "./components/SysexValue/DumpRequest";
import Zustand from "./components/zustand/Zustand";
// import EnvWithNames from "./components/widgets/Envelope/EnvWithNames";

function App() {
  return (
    <WebMidiProvider>
      <MidiSetup />
      {/* <EnvWithNames
        attackTimeName="VOICE_1_VDF_EG_ATTACK_TIME"
        decayTimeName="VOICE_1_VDF_EG_DECAY_TIME"
        slopeTimeName="VOICE_1_VDF_EG_SLOPE_TIME"
        releaseTimeName="VOICE_1_VDF_EG_RELEASE_TIME"
        attackLevelName="VOICE_1_VDF_EG_ATTACK_LEVEL"
        breakPointLevelName="VOICE_1_VDF_EG_BREAK_POINT"
        sustainLevelName="VOICE_1_VDF_EG_SUSTAIN_LEVEL"
        releaseLevelName="VOICE_1_VDF_EG_RELEASE_LEVEL"
      />
      <EnvWithNames
        attackTimeName="VOICE_2_VDF_EG_ATTACK_TIME"
        decayTimeName="VOICE_2_VDF_EG_DECAY_TIME"
        slopeTimeName="VOICE_2_VDF_EG_SLOPE_TIME"
        releaseTimeName="VOICE_2_VDF_EG_RELEASE_TIME"
        attackLevelName="VOICE_2_VDF_EG_ATTACK_LEVEL"
        breakPointLevelName="VOICE_2_VDF_EG_BREAK_POINT"
        sustainLevelName="VOICE_2_VDF_EG_SUSTAIN_LEVEL"
        releaseLevelName="VOICE_2_VDF_EG_RELEASE_LEVEL"
      /> */}
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
