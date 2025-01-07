import { FUNCTION_CODE_SEND } from "../../constants/x5dr";
import InputSlider from "../SysexValue/InputSlider";
import SelectDropdown from "../SysexValue/SelectDropdown";

interface Parameter {
  label: string;
  enabled?: boolean;
  paramType?: string;
  sysexOutParamVal?: {
    ParamNo: number;
  };
  valueFrom?: number;
  valueTo?: number;
  values?: { value: number; label: string }[];
  children?: Parameter[];
  dumpParamVal?: {
    ParamNo: number;
  };
}

export const PararameterList = ({
  parameters,
  dumpData,
}: {
  parameters: Parameter[];
  dumpData?: number[];
}) => {
  return (
    <>
      {parameters.map((parameter, key: number) => {
        if (parameter.enabled && parameter.sysexOutParamVal) {
          switch (parameter.paramType) {
            case "slider":
              return (
                <InputSlider
                  key={key}
                  functionCode={FUNCTION_CODE_SEND.PARAMETER_CHANGE}
                  parameter={parameter.sysexOutParamVal.ParamNo}
                  label={parameter.label}
                  lowValue={parameter.valueFrom}
                  highValue={parameter.valueTo}
                  initValue={
                    dumpData?.[parameter?.dumpParamVal?.ParamNo || 9999] || 0
                  }
                />
              );
            case "select":
              return (
                <SelectDropdown
                  key={key}
                  functionCode={FUNCTION_CODE_SEND.PARAMETER_CHANGE}
                  parameter={parameter.sysexOutParamVal.ParamNo}
                  label={parameter.label}
                  selectData={parameter.values}
                  initValue={
                    dumpData?.[parameter?.dumpParamVal?.ParamNo || 9999] || 0
                  }
                />
              );
            default:
              return null;
          }
        }
        if (parameter.children && parameter.children.length > 0) {
          return (
            <>
              <p>{parameter.label}</p>
              <PararameterList
                key={key}
                parameters={parameter.children}
                dumpData={dumpData}
              />
            </>
          );
        }
      })}
    </>
  );
};
