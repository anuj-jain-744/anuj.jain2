import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanguageData, LanguageDataState } from "../../../components/types/languageData";

const initialState: LanguageDataState = {
  languageData: null,
  loading: false,
  error: null,
};

const dashboardLanguageSlice = createSlice({
  name: "dashboardLanguageData",
  initialState,
  reducers: {
    setDashboardLanguageData(state, action: PayloadAction<LanguageData>) {
      state.languageData = action.payload;
      state.loading = false;
    },
    setDashboardLanguageDataLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setDashboardLanguageDataError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;  
    },
    clearDashboardLanguageData(state) {
      state.languageData = null;
      state.error = "";
  },
}
});

export const { setDashboardLanguageData, setDashboardLanguageDataLoading,
     setDashboardLanguageDataError } = dashboardLanguageSlice.actions;
export default dashboardLanguageSlice.reducer;