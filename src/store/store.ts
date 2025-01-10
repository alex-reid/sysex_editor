import { create } from "zustand";
import { ProgramSlice, createProgramSlice } from "./ProgramSlice";

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
*/

const useStore = create<ProgramSlice>()((...a) => ({
  ...createProgramSlice(...a),
  // combination: createCombiSlice(...a),
  // drumKit: createDrumKitSlice(...a),
  // multi: createMultiSlice(...a),
  // globals: createGlobalsSlice(...a),
  // effects: createEffectsSlice(...a),
}));

export default useStore;
