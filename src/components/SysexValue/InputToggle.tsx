import { useWebMidi } from "../../contexts/webmidi";
import { paramChangeSysexMessage } from "../../utils/converters";
import useStore from "../../store/store";

const InputToggle = ({
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParameterValue(id, e.target.checked ? 1 : 0);

    sendSysexMessage(
      functionCode,
      paramChangeSysexMessage(
        params.sysexOutParamVal!.ParamNo,
        e.target.checked ? 1 : 0
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
        <input
          type="checkbox"
          checked={params.parameterValue === 1}
          onChange={handleCheckboxChange}
        />
      </label>
    </div>
  );
};

export default InputToggle;
