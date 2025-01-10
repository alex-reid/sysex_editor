import { MAX_PARAMETER_VALUE } from "../constants/x5dr/midiinfo";

// split parameter value into two 7 bit values and return as an array
const splitValInto7bitArray = (parameter: number | null) => {
  if (!parameter) {
    return [0, 0];
  }
  return [parameter & 0x7f, (parameter >> 7) & 0x7f];
};

// get a single bit value from an 8 bit number
const getBit = (byte: number, bit: number): boolean => {
  return !!((byte >> bit) & 1);
};

// unpack an array of boolean values from a single byte
const unpackByte = (byte: number): boolean[] => {
  return Array.from({ length: 8 }, (_, i) => getBit(byte, i));
};

const paramChangeSysexMessage = (parameter: number | null, value: number) => {
  let outputValue = value;
  if (outputValue < 0) {
    outputValue += MAX_PARAMETER_VALUE;
  }
  return [
    ...splitValInto7bitArray(parameter || 0),
    ...splitValInto7bitArray(outputValue),
  ];
};

export { splitValInto7bitArray, getBit, unpackByte, paramChangeSysexMessage };
