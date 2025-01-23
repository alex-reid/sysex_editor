import { memo, useCallback, useRef } from "react";
import { useWebMidi } from "../../contexts/webmidi";
import { paramChangeSysexMessage } from "../../utils/converters";
import useStore from "../../store/store";
import Knob from "../widgets/Knob/Knob";

const InputKnob = ({
  functionCode,
  id,
}: {
  functionCode: number;
  id: number;
}) => {
  const { sendSysexMessage } = useWebMidi();
  const timeoutRef = useRef(setTimeout(() => {}, 0));
  const setParameterValue = useStore((state) => state.setParameterValue);
  const params = useStore((state) =>
    state.programParameters.find((p) => p.id === id)
  );
  // console.log(id + " rerender");

  const handleValueChange = useCallback(
    (value: number) => {
      if (!params) {
        return;
      }

      clearTimeout(timeoutRef.current);

      if (params.active) {
        setParameterValue(id, value);
        timeoutRef.current = setTimeout(() => {
          sendSysexMessage(
            functionCode,
            paramChangeSysexMessage(
              params.sysexOutParamVal!.ParamNo,
              Math.round(value)
            )
          )
            .then(() => {
              console.log(params.name, "sent");
            })
            .catch((error) => {
              console.error(error);
            });
        }, 30);
      }
    },
    [params, setParameterValue, id, functionCode, sendSysexMessage]
  );

  if (!params) {
    return null;
  }

  return (
    <Knob
      valueRaw={params?.parameterValue || params?.defaultParameterValue || 0}
      setValueRaw={handleValueChange}
      valueMin={params.inputSettings!.valueFrom || 0}
      valueMax={params.inputSettings!.valueTo || 99}
      tooltip={params?.name + " " + params?.id || ""}
      label={params?.label || ""}
    />
  );
};

const InputKnobMemo = memo(InputKnob);
export default InputKnobMemo;
