import { FUNCTION_CODE_SEND } from "../constants/x5dr";
import Knob from "../components/widgets/Knob";
import { useCallback, useState } from "react";
import useStore from "../store/store";
import InputSlider from "../components/SysexValue/InputSlider";

const KnobTester = () => {
  const [valueRaw2, setValueRaw2] = useState(0);
  const { setParameterValue } = useStore((state) => state);
  const params = useStore((state) => state.programParameters[4]);
  const setValueRaw = useCallback(
    (value: number) => {
      setParameterValue(4, value);
    },
    [setParameterValue]
  );
  const params3 = useStore((state) => state.programParameters[3]);
  const setValueRaw3 = useCallback(
    (value: number) => {
      setParameterValue(3, value);
    },
    [setParameterValue]
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Knob
        valueRaw={params?.parameterValue || 0}
        setValueRaw={setValueRaw}
        valueMin={params?.valueFrom || 0}
        valueMax={params?.valueTo || 99}
        valueDefault={params?.defaultParameterValue || 0}
        tooltip={params?.name || ""}
        label={params?.label || ""}
      />
      <Knob
        valueRaw={valueRaw2}
        setValueRaw={setValueRaw2}
        valueMin={-99}
        valueMax={99}
        valueDefault={0}
        tooltip="EG Time Mod by Keyboard Track Attack Time"
        label="KT Attack Time"
      />
      <Knob
        valueRaw={params3?.parameterValue || 0}
        setValueRaw={setValueRaw3}
        valueMin={params3?.valueFrom || 0}
        valueMax={params3?.valueTo || 99}
        valueDefault={params3?.defaultParameterValue || 0}
        tooltip={params3?.name || ""}
        label={params3?.label || ""}
      />
      <InputSlider functionCode={FUNCTION_CODE_SEND.PARAMETER_CHANGE} id={4} />
    </div>
  );
};

export default KnobTester;
