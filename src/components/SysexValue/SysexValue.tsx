import { useWebMidi } from "../../contexts/webmidi";
import { splitValInto7bitArray } from "../../utils/converters";

const SysyexValue = ({
  functionCode,
  data = [],
  label,
  type = "button",
  parameter = null,
  selectData = [],
}: {
  functionCode: number;
  data?: number[];
  label: string;
  type?: "button" | "slider" | "dropdown" | "input";
  parameter?: number | null;
  selectData?: string[];
}) => {
  const { sendSysexMessage } = useWebMidi();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const randomValue = Math.floor(Math.random() * 128);
    console.log("sent", randomValue);
    sendSysexMessage(functionCode, [
      ...splitValInto7bitArray(parameter),
      ...data,
      value,
      0,
    ])
      .then(() => {
        console.log("recieved", randomValue);

        // console.log(data);
      })
      .catch((error) => {
        console.log("error", randomValue);

        console.error(error);
      });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    const randomValue = Math.floor(Math.random() * 128);
    console.log("sent", randomValue);
    sendSysexMessage(functionCode, [
      ...splitValInto7bitArray(parameter),
      ...splitValInto7bitArray(value),
    ])
      .then(() => {
        // console.log(data);
        console.log("recieved", randomValue);
      })
      .catch((error) => {
        console.error(error);
        console.log("error", randomValue);
      });
  };

  const handleButtonClick = () => {
    sendSysexMessage(functionCode, data)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {type === "button" && (
        <button onClick={handleButtonClick}>{label}</button>
      )}
      {type === "slider" && (
        <label>
          {label}
          <br />
          <input type="range" min="0" max="100" onChange={handleSliderChange} />
        </label>
      )}
      {type === "dropdown" && (
        <label>
          {label}
          <br />
          <select onChange={handleSelectChange}>
            {selectData.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
};

export default SysyexValue;
