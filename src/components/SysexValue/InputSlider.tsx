import { useEffect, useRef, useState } from "react";
import { useWebMidi } from "../../contexts/webmidi";
import { splitValInto7bitArray } from "../../utils/converters";
import { MAX_PARAMETER_VALUE } from "../../constants/x5dr/midiinfo";

const InputSlider = ({
  functionCode,
  label,
  parameter = null,
  lowValue = 0,
  highValue = 99,
  initValue = 0,
}: {
  functionCode: number;
  label: string;
  parameter?: number | null;
  lowValue?: number;
  highValue?: number;
  initValue?: number;
}) => {
  const { sendSysexMessage } = useWebMidi();
  const [value, setValue] = useState(initValue);
  const timeoutRef = useRef(setTimeout(() => {}, 0));

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      let outputValue = value;
      if (outputValue < 0) {
        outputValue += MAX_PARAMETER_VALUE;
      }
      console.log("sent", outputValue);
      sendSysexMessage(functionCode, [
        ...splitValInto7bitArray(parameter),
        ...splitValInto7bitArray(outputValue),
      ])
        .then(() => {
          // console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 30);

    return () => clearTimeout(timeoutRef.current);
  }, [value, functionCode, parameter, sendSysexMessage]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <label>
        {label}
        <br />
        <input
          type="range"
          min={lowValue}
          max={highValue}
          onChange={handleSliderChange}
          value={value}
        />
        <input type="number" value={value} readOnly style={{ width: "2rem" }} />
      </label>
    </div>
  );
};

export default InputSlider;
