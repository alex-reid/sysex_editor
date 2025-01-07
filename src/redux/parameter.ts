import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface InitParameterState {
  name: string | null;
  label: string | null;
  enabled: boolean;
  sysexOutParamVal: {
    type: string | null;
    ParamNo: number | null;
  };
  dumpParamVal: {
    type: string | null;
    ParamNo: number | null;
  };
  paramType: string | null;
  values?: { value: number; label: string }[] | null;
  value?: number;
  valueFrom?: number | null;
  valueTo?: number | null;
}

export const initialState: InitParameterState = {
  name: null,
  label: null,
  enabled: false,
  sysexOutParamVal: {
    type: null,
    ParamNo: null,
  },
  dumpParamVal: {
    type: null,
    ParamNo: null,
  },
  paramType: null,
  values: null,
  value: 0,
  valueFrom: null,
  valueTo: null,
};

export const paramaterSlice = createSlice({
  name: "parameter",
  initialState,
  reducers: {
    loadParameter: (state, action: PayloadAction<InitParameterState>) => {
      const {
        name,
        label,
        sysexOutParamVal,
        dumpParamVal,
        paramType,
        values,
        enabled,
      } = action.payload;
      state.name = name;
      state.label = label;
      state.sysexOutParamVal.type = sysexOutParamVal.type;
      state.sysexOutParamVal.ParamNo = sysexOutParamVal.ParamNo;
      state.dumpParamVal.type = dumpParamVal.type;
      state.dumpParamVal.ParamNo = dumpParamVal.ParamNo;
      state.paramType = paramType;
      if (paramType === "select") {
        state.values = values;
      }
      if (paramType === "slider") {
        state.valueFrom = action.payload.valueFrom;
        state.valueTo = action.payload.valueTo;
      }
      if (
        name &&
        label &&
        typeof sysexOutParamVal.ParamNo === "number" &&
        typeof dumpParamVal.ParamNo === "number" &&
        paramType &&
        enabled
      ) {
        state.enabled = true;
      }
    },
    setValue: (state, action: PayloadAction<number>) => {
      if (state.enabled) {
        state.value = action.payload;
        console.log("state.value", state.value);
      } else {
        console.log("state is disabled");
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { loadParameter, setValue } = paramaterSlice.actions;

export default paramaterSlice.reducer;
