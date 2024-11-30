import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { APP_DEFAULTS, USER_APP_DEFAULTS } from "../../constants/defaults";
import { IAppConfig, IUserAppConfig } from "../../hooks/useFirestore";
import { RootState } from "../store";

export interface IConfigState {
  appConfig: IAppConfig;
  userAppConfig: IUserAppConfig;
}

const initialState: IConfigState = {
  appConfig: APP_DEFAULTS,
  userAppConfig: USER_APP_DEFAULTS,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setAppConfigReducer: (state, action: PayloadAction<IAppConfig>) => {
      state.appConfig = action.payload;
    },
    updateAppConfigReducer: (
      state,
      action: PayloadAction<Partial<IAppConfig>>
    ) => {
      // update only part of the state
      // like dispatch(updateAppConfigReducer({language: 'en'})
      state.appConfig = { ...state.appConfig, ...action.payload };
    },
    setUserAppConfigReducer: (state, action: PayloadAction<IUserAppConfig>) => {
      state.userAppConfig = action.payload;
    },
    updateUserAppConfigReducer: (
      state,
      action: PayloadAction<Partial<IUserAppConfig>>
    ) => {
      // update only part of the state
      // like dispatch(updateUserAppConfigReducer({language: 'en'})
      state.userAppConfig = { ...state.userAppConfig, ...action.payload };
    },
  },
});

// Actions generated from the slice
export const {
  setAppConfigReducer,
  updateAppConfigReducer,
  setUserAppConfigReducer,
  updateUserAppConfigReducer,
} = configSlice.actions;

// export app config selector to get the slice in any component
export const configSelector = (state: RootState) => state.config;

// export appConfig selector to get the slice in any component
export const appConfigSelector = createSelector(configSelector, config => {
  return config.appConfig;
});

// export userAppConfig selector to get the slice in any component
export const userAppConfigSelector = createSelector(configSelector, config => {
  return config.userAppConfig;
});

// export the reducer
const configReducer = configSlice.reducer;
export default configReducer;
