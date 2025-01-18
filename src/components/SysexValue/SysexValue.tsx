import { useWebMidi } from "../../contexts/webmidi";

const SysyexValue = ({
  functionCode,
  data = [],
  label,
}: {
  functionCode: number;
  data?: number[];
  label: string;
  type?: "button" | "slider" | "dropdown" | "input";
  parameter?: number | null;
  selectData?: string[];
}) => {
  const { sendSysexMessage } = useWebMidi();

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
      <button onClick={handleButtonClick}>{label}</button>
    </div>
  );
};

export default SysyexValue;
