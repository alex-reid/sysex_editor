import { useRef } from "react";
import { useWebMidi } from "../../contexts/webmidi";
import { paramChangeSysexMessage } from "../../utils/converters";
import useStore from "../../store/store";

const SelectDropdown = ({
  functionCode,
  id,
}: {
  functionCode: number;
  id: number;
}) => {
  const { sendSysexMessage } = useWebMidi();
  const timeoutRef = useRef(setTimeout(() => {}, 0));
  const { getParameterById, setParameterValue } = useStore((state) => state);
  const params = getParameterById(id);

  if (!params) {
    return null;
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParameterValue(id, parseInt(e.target.value, 10));

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      sendSysexMessage(
        functionCode,
        paramChangeSysexMessage(
          params.sysexOutParamVal!.ParamNo,
          parseInt(e.target.value, 10)
        )
      )
        .then((data) => {
          console.log("value sent", data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 30);
  };

  return (
    <div>
      <label>
        {params.values && params.values.length > 0 && (
          <select onChange={handleSelectChange} value={params.parameterValue}>
            {params.values.map(({ value: val, label }) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        )}
        <br />
        {params.label}
      </label>
    </div>
  );
};

export default SelectDropdown;
