import { memo, useCallback, useRef } from "react";
import { useWebMidi } from "../../contexts/webmidi";
import { paramChangeSysexMessage } from "../../utils/converters";
import useStore from "../../store/store";
import Knob from "../widgets/Knob";

const InputSlider = memo(
  ({ functionCode, id }: { functionCode: number; id: number }) => {
    const { sendSysexMessage } = useWebMidi();
    const timeoutRef = useRef(setTimeout(() => {}, 0));
    const setParameterValue = useStore((state) => state.setParameterValue);
    const params = useStore((state) => state.programParameters[id]);
    // console.log(id + " rerender");

    const handleValueChange = useCallback(
      (value: number) => {
        if (!params) {
          return;
        }

        setParameterValue(id, value);
        clearTimeout(timeoutRef.current);

        if (params.active) {
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
        valueMin={params?.valueFrom || 0}
        valueMax={params?.valueTo || 99}
        tooltip={params?.name || ""}
        label={params?.label || ""}
      />
    );

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!params) {
        return;
      }

      clearTimeout(timeoutRef.current);

      if (params.active) {
        timeoutRef.current = setTimeout(() => {
          sendSysexMessage(
            functionCode,
            paramChangeSysexMessage(
              params.sysexOutParamVal!.ParamNo,
              parseInt(e.target.value, 10)
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
    };

    return (
      <div>
        <label>
          <ExtendedInput
            type="range"
            min={params.valueFrom}
            max={params.valueTo}
            onChange={handleSliderChange}
            value={params.parameterValue}
            orient="vertical"
          />
          <input
            type="number"
            value={params.parameterValue}
            readOnly
            style={{ maxWidth: "2rem" }}
          />
          <br />
          {params.label}
        </label>
      </div>
    );
  }
);

const ExtendedInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { orient?: "vertical" }
> = (props) => <input {...props} />;

export default InputSlider;
