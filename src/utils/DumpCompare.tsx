import { useEffect } from "react";
import useStore from "../store/store";

const DumpCompare = () => {
  const sysexdump = useStore((state) => state.programParameterSysexDump);
  const createNames = useStore(
    (state) => state.createProgramParameterSysexNames
  );
  const names = useStore((state) => state.programParameterSysexNames);
  const createdDump = useStore(
    (state) => state.programParameterSysexDumpOutput
  );
  const createSysexDump = useStore((state) => state.createSysexDumpArray);
  useEffect(() => {
    createNames();
  }, []);

  return (
    <div>
      <h3>Sysex Dump:</h3>
      <button onClick={createSysexDump}>Create Sysex Dump</button>
      <p>sysex dump length: {sysexdump.length}</p>
      <p>created dump length: {createdDump?.length}</p>
      {createdDump && sysexdump.length > 0 && (
        <div style={{ textAlign: "left" }}>
          {sysexdump.map((d, i) => (
            <div key={i}>
              <span style={{ color: "green" }}>
                {i} {names[i]}:
              </span>
              <br />
              {d} - {createdDump[i]} | {d.toString(16)} -{" "}
              {createdDump[i]?.toString(16)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DumpCompare;
