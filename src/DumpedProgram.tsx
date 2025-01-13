import { useWebMidi } from "./contexts/webmidi";
import x5dr from "./constants/x5dr/parameters.json";
import { PararameterList } from "./PararameterList";

export const DumpedProgram = () => {
  const { dumpData } = useWebMidi();
  if (dumpData && dumpData.length > 0) {
    return <PararameterList parameters={x5dr.parameters} dumpData={dumpData} />;
  }
  return null;
};
