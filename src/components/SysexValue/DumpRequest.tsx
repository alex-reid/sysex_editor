import { useWebMidi } from "../../contexts/webmidi";

const DumpRequest = ({
  requestCode,
  receiveCode,
  data = [],
  label,
}: {
  requestCode: number;
  receiveCode: number;
  data?: number[];
  label: string;
}) => {
  const { sendSysexDumpRequest } = useWebMidi();
  const handleButtonClick = () => {
    sendSysexDumpRequest(requestCode, receiveCode, data)
      .then((data) => {
        if (data && typeof data === "object") {
          let patchName = "";
          for (let i = 0; i < 10; i++) {
            patchName += String.fromCharCode(data[i]);
          }
          console.log("fetched param dump for", patchName);
        }
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

export default DumpRequest;
