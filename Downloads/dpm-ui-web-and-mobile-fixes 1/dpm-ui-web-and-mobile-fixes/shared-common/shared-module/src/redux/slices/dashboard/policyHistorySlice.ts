import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  policyHistory: null,
  loading: false,
  error: "",
  isAuthorized: false,
};

const policyHistorySlice = createSlice({
  name: "policyHistory",
  initialState,
  reducers: {
    setpolicyHistory(state, action: PayloadAction<any>) {
      state.policyHistory = action.payload;
    },
    setpolicyHistoryLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setpolicyHistoryError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  },
});

export const { setpolicyHistory, setpolicyHistoryLoading, setpolicyHistoryError } = policyHistorySlice.actions;
export default policyHistorySlice.reducer;