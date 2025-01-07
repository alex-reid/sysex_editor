import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import parameterReducer, {
  InitParameterState,
  loadParameter,
  initialState as parameterInitialState,
} from "./parameter";
import { RootState } from "../store/store";

export const selectParameterById = (state: RootState, id: string) => {
  return state.parameters.parameters.find((parameter) => parameter.id === id)
    ?.state;
};

interface ParametersState {
  parameters: { id: string; state: InitParameterState }[];
}

const initialState: ParametersState = {
  parameters: [],
};

const parametersSlice = createSlice({
  name: "parameters",
  initialState,
  reducers: {
    addParameter(
      state,
      action: PayloadAction<{ id: string; parameter: InitParameterState }>
    ) {
      const newParameterState = parameterReducer(
        parameterInitialState,
        loadParameter(action.payload.parameter)
      );

      state.parameters.push({
        id: action.payload.id,
        state: newParameterState,
      });
    },
    removeParameter(state, action: PayloadAction<string>) {
      state.parameters = state.parameters.filter(
        (param) => param.id !== action.payload
      );
    },
    loadParameterFromJSON(state, action) {
      state.parameters = [];
      let id = 0;
      action.payload.forEach((param: InitParameterState) => {
        if (!param.paramType) return;
        const newParameterState = parameterReducer(
          parameterInitialState,
          loadParameter(param)
        );

        state.parameters.push({
          id: "" + id++,
          state: newParameterState,
        });
      });
    },
    updateParameter(
      state,
      action: PayloadAction<{
        id: string;
        action: { type: "parameter/setValue"; payload: number };
      }>
    ) {
      const parameter = state.parameters.find(
        (param) => param.id === action.payload.id
      );
      if (parameter) {
        parameter.state = parameterReducer(
          parameter.state,
          action.payload.action
        );
      }
    },
  },
});

export const {
  addParameter,
  removeParameter,
  updateParameter,
  loadParameterFromJSON,
} = parametersSlice.actions;
export default parametersSlice.reducer;
