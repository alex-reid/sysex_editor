import { useEffect, useRef, useState } from "react";
import { useWebMidi } from "../../contexts/webmidi";
import { splitValInto7bitArray } from "../../utils/converters";
import { MAX_PARAMETER_VALUE } from "../../constants/x5dr/midiinfo";

const SelectDropdown = ({
  functionCode,
  label,
  parameter = null,
  selectData = [],
  initValue = 0,
}: {
  functionCode: number;
  label: string;
  parameter?: number | null;
  selectData?: { value: number; label: string }[];
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <label>
        {label}
        <br />
        <select onChange={handleSelectChange} value={value}>
          {selectData.map(({ value: val, label }) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SelectDropdown;
