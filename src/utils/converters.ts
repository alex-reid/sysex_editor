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

export { splitValInto7bitArray, getBit, unpackByte };
