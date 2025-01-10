import { ProgramParameters, ProgramConfig } from "../../store/ProgramSlice";
import InputSlider from "../SysexValue/InputSlider";
import SelectDropdown from "../SysexValue/SelectDropdown";

export function ParamList({
  programParameters,
  programConfig,
}: {
  programParameters: ProgramParameters[];
  programConfig: ProgramConfig;
}) {
  return (
    <>
      {programParameters.map((parameter: ProgramParameters, key: number) => {
        if (parameter.enabled && parameter.sysexOutParamVal) {
          switch (parameter.paramType) {
            case "slider":
              return (
                <InputSlider
                  id={parameter.id}
                  key={key}
                  functionCode={programConfig?.functionCode || 0}
                />
              );
            case "select":
              return (
                <SelectDropdown
                  id={parameter.id}
                  key={key}
                  functionCode={programConfig?.functionCode || 0}
                />
              );
            default:
              return null;
          }
        }
      })}
    </>
  );
}
