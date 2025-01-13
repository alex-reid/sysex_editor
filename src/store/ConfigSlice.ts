import { StateCreator } from "zustand";
import { ProgramParameterJson } from "./ProgramSlice";

export interface ConfigJson {
  parameters: ProgramParameterJson[];
  constants: {
    [key: string]: {
      value: number;
      label: string;
    }[];
  };
}

export interface ConfigSlice {
  config: {
    configJSON: ConfigJson;
  };
  addConfigJSON: (json: ConfigJson) => void;
}
export const createConfigSlice: StateCreator<ConfigSlice> = (set) => ({
  config: {
    configJSON: {
      parameters: [],
      constants: {},
    },
  },
  addConfigJSON: (json: ConfigJson) => {
    set((state) => ({
      config: {
        ...state.config,
        configJSON: json,
      },
    }));
  },
});
