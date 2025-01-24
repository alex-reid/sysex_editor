import { ProgramParameters, ProgramConfig } from "../../store/ProgramSlice";
import InputKnobMemo from "../SysexValue/InputKnob";
import InputToggle from "../SysexValue/InputToggle";
import SelectDropdown from "../SysexValue/SelectDropdown";
import { InputLabel } from "../SysexValue/InputLabel";

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
              name={parameter.name}
              type={parameter.inputType}
              programConfig={programConfig}
            />
          );
        }
      })}
    </>
  );
}

export const ParamInput = ({
  programConfig,
  type,
  name,
  label,
}: {
  programConfig: ProgramConfig;
  type: ProgramParameters["inputType"];
  name: ProgramParameters["name"];
  label?: string;
}) => {
  switch (type) {
    case "number":
      return (
        <InputKnobMemo
          label={label}
          name={name}
          functionCode={programConfig?.functionCode || 0}
        />
      );
    case "boolean":
      return (
        <InputToggle
          label={label}
          name={name}
          functionCode={programConfig?.functionCode || 0}
        />
      );
    case "list":
      return (
        <SelectDropdown
          label={label}
          name={name}
          functionCode={programConfig?.functionCode || 0}
        />
      );
    case "label":
      return <InputLabel name={name}></InputLabel>;
    default:
      return null;
  }
};
