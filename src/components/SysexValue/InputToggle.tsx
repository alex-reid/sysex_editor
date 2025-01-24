import { useWebMidi } from "../../contexts/webmidi";
import { paramChangeSysexMessage } from "../../utils/converters";
import useStore from "../../store/store";

const InputToggle = ({
  functionCode,
  name,
  label,
}: {
  functionCode: number;
  name: string;
  label?: string;
}) => {
  const { sendSysexMessage } = useWebMidi();
  const { setParameterValue } = useStore((state) => state);
  const params = useStore((state) => state.getParameterByName(name));

  if (!params) {
    return null;
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParameterValue(params.id, e.target.checked ? 1 : 0);

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
        {label || params?.label || ""}
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
