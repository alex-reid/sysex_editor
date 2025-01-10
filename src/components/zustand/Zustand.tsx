import { ProgramParameterJson } from "../../store/ProgramSlice";
import useStore from "../../store/store";
import parameters from "../../constants/x5dr/parameters.json";
import { ParamList } from "./ParamList";

function ProgramParams() {
  const programConfig = useStore((state) => state.programConfig);
  const programParameters = useStore((state) => state.programParameters);
  if (!programConfig || !programParameters) return null;
  return (
    <ParamList
      programParameters={programParameters}
      programConfig={programConfig}
    />
  );
}

function LoadFromJSON() {
  const loadFromJSON = useStore((state) => state.loadFromJSON);
  return (
    <button onClick={() => loadFromJSON(parameters as ProgramParameterJson[])}>
      Load from JSON
    </button>
  );
}

const Zustand = () => {
  return (
    <div>
      <p>Test parameters:</p>
      <ProgramParams />
      <LoadFromJSON />
    </div>
  );
};

export default Zustand;
