const displayNumberAsHex = (number: number): string => {
  return `0x${number.toString(16).toUpperCase()}`;
};

export default displayNumberAsHex;
