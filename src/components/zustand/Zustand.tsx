import { ProgramParameterJson } from "../../store/ProgramSlice";
import useStore from "../../store/store";
import x5dr from "../../constants/x5dr/x5drConfig.json";
import { ParamList } from "./ParamList";
import { useCallback, useEffect } from "react";

const ProgramParams = () => {
  const programConfig = useStore((state) => state.programConfig);
  const programParameters = useStore((state) => state.programParameters);
  if (!programConfig || !programParameters) return null;
  return (
    <ParamList
      programParameters={programParameters}
      programConfig={programConfig}
    />
  );
};

const Zustand = () => {
  const loadFromJSON = useStore((state) => state.loadFromJSON);
  const setAllParametersActive = useStore(
    (state) => state.setAllParametersActive
  );
  const handleLoad = useCallback(() => {
    loadFromJSON(x5dr.parameters as ProgramParameterJson[], x5dr.constants);
    setAllParametersActive(true);
  }, [loadFromJSON, setAllParametersActive]);
  useEffect(() => {
    handleLoad();
  });

  return (
    <div>
      <h3>Parameters:</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "2rem 1rem",
        }}
      >
        <ProgramParams />
      </div>
    </div>
  );
};

export default Zustand;
