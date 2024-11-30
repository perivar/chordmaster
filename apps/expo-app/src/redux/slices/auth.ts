import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

export type IAuthUser = {
  uid: string;
  displayName: string;
  email: string;
  avatar?: string; // image url
  token?: string; // expo token for notifications
  roles?: string[]; // roles that determine access to app

  // apple credential variables
  appleAuthorizationCode?: string;
  appleUser?: string;
};

export interface IAuthState {
  authenticated?: boolean;
  user?: IAuthUser;
}

const initialState: IAuthState = {
  authenticated: undefined,
  user: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<IAuthUser>) => {
      state.user = action.payload;
      state.authenticated = true;
    },
    logoutUser: state => {
      state.user = undefined;
      state.authenticated = false;
    },
    updateUser: (state, action: PayloadAction<IAuthUser>) => {
      state.user = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
  },
});

// Actions generated from the slice
export const { loginUser, logoutUser, updateAvatar } = authSlice.actions;

// export user selector to get the slice in any component
export const authSelector = (state: RootState) => state.auth;

// export user selector to get the slice in any component
export const userSelector = createSelector(authSelector, auth => {
  return auth.user;
});

export const isUserAuthenticatedSelector = createSelector(
  authSelector,
  auth => {
    return auth.authenticated;
  }
);

// export the reducer
const userReducer = authSlice.reducer;
export default userReducer;
