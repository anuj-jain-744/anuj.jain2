import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  currentPolicy: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboardData",
  initialState,
  reducers: {
    setDashboard(state, action: PayloadAction<any>) {
      state.currentPolicy = action.payload.currentPolicy;
      state.loading = false;
    },
    setDashboardLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setDashboardError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;  
    },
    clearDashboardData(state) {
      state.currentPolicy = null;
      state.error = "";
  },
}
});

export const { setDashboard, setDashboardLoading,
  setDashboardError, clearDashboardData } = dashboardSlice.actions;
   
export default dashboardSlice.reducer;