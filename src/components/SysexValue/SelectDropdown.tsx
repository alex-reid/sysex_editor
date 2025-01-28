import { useWebMidi } from "../../contexts/webmidi";
import { paramChangeSysexMessage } from "../../utils/converters";
import useStore from "../../store/store";

const SelectDropdown = ({
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParameterValue(params.id, parseInt(e.target.value, 10));

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
      }}
    >
      <label style={{ marginBottom: "0.5rem" }}>
        {label || params?.label || ""}
      </label>
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
    </div>
  );
};

export default SelectDropdown;
