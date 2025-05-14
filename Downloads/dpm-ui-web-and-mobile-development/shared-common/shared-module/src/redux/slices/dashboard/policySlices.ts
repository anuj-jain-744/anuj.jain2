import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PolicyState, Policy } from "../../../components/types/policy";

const initialState: PolicyState = {
  policies: null,
  loading: false,
  error: "",
  isAuthorized: false,
  showNotification: [],
};

const policySlice = createSlice({
  name: "policy",
  initialState,
  reducers: {
    setPolicies(state, action: PayloadAction<any>) {
      state.policies = action.payload;
    },
    setPolicyLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setPolicyError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setIsAuthorized(state, action: PayloadAction<boolean>) {
      state.isAuthorized = action.payload;
    },
    setShowNotificationResponse(state, action: PayloadAction<any>) {
      state.showNotification = action.payload;
    },
  },
});

export const { setPolicies, setPolicyLoading, setPolicyError, setIsAuthorized, setShowNotificationResponse } = policySlice.actions;
export default policySlice.reducer;