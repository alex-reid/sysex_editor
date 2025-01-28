import { StateCreator } from "zustand";
import { ConfigJson } from "./ConfigSlice";
import { getBit } from "../utils/converters";

export interface ProgramParameterJson {
  name: string;
  label: string;
  enabled: boolean;
  active: boolean;
  sysexOutParamVal?: {
    type: string;
    ParamNo: number;
  };
  dumpParamVal?: {
    type: "single" | "double" | "singleBit" | "bitRange" | "special";
    bitNo?: number;
    bitStart?: number;
    bitEnd?: number;
    ParamNo: number;
    specialType?: string;
    specialArgs?: {
      name: string;
      value: number;
    }[];
  };
  inputType: "list" | "number" | "boolean" | "label";
  inputSettings?: {
    values?: {
      value: number | string;
      label: string;
    }[];
    valuesConstant?: string;
    valueFrom?: number;
    valueTo?: number;
    valueStep?: number;
  };
  conditional?: {
    parameterName: string;
    value: number;
  };
  defaultParameterValue?: number;
  children?: ProgramParameterJson[];
}

export type ProgramParameters = ProgramParameterJson & {
  id: number;
  parameterValue: number;
};

export interface ProgramConfig {
  type: string;
  functionCode: number;
}

export interface ProgramSlice {
  programParameters: ProgramParameters[];
  programConfig?: ProgramConfig;
  programParameterSysexDump: number[];
  programParameterSysexDumpOutput: number[];
  programParameterSysexNames: string[];
  addProgramParamater: (parameter: ProgramParameters) => void;
  loadFromJSON: (
    json: ProgramParameterJson[],
    constants: ConfigJson["constants"]
  ) => void;
  getParameterById: (id: number) => ProgramParameters | undefined;
  setParameterValue: (id: number, value: number) => void;
  setParameterActive: (id: number, active: boolean) => void;
  setAllParametersActive: (active: boolean) => void;
  setProgramParameterSysexDump: (dump: number[]) => void;
  getParameterList: () => { id: number; inputType: string; enabled: boolean }[];
  getParameterByName: (name: string) => ProgramParameters | undefined;
  getParameterValueByID: (id: number) => number;
  getParameterValueByName: (name: string) => number;
  getParameterIDByName: (name: string) => number | undefined;
  getParameterNameByID: (id: number) => string | undefined;
  createSysexDumpArray: () => void;
  createProgramParameterSysexNames: () => void;
}

export const createProgramSlice: StateCreator<ProgramSlice, []> = (
  set,
  get
) => ({
  programParameters: [],
  programParameterSysexNames: [],
  programConfig: {
    type: "program",
    functionCode: 0x41,
  },
  programParameterSysexDump: [],
  programParameterSysexDumpOutput: [],
  addProgramParamater: (parameter: ProgramParameters) =>
    set((state) => ({
      programParameters: [...state.programParameters, parameter],
    })),
  loadFromJSON: (json, constants: ConfigJson["constants"]) => {
    set(() => ({
      programParameters: [],
    }));
    // recursively flatten out any children
    const flatJson: ProgramParameterJson[] = [];

    function flattenParameters(
      parameters: ProgramParameterJson[],
      parentName = ""
    ) {
      parameters.forEach((parameter) => {
        if (parameter.children) {
          flatJson.push({
            name: parentName + parameter.name,
            label: parameter.label,
            enabled: true,
            active: false,
            inputType: "label",
          });
          flattenParameters(
            parameter.children,
            parentName + parameter.name + "_"
          );
        } else {
          flatJson.push({ ...parameter, name: parentName + parameter.name });
        }
      });
    }

    flattenParameters(json);

    // console.log(flatJson);

    flatJson.forEach((parameter: ProgramParameterJson, index) => {
      const p = {
        ...parameter,
        id: index,
        active: false,
        parameterValue: parameter.defaultParameterValue || 0,
      };
      if (
        p.inputType === "list" &&
        p.inputSettings &&
        p.inputSettings.valuesConstant
      ) {
        p.inputSettings.values = constants[p.inputSettings?.valuesConstant];
      }
      if (parameter.enabled)
        set((state) => ({
          programParameters: [...state.programParameters, p],
        }));
    });
    // console.log(get().programParameters);
  },
  getParameterById: (id: number) => {
    return get().programParameters.find((p) => p.id === id);
  },
  getParameterByName: (name: string) => {
    return get().programParameters.find((p) => p.name === name);
  },
  setParameterValue: (id: number, value: number) => {
    set((state) => {
      const index = state.programParameters.findIndex((p) => p.id === id);
      const updatedParameter = {
        ...state.programParameters[index],
        parameterValue: value,
      };
      const updatedParameters = [...state.programParameters];
      updatedParameters[index] = updatedParameter;
      return { programParameters: updatedParameters };
    });
  },
  setParameterActive: (id: number, active: boolean) => {
    set((state) => {
      const index = state.programParameters.findIndex((p) => p.id === id);
      const updatedParameter = {
        ...state.programParameters[index],
        active: active,
      };
      const updatedParameters = [...state.programParameters];
      updatedParameters[index] = updatedParameter;
      return { programParameters: updatedParameters };
    });
  },
  setAllParametersActive: (active: boolean) => {
    set((state) => {
      const updatedParameters = state.programParameters.map((p) => ({
        ...p,
        active: active,
      }));
      return { programParameters: updatedParameters };
    });
  },
  setProgramParameterSysexDump: (dump: number[]) => {
    set({ programParameterSysexDump: dump });
    if (dump.length === 0) return;
    if (get().programParameters.length === 0) return;
    get().programParameters.forEach((p) => {
      const dumpParam = p.dumpParamVal;
      if (!dumpParam) return p;
      let dumpValue = 0;
      switch (dumpParam.type) {
        // single byte parameter
        case "single":
          dumpValue = dump[dumpParam.ParamNo];
          // if negative, convert to signed byte by subtracting 0x100
          if ((dumpValue & 0x80) > 0) {
            dumpValue = dumpValue - 0x100;
          }
          break;
        // double byte parameter
        case "double":
          // combine two bytes into a single value
          dumpValue =
            dump[dumpParam.ParamNo] + dump[dumpParam.ParamNo + 1] * 256;
          break;
        // single bit parameter
        case "singleBit":
          // extract bit value from byte by masking and shifting
          dumpValue =
            (dump[dumpParam.ParamNo] & (1 << dumpParam.bitNo!)) >>
            dumpParam.bitNo!;
          break;
        // bit range parameter
        case "bitRange":
          // extract bit range value from byte by masking and shifting
          dumpValue =
            (dump[dumpParam.ParamNo] &
              ((1 << (dumpParam.bitEnd! + 1)) - (1 << dumpParam.bitStart!))) >>
            dumpParam.bitStart!;
          // console.log(p.name, dumpValue, dump[dumpParam.ParamNo]);
          break;
        // special parameter
        case "special":
          dumpValue = specialFunctions(dump[dumpParam.ParamNo], dumpParam);
          break;
      }
      get().setParameterValue(p.id, dumpValue);
    });
  },
  createSysexDumpArray: () => {
    if (get().programParameters.length === 0) return;
    const dumpArray: number[] = [...get().programParameterSysexDump];
    get().programParameters.forEach((p) => {
      const dumpParam = p.dumpParamVal;
      if (!dumpParam) return p;
      let dumpValue = p.parameterValue;
      switch (dumpParam.type) {
        // single byte parameter
        case "single":
          // if negative, convert to unsigned byte by adding 0x100
          if (dumpValue < 0) {
            dumpValue = 0x100 + dumpValue;
          }
          dumpArray[dumpParam.ParamNo] = dumpValue;
          break;
        // double byte parameter
        case "double":
          // split value into two bytes by modulo and division
          dumpArray[dumpParam.ParamNo] = dumpValue % 256;
          dumpArray[dumpParam.ParamNo + 1] = Math.floor(dumpValue / 256);
          break;
        // single bit parameter
        case "singleBit":
          // clear bit in byte by masking and shifting
          dumpArray[dumpParam.ParamNo] =
            (dumpArray[dumpParam.ParamNo] & ~(1 << dumpParam.bitNo!)) | // clear bit
            (dumpValue << dumpParam.bitNo!); // set bit
          break;
        // bit range parameter
        case "bitRange":
          // clear bits in byte by masking and shifting
          dumpArray[dumpParam.ParamNo] =
            (dumpArray[dumpParam.ParamNo] &
              ~((1 << (dumpParam.bitEnd! + 1)) - (1 << dumpParam.bitStart!))) | // clear bits
            (dumpValue << dumpParam.bitStart!); // set bits
          break;
        // special parameter
        case "special":
          // apply special function and then or value to byte
          if (!dumpArray[dumpParam.ParamNo]) dumpArray[dumpParam.ParamNo] = 0;
          dumpArray[dumpParam.ParamNo] |= specialFunctionsInverse(
            dumpValue,
            dumpParam
          );
      }
    });
    set({
      programParameterSysexDumpOutput: dumpArray,
    });
  },
  createProgramParameterSysexNames: () => {
    const programParameterNames: string[] = [];
    get().programParameters.forEach((p) => {
      const dumpParam = p.dumpParamVal;
      if (!dumpParam) return p;
      switch (dumpParam.type) {
        case "single":
        case "double":
          programParameterNames[dumpParam.ParamNo] = p.name;
          break;
        case "singleBit":
        case "bitRange":
        case "special":
          if (!programParameterNames[dumpParam.ParamNo])
            programParameterNames[dumpParam.ParamNo] = p.name;
          else programParameterNames[dumpParam.ParamNo] += ", " + p.name;
          break;
      }
    });
    set({ programParameterSysexNames: programParameterNames });
  },
  getParameterList: () => {
    const state = get();
    return state.programParameters.map((p) => ({
      id: p.id,
      inputType: p.inputType,
      enabled: p.enabled,
    }));
  },
  getParameterValueByID: (id: number) => {
    const p = get().programParameters.find((p) => p.id === id);
    return p ? p.parameterValue : 0;
  },
  getParameterValueByName: (name: string) => {
    const p = get().programParameters.find((p) => p.name === name);
    return p ? p.parameterValue : 0;
  },
  getParameterIDByName: (name: string) => {
    const p = get().programParameters.find((p) => p.name === name);
    return p ? p.id : undefined;
  },
  getParameterNameByID: (id: number) => {
    const p = get().programParameters.find((p) => p.id === id);
    return p ? p.name : undefined;
  },
});

const specialFunctions = (
  dumpValue: number,
  dumpParam: ProgramParameterJson["dumpParamVal"]
) => {
  switch (dumpParam?.specialType) {
    case "korg_x5_sw_pol":
      return korg_x5_sw_pol(
        dumpValue,
        dumpParam.specialArgs![0].value,
        dumpParam.specialArgs![1].value
      );
    default:
      return dumpValue;
  }
};

const specialFunctionsInverse = (
  dumpValue: number,
  dumpParam: ProgramParameterJson["dumpParamVal"]
) => {
  switch (dumpParam?.specialType) {
    case "korg_x5_sw_pol":
      return korg_x5_sw_pol_inverse(dumpValue, dumpParam.specialArgs![0].value);
    default:
      return dumpValue;
  }
};

const korg_x5_sw_pol = (
  dumpValue: number,
  bit1: number,
  bit2: number
): number => {
  // fetch both bit values from dumpValue
  const sw = getBit(dumpValue, bit1);
  const pol = getBit(dumpValue, bit2);
  // console.log({ sw, pol });
  if (sw && !pol) return 1;
  if (sw && pol) return -1;
  return 0;
};

const korg_x5_sw_pol_inverse = (value: number, bit1: number): number => {
  // if (value !== 0) console.log({ value, bit1, bit2 });
  let val = 0;
  switch (value) {
    case 1:
      val |= 1 << bit1;
      // console.log("1", val);
      break;
    case -1:
      val |= 0x11 << bit1;
      // console.log("-1", val);
      break;
    default:
      break;
  }
  // if (value !== 0) console.log(val);
  return val;
};
