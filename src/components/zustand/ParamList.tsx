import { ProgramParameters, ProgramConfig } from "../../store/ProgramSlice";
import InputKnobMemo from "../SysexValue/InputKnob";
import InputToggle from "../SysexValue/InputToggle";
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
          return (
            <ParamInput
              key={key}
              parameter={parameter}
              programConfig={programConfig}
            />
          );
        }
      })}
    </>
  );
}

export const ParamInput = ({
  parameter,
  programConfig,
}: {
  parameter: ProgramParameters;
  programConfig: ProgramConfig;
}) => {
  switch (parameter.inputType) {
    case "number":
      return (
        <InputKnobMemo
          id={parameter.id}
          functionCode={programConfig?.functionCode || 0}
        />
      );
    case "boolean":
      return (
        <InputToggle
          id={parameter.id}
          functionCode={programConfig?.functionCode || 0}
        />
      );
    case "list":
      return (
        <SelectDropdown
          id={parameter.id}
          functionCode={programConfig?.functionCode || 0}
        />
      );
    case "label":
      return (
        <div
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
};
