import { ProgramParameters, ProgramConfig } from "../../store/ProgramSlice";
import InputKnobMemo from "../SysexValue/InputKnob";
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
          switch (parameter.inputType) {
            case "number":
              return (
                <InputKnobMemo
                  id={parameter.id}
                  key={key}
                  functionCode={programConfig?.functionCode || 0}
                />
              );
            case "list":
            case "boolean":
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
