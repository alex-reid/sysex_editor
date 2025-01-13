import { useCallback, useState } from "react";
import useStore from "../../store/store";

// Define the type for the function getDataFromSysexMessage
type GetDataFromSysexMessage = (sysexMessage: number[]) => number[];

// Define the return type for the custom hook
type UseLoadDumpDataReturnType = [number[] | null, GetDataFromSysexMessage];

const useLoadDumpData = (): UseLoadDumpDataReturnType => {
  const setProgramParameterSysexDump = useStore(
    (state) => state.setProgramParameterSysexDump
  );
  const [dumpData, setDumpData] = useState<number[] | null>(null);
  const getDataFromSysexMessage = useCallback(
    (sysexMessage: number[]) => {
      const data = sysexMessage.slice(5, sysexMessage.length - 1);
      const extractedData = process7BitData(data);
      setDumpData(extractedData);
      setProgramParameterSysexDump(extractedData);
      return extractedData;
    },
    [setProgramParameterSysexDump]
  );
  return [dumpData, getDataFromSysexMessage];
};

function MSBVal(MSB: number, bitNo: number): number {
  const mask = 1 << bitNo;
  if ((MSB & mask) !== 0) {
    return 128;
  }
  return 0;
}

function process7BitData(data: number[]) {
  const output: number[] = [];
  for (let i = 0; i < data.length; i += 8) {
    const MSB_Byte = data[i];
    const b1 = data[i + 1] + MSBVal(MSB_Byte, 0);
    const b2 = data[i + 2] + MSBVal(MSB_Byte, 1);
    const b3 = data[i + 3] + MSBVal(MSB_Byte, 2);
    const b4 = data[i + 4] + MSBVal(MSB_Byte, 3);
    const b5 = data[i + 5] + MSBVal(MSB_Byte, 4);
    const b6 = data[i + 6] + MSBVal(MSB_Byte, 5);
    const b7 = data[i + 7] + MSBVal(MSB_Byte, 6);
    output.push(b1, b2, b3, b4, b5, b6, b7);
  }
  return output;
}

export { useLoadDumpData };
