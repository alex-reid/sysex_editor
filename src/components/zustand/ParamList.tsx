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
        if (parameter.enabled) {
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
            case "label":
              return (
                <div
                  key={key}
                  style={{
                    width: "100%",
                    gridColumnStart: 1,
                    gridColumnEnd: -1,
                  }}
                >
                  <h4>{parameter.label}</h4>
                </div>
              );
            default:
              return null;
          }
        }
      })}
    </>
  );
}
