import { useWebMidi } from "../../contexts/webmidi";
import parameters from "../../constants/x5dr/parameters.json";
import { PararameterList } from "../PararameterList/PararameterList";

export const DumpedProgram = () => {
  const { dumpData } = useWebMidi();
  if (dumpData && dumpData.length > 0) {
    return <PararameterList parameters={parameters} dumpData={dumpData} />;
  }
  return null;
};
