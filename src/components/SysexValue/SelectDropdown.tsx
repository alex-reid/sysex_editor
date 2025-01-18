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
  const { getParameterById, setParameterValue } = useStore((state) => state);
  const params = getParameterById(id);

  if (!params) {
    return null;
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParameterValue(id, parseInt(e.target.value, 10));

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
  };

  return (
    <div>
      <label>
        {params.label}
        <br />
        <br />
        {params.inputSettings!.values &&
          params.inputSettings!.values.length > 0 && (
            <select onChange={handleSelectChange} value={params.parameterValue}>
              {params.inputSettings!.values.map(({ value: val, label }) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          )}
      </label>
    </div>
  );
};

export default SelectDropdown;
