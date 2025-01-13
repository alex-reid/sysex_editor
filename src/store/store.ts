import { create } from "zustand";
import { ProgramSlice, createProgramSlice } from "./ProgramSlice";
import { ConfigSlice, createConfigSlice } from "./ConfigSlice";

/*
Blueprints for the store
store
  |- program
  |  |- parameters
  |- combination
  |  |- parameters
  |- drum kit
  |  |- parameters
  |- multi
  |  |- parameters
  |- globals
  |  |- parameters
  |- effects
  |  |- parameters
  |- config
*/

const useStore = create<ProgramSlice & ConfigSlice>()((...a) => ({
  ...createProgramSlice(...a),
  ...createConfigSlice(...a),
  // combination: createCombiSlice(...a),
  // drumKit: createDrumKitSlice(...a),
  // multi: createMultiSlice(...a),
  // globals: createGlobalsSlice(...a),
  // effects: createEffectsSlice(...a),
}));

export default useStore;
