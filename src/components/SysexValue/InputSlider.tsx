import { memo, useRef } from "react";
import { useWebMidi } from "../../contexts/webmidi";
import { paramChangeSysexMessage } from "../../utils/converters";
import useStore from "../../store/store";

const InputSlider = ({
  functionCode,
  name,
}: {
  functionCode: number;
  name: string;
}) => {
  const { sendSysexMessage } = useWebMidi();
  const timeoutRef = useRef(setTimeout(() => {}, 0));
  const setParameterValue = useStore((state) => state.setParameterValue);
  const params = useStore((state) => state.getParameterByName(name));

  if (!params) {
    return null;
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!params) {
      return;
    }

    clearTimeout(timeoutRef.current);

    setParameterValue(params.id, parseInt(e.target.value, 10));

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
          min={params.inputSettings!.valueFrom}
          max={params.inputSettings!.valueTo}
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
};

const InputSliderMemo = memo(InputSlider);

const ExtendedInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { orient?: "vertical" }
> = (props) => <input {...props} />;

export default InputSliderMemo;
