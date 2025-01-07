import { useAppSelector, useAppDispatch } from "../../utils/reduxHooks";
import { loadParameterFromJSON } from "../../redux/parameters";
import parametersJSON from "../../constants/x5dr/parameters.json";
import InputSlider from "../SysexValue/InputSlider";
import SelectDropdown from "../SysexValue/SelectDropdown";
import { FUNCTION_CODE_SEND } from "../../constants/x5dr";
import InputSliderRedux from "../SysexValue/InputSliderRedux";

export function ParamDisplay() {
  const { parameters } = useAppSelector((state) => state.parameters);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button onClick={() => dispatch(loadParameterFromJSON(parametersJSON))}>
          load from JSON
        </button>
        {parameters.map((parameter, key) => {
          switch (parameter.state.paramType) {
            case "slider":
              return (
                <InputSliderRedux
                  key={key}
                  functionCode={FUNCTION_CODE_SEND.PARAMETER_CHANGE}
                  id={parameter.id}
                />
              );
            case "select":
              return (
                <SelectDropdown
                  key={key}
                  functionCode={FUNCTION_CODE_SEND.PARAMETER_CHANGE}
                  parameter={parameter.state.sysexOutParamVal.ParamNo}
                  label={parameter.state.label || ""}
                  selectData={parameter.state.values!}
                  initValue={0}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
