import { StateCreator } from "zustand";

export interface ProgramParameterJson {
  name: string;
  label: string;
  enabled: boolean;
  active: boolean;
  sysexOutParamVal: {
    type: string;
    ParamNo: number;
  };
  dumpParamVal: {
    type: "single" | "singleBit" | "bitRange";
    bitNo?: number;
    bitStart?: number;
    bitEnd?: number;
    ParamNo: number;
  };
  paramType: "select" | "slider";
  values?: [
    {
      value: number;
      label: string;
    }
  ];
  valueFrom?: number;
  valueTo?: number;
  defaultParameterValue: number;
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
  addProgramParamater: (parameter: ProgramParameters) => void;
  loadFromJSON: (json: ProgramParameterJson[]) => void;
  getParameterById: (id: number) => ProgramParameters | undefined;
  setParameterValue: (id: number, value: number) => void;
  setParameterActive: (id: number, active: boolean) => void;
  setAllParametersActive: (active: boolean) => void;
}

export const createProgramSlice: StateCreator<ProgramSlice, []> = (
  set,
  get
) => ({
  programParameters: [],
  programConfig: {
    type: "program",
    functionCode: 0x41,
  },
  programParameterSysexDump: [],
  addProgramParamater: (parameter: ProgramParameters) =>
    set((state) => ({
      programParameters: [...state.programParameters, parameter],
    })),
  loadFromJSON: (json) => {
    // recursively flatten out any children
    const flatJson: ProgramParameterJson[] = [];

    function flattenParameters(
      parameters: ProgramParameterJson[],
      parentName = ""
    ) {
      parameters.forEach((parameter) => {
        if (parameter.children) {
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

    console.log(flatJson);

    flatJson.forEach((parameter: ProgramParameterJson, index) => {
      const p = {
        ...parameter,
        id: index,
        active: false,
        parameterValue: parameter.defaultParameterValue || 0,
      };
      if (parameter.enabled)
        set((state) => ({
          programParameters: [...state.programParameters, p],
        }));
    });
  },
  getParameterById: (id: number) => {
    return get().programParameters.find((p) => p.id === id);
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
});
