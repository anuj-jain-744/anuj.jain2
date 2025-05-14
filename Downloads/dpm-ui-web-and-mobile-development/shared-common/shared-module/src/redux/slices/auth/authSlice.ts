import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  userInfo: null,
  userToken: null,
  authDetails: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<any>) {
      state.userInfo = action.payload.userInfo;
      state.userToken = action.payload.userToken;
      state.authDetails = action.payload.authDetails;
      state.isAuthenticated = true;
      state.loading = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthData(state) {
      state.userInfo = null;
      state.userToken = null;
      state.isAuthenticated = false;
      state.error = "";
    },
  },
});

export const { setAuth, setAuthLoading, setAuthError, clearAuthData } = authSlice.actions;
export default authSlice.reducer;