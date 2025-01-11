import { useRef } from "react";
import { useWebMidi } from "../../contexts/webmidi";
import { paramChangeSysexMessage } from "../../utils/converters";
import useStore from "../../store/store";

const InputSlider = ({
  functionCode,
  id,
}: {
  functionCode: number;
  id: number;
}) => {
  const { sendSysexMessage } = useWebMidi();
  const timeoutRef = useRef(setTimeout(() => {}, 0));
  const { setParameterValue } = useStore((state) => state);
  const params = useStore((state) =>
    state.programParameters.find((p) => p.id === id)
  );

  if (!params) {
    return null;
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParameterValue(id, parseInt(e.target.value, 10));

    clearTimeout(timeoutRef.current);

    if (params.active) {
      timeoutRef.current = setTimeout(() => {
        sendSysexMessage(
          functionCode,
          paramChangeSysexMessage(
            params.sysexOutParamVal.ParamNo,
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
        {params.label}
        <br />
        <input
          type="range"
          min={params.valueFrom}
          max={params.valueTo}
          onChange={handleSliderChange}
          value={params.parameterValue}
        />
        <input
          type="number"
          value={params.parameterValue}
          readOnly
          style={{ width: "2rem" }}
        />
      </label>
    </div>
  );
};

export default InputSlider;
